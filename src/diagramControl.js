import './libs/mermaid/dist/mermaidAPI';
import TimeSeries from 'app/core/time_series2';
import kbn from 'app/core/utils/kbn';
import {MetricsPanelCtrl} from 'app/plugins/sdk';
import {diagramEditor, displayEditor} from './properties';
import _ from 'lodash';
//import './libs/mermaid/dist/mermaid.forest.css!'
import './css/diagram.css!'

const panelDefaults = {
	initialZoom: 1,
	thresholds: '0,10',
	colors: ['rgba(50, 172, 45, 0.97)', 'rgba(237, 129, 40, 0.89)', 'rgba(245, 54, 54, 0.9)'],
	showLegend: true,
	maxDataPoints: 100,
	mappingType: 1,
	nullPointMode: 'connected',
	format: 'none',
	valueName: 'avg',
    valueMaps: [
      { value: 'null', op: '=', text: 'N/A' }
    ],
    content: 'graph LR\n' +
		'A[Square Rect] -- Link text --> B((Circle))\n' +
		'A --> C(Round Rect)\n' +
		'B --> D{Rhombus}\n' +
		'C --> D\n',
	init: {
		startOnLoad: false,
		logLevel: 2, //1:debug, 2:info, 3:warn, 4:error, 5:fatal
    	cloneCssStyles: false, // - This options controls whether or not the css rules should be copied into the generated svg
		startOnLoad: false, // - This options controls whether or mermaid starts when the page loads
		arrowMarkerAbsolute: true, // - This options controls whether or arrow markers in html code will be absolute paths or an anchor, #. This matters if you are using base tag settings.
		flowchart: {
			htmlLabels: true,
			useMaxWidth: true
		},
		sequenceDiagram: {
			diagramMarginX: 50, // - margin to the right and left of the sequence diagram
			diagramMarginY: 10, // - margin to the over and under the sequence diagram
			actorMargin: 50, // - Margin between actors
			width: 150, // - Width of actor boxes
			height: 65, // - Height of actor boxes00000000001111
			boxMargin: 10, // - Margin around l01oop boxes
			boxTextMargin: 5, // - margin around the text in loop/alt/opt boxes
			noteMargin: 10, // - margin around notes
			messageMargin: 35, // - Space between messages
			mirrorActors: true, // - mirror actors under diagram
			bottomMarginAdj: 1, // - Depending on css styling this might need adjustment. Prolongs the edge of the diagram downwards
			useMaxWidth: true, // - when this flag is set the height and width is set to 100% and is then scaling with the available space if not the absolute space required is used
		},
		gantt: {
			titleTopMargin: 25, // - margin top for the text over the gantt diagram
			barHeight: 20, // - the height of the bars in the graph
			barGap: 4, // - the margin between the different activities in the gantt diagram
			topPadding: 50, // - margin between title and gantt diagram and between axis and gantt diagram.
			leftPadding: 75, // - the space allocated for the section name to the left of the activities.
			gridLineStartPadding: 35, // - Vertical starting position of the grid lines
			fontSize: 11, // - font size ...
			fontFamily: '"Open-Sans", "sans-serif"', // - font family ...
			numberSectionStyles: 3, // - the number of alternating section styles
			/** axisFormatter: // - formatting of the axis, this might need adjustment to match your locale and preferences
				[
		        // Within a day
		        ['%I:%M', function (d) {
		            return d.getHours();
		        }],
		        // Monday a week
		        ['w. %U', function (d) {
		            return d.getDay() == 1;
		        }],
		        // Day within a week (not monday)
		        ['%a %d', function (d) {
		            return d.getDay() && d.getDate() != 1;
		        }],
		        // within a month
		        ['%b %d', function (d) {
		            return d.getDate() != 1;
		        }],
		        // Month
		        ['%m-%y', function (d) {
		            return d.getMonth();
		        }]] **/
		},
		//classDiagram: {},
    	//info: {}
	}
};

class DiagramCtrl extends MetricsPanelCtrl {
	constructor($scope, $injector, $sce) {
		super($scope, $injector);
		_.defaults(this.panel, panelDefaults);
		
		this.panel.graphId = 'diagram_' + this.panel.id;
		this.containerDivId = 'container_'+this.panel.graphId;
		this.svg = {};		
		this.$sce = $sce;
		this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
		this.events.on('data-received', this.onDataReceived.bind(this));
		this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
		this.initializeMermaid();
	}
	
	initializeMermaid(){
		mermaidAPI.initialize(this.panel.init);
		mermaidAPI.parseError = this.handleParseError.bind(this);
	}
	
	handleParseError(err, hash){
		this.svg = '<p>Diagram Definition:</p><pre>' + err + '</pre>';
	}
	
	onInitEditMode() {
		this.addEditorTab('Diagram', diagramEditor, 2);
		this.addEditorTab('Display', displayEditor, 3);
	}
	
	onDataReceived(dataList){
		console.info('received data');
		console.debug(dataList);
		this.series = dataList.map(this.seriesHandler.bind(this));
		console.info('mapped dataList to series');
		console.debug(this.series);

		var data = {};
		this.setValues(data);
		this.updateDiagram(data);
		this.render();
	}

	seriesHandler(seriesData) {
		var series = new TimeSeries({
			datapoints: seriesData.datapoints,
			alias: seriesData.target,
		});
	    series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
	    return series;
	} // End seriesHandler()
	
	clearDiagram(){
		$('#'+this.panel.graphId).remove();
		this.svg = {};
	}

