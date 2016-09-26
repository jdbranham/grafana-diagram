import './libs/mermaid/dist/mermaidAPI';
import {MetricsPanelCtrl} from 'app/plugins/sdk';
import {diagramEditor, displayEditor} from './properties';
import _ from 'lodash';
import './diagram.css!'
import './libs/mermaid/dist/mermaid.css!'

const panelDefaults = {
	initialZoom: 1,
	thresholds: '0,10',
	colors: ['rgba(245, 54, 54, 0.9)', 'rgba(237, 129, 40, 0.89)', 'rgba(50, 172, 45, 0.97)'],
	showLegend: true,
	content: 'graph LR\n' +
		'A[Square Rect] -- Link text --> B((Circle))\n' +
		'A --> C(Round Rect)\n' +
		'B --> D{Rhombus}\n' +
		'C --> D\n'
};

export class DiagramCtrl extends MetricsPanelCtrl {
	constructor($scope, $injector, $sce) {
		super($scope, $injector);
		_.defaults(this.panel, panelDefaults);
		this.panel.graphId = 'graph_' + this.panel.id;
		
		//this.debugInfoEnabled(true);
		console.log($scope);
		
		this.$sce = $sce;
		this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
		this.events.on('data-received', this.onDataReceived.bind(this));
		
		mermaidAPI.initialize({
		    startOnLoad:false,
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
	
	onDataReceived(data){
		console.info('received data');
		console.log(data);
		this.updateDiagram();
	}

	updateDiagram(){
		var _this = this;
		if(this.panel.content.length > 0){
			var graphDefinition = this.panel.content + '\n';
		    mermaidAPI.render(this.panel.graphId, graphDefinition, function svgCallback(svgCode, bindFunctions){
			    //console.log(svgCode);
			    _this.svg = _this.$sce.trustAsHtml(svgCode);
			});
		} else {
			
		}
	}
}

DiagramCtrl.templateUrl = 'module.html';