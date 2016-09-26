'use strict';

System.register(['./libs/mermaid/dist/mermaidAPI', 'app/plugins/sdk', './properties', 'lodash', './diagram.css!', './libs/mermaid/dist/mermaid.css!'], function (_export, _context) {
	"use strict";

	var MetricsPanelCtrl, diagramEditor, displayEditor, _, _createClass, panelDefaults, DiagramCtrl;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		}

		subClass.prototype = Object.create(superClass && superClass.prototype, {
			constructor: {
				value: subClass,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	return {
		setters: [function (_libsMermaidDistMermaidAPI) {}, function (_appPluginsSdk) {
			MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
		}, function (_properties) {
			diagramEditor = _properties.diagramEditor;
			displayEditor = _properties.displayEditor;
		}, function (_lodash) {
			_ = _lodash.default;
		}, function (_diagramCss) {}, function (_libsMermaidDistMermaidCss) {}],
		execute: function () {
			_createClass = function () {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) descriptor.writable = true;
						Object.defineProperty(target, descriptor.key, descriptor);
					}
				}

				return function (Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps);
					if (staticProps) defineProperties(Constructor, staticProps);
					return Constructor;
				};
			}();

			panelDefaults = {
				initialZoom: 1,
				thresholds: '0,10',
				colors: ['rgba(245, 54, 54, 0.9)', 'rgba(237, 129, 40, 0.89)', 'rgba(50, 172, 45, 0.97)'],
				showLegend: true,
				content: 'graph LR\n' + 'A[Square Rect] -- Link text --> B((Circle))\n' + 'A --> C(Round Rect)\n' + 'B --> D{Rhombus}\n' + 'C --> D\n'
			};

			_export('DiagramCtrl', DiagramCtrl = function (_MetricsPanelCtrl) {
				_inherits(DiagramCtrl, _MetricsPanelCtrl);

				function DiagramCtrl($scope, $injector, $sce) {
					_classCallCheck(this, DiagramCtrl);

					var _this2 = _possibleConstructorReturn(this, (DiagramCtrl.__proto__ || Object.getPrototypeOf(DiagramCtrl)).call(this, $scope, $injector));

					_.defaults(_this2.panel, panelDefaults);
					_this2.panel.graphId = 'graph_' + _this2.panel.id;

					//this.debugInfoEnabled(true);
					console.log($scope);

					_this2.$sce = $sce;
					_this2.events.on('init-edit-mode', _this2.onInitEditMode.bind(_this2));
					_this2.events.on('data-received', _this2.onDataReceived.bind(_this2));

					mermaidAPI.initialize({
						startOnLoad: false,
						logLevel: 1
					});

					mermaidAPI.parseError = _this2.handleParseError.bind(_this2);
					return _this2;
				}

				_createClass(DiagramCtrl, [{
					key: 'handleParseError',
					value: function handleParseError(err, hash) {
						this.svg = '<p>Diagram Definition:</p><pre>' + err + '</pre>';
					}
				}, {
					key: 'onInitEditMode',
					value: function onInitEditMode() {
						this.addEditorTab('Diagram', diagramEditor, 2);
						this.addEditorTab('Display', displayEditor, 3);
					}
				}, {
					key: 'onDataReceived',
					value: function onDataReceived(data) {
						console.info('received data');
						console.log(data);
						this.updateDiagram();
					}
				}, {
					key: 'updateDiagram',
					value: function updateDiagram() {
						var _this = this;
						if (this.panel.content.length > 0) {
							var graphDefinition = this.panel.content + '\n';
							mermaidAPI.render(this.panel.graphId, graphDefinition, function svgCallback(svgCode, bindFunctions) {
								//console.log(svgCode);
								_this.svg = _this.$sce.trustAsHtml(svgCode);
							});
						} else {}
					}
				}]);

				return DiagramCtrl;
			}(MetricsPanelCtrl));

			_export('DiagramCtrl', DiagramCtrl);

			DiagramCtrl.templateUrl = 'module.html';
		}
	};
});
//# sourceMappingURL=diagramControl.js.map