	updateDiagram(data){
		if(this.panel.content.length > 0){
			this.clearDiagram();
			var _this = this;
			var graphDefinition = this.panel.content;
			var renderCallback = function (svgCode, bindFunctions){
			    var svg = _this.updateStyle(svgCode, data);
			    _this.svg = _this.$sce.trustAsHtml(svg);
			};
		    mermaidAPI.render(this.panel.graphId, graphDefinition, renderCallback);
		}
	} // End updateDiagram()
	
	updateStyle(svgCode, data){
		console.info('updating svg style');
		var svg = $('<div>' + svgCode + '</div>');
		for(var key in data){
			var seriesItem = data[key];
			
			// Find nodes by ID if we can
			console.info('finding targetElement');
			var targetElement = $(svg).find('#'+key).first(); 
			
			if(targetElement.length > 0){ // must be a flowchart
				targetElement.children().css('fill', seriesItem.color);
				// Add value text
				targetElement.find('div').first().append('<p class="diagram-value" style="background-color:'+seriesItem.color+'">'+seriesItem.valueFormatted+'</p>');
			} else {
				targetElement = $(svg).find('text:contains("'+key+'")'); // sequence diagram, gantt ?
				targetElement.parent().find('rect, circle, poly').css('fill', seriesItem.color);
				targetElement.append('\n' + seriesItem.valueFormatted);
			}
			
			console.debug(targetElement);
			console.info('set nodes:' + key + ' to color:' + seriesItem.color);
		}
		return $(svg).html();
	} // End updateStyle()
	
	setValues(data) {
		var colorData = {};
		console.info('using thresholds');
		console.debug(this.panel.thresholds);
		console.debug(this.panel.thresholds.split(','));
		colorData.thresholds = this.panel.thresholds.split(',').map(function(strVale) {
			return Number(strVale.trim());
		});
		colorData.colorMap = this.panel.colors;
		
	    if (this.series && this.series.length > 0) {
			for(var i = 0; i < this.series.length; i++){
				var seriesItem = this.series[i];
				console.debug('setting values for series');
				console.debug(seriesItem);
				data[seriesItem.alias] = {};
				var lastPoint = _.last(seriesItem.datapoints);
			    var lastValue = _.isArray(lastPoint) ? lastPoint[0] : null;
			
				if (this.panel.valueName === 'name') {
					data[seriesItem.alias].value = 0;
			        data[seriesItem.alias].valueRounded = 0;
			        data[seriesItem.alias].valueFormated = seriesItem.alias;
				} else if (_.isString(lastValue)) {
			        data[seriesItem.alias].value = 0;
			        data[seriesItem.alias].valueFormated = _.escape(lastValue);
			        data[seriesItem.alias].valueRounded = 0;
				} else {
					data[seriesItem.alias].value = seriesItem.stats[this.panel.valueName];
			        //data[seriesItem.alias].flotpairs = seriesItem.flotpairs;
			
			        var decimalInfo = this.getDecimalsForValue(data[seriesItem.alias].value);
			        var formatFunc = kbn.valueFormats[this.panel.format];
			        data[seriesItem.alias].valueFormatted = formatFunc(data[seriesItem.alias].value, decimalInfo.decimals, decimalInfo.scaledDecimals);
			        data[seriesItem.alias].valueRounded = kbn.roundValue(data[seriesItem.alias].value, decimalInfo.decimals);
				}
				data[seriesItem.alias].color = getColorForValue(colorData, data[seriesItem.alias].value);
			}
	    }
	} // End setValues()
	
	invertColorOrder() {
	    var tmp = this.panel.colors[0];
	    this.panel.colors[0] = this.panel.colors[2];
	    this.panel.colors[2] = tmp;
	}

	getDecimalsForValue(value) {
	    if (_.isNumber(this.panel.decimals)) {
	      return {decimals: this.panel.decimals, scaledDecimals: null};
	    }

	    var delta = value / 2;
	    var dec = -Math.floor(Math.log(delta) / Math.LN10);
	
	    var magn = Math.pow(10, -dec),
	      norm = delta / magn, // norm is between 1.0 and 10.0
	      size;
	
	    if (norm < 1.5) {
	      size = 1;
	    } else if (norm < 3) {
	      size = 2;
	      // special case for 2.5, requires an extra decimal
	      if (norm > 2.25) {
	        size = 2.5;
	        ++dec;
	      }
	    } else if (norm < 7.5) {
	      size = 5;
	    } else {
	      size = 10;
	    }
	
	    size *= magn;
	
	    // reduce starting decimals if not needed
	    if (Math.floor(value) === value) { dec = 0; }
	
	    var result = {};
	    result.decimals = Math.max(0, dec);
	    result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;
	
	    return result;
	}
	
	link(scope, elem, attrs, ctrl) {
	    var diagramElement = elem.find('.diagram');
    	console.debug('found diagram panel');
    	console.debug(diagramElement);
    	elem.css('height', ctrl.height + 'px');
    	
    	function render(){
    		setElementHeight();
    	}
    	
    	function setElementHeight() {
	      diagramElement.css('height', ctrl.height + 'px');
	    }
    	
    	this.events.on('render', function() {
			render();
			ctrl.renderingCompleted();
	    });
	}
// End Class
}

function getColorForValue(data, value) {
	console.info('Getting color for value');
	console.debug(data);
	console.debug(value);
	for (var i = data.thresholds.length; i > 0; i--) {
		if (value >= data.thresholds[i-1]) {
		return data.colorMap[i];
	}
  }
  return _.first(data.colorMap);
}

DiagramCtrl.templateUrl = 'module.html';

export {
	DiagramCtrl,
	DiagramCtrl as MetricsPanelCtrl
};