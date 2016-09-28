import './libs/mermaid/dist/mermaidAPI';
import TimeSeries from 'app/core/time_series2';
import kbn from 'app/core/utils/kbn';
import {MetricsPanelCtrl} from 'app/plugins/sdk';
import {diagramEditor, displayEditor} from './properties';
import _ from 'lodash';
import './libs/mermaid/dist/mermaid.forest.css!'
import './diagram.css!'

const panelDefaults = {
	initialZoom: 1,
	thresholds: '0,10',
	colors: ['rgba(245, 54, 54, 0.9)', 'rgba(237, 129, 40, 0.89)', 'rgba(50, 172, 45, 0.97)'],
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
		'C --> D\n'
};

class DiagramCtrl extends MetricsPanelCtrl {
	constructor($scope, $injector, $sce) {
		super($scope, $injector);
		_.defaults(this.panel, panelDefaults);
		this.panel.graphId = 'graph_' + this.panel.id;
		
		//this.debugInfoEnabled(true);
		console.log($scope);
		
		this.$sce = $sce;
		this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
		this.events.on('data-received', this.onDataReceived.bind(this));
		this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
		
		mermaidAPI.initialize({
		    startOnLoad:false,
		    cloneCssStyles: false,
		    logLevel: 1
		});
		
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
	}

	seriesHandler(seriesData) {
		console.info('creating TimeSeries');
		console.debug(seriesData);
		var series = new TimeSeries({
			datapoints: seriesData.datapoints,
			alias: seriesData.target,
		});

	    series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
	    console.info('created TimeSeries from seriesdata');
	    console.debug(series);
	    return series;
	} // End seriesHandler()

	updateDiagram(data){
		if(this.panel.content.length > 0){
			var graphDefinition = this.panel.content + '\n';
		    mermaidAPI.render(this.panel.graphId, graphDefinition, function svgCallback(svgCode, bindFunctions){
			    //console.log(svgCode);
			    var svg = this.updateStyle(svgCode, data);
			    this.svg = this.$sce.trustAsHtml(svg);
			}.bind(this));
		}
	} // End updateDiagram()
	
	updateStyle(svgCode, data){
		console.info('updating svg style');
		var svg = $('<div>' + svgCode + '</div>');
		console.debug($(svg));
		console.debug(data);
		for(var key in data){
			var seriesItem = data[key];
			console.debug(seriesItem);
			//var targetElement = $(svg).find('#A').first();
			var targetElement = $(svg).find('#'+key).first();
			console.info('setting node:' + key + ' to color:' + seriesItem.color);
			targetElement.children().css('fill', seriesItem.color);
		}
		console.debug($(svg).html());
		return $(svg).html();
	} // End updateStyle()
	
	setValues(data) {
		var colorData = {};
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
			        data[seriesItem.alias].valueFormated = formatFunc(data[seriesItem.alias].value, decimalInfo.decimals, decimalInfo.scaledDecimals);
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