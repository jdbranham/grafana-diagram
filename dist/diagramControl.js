'use strict';

System.register(['./libs/mermaid/dist/mermaidAPI', 'app/core/time_series2', 'app/core/utils/kbn', 'app/plugins/sdk', './properties', 'lodash', './libs/mermaid/dist/mermaid.forest.css!', './diagram.css!'], function (_export, _context) {
	"use strict";

	var TimeSeries, kbn, MetricsPanelCtrl, diagramEditor, displayEditor, _, _createClass, panelDefaults, DiagramCtrl;

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

	function getColorForValue(data, value) {
		console.info('Getting color for value');
		console.debug(data);
		console.debug(value);
		for (var i = data.thresholds.length; i > 0; i--) {
			if (value >= data.thresholds[i - 1]) {
				return data.colorMap[i];
			}
		}
		return _.first(data.colorMap);
	}

	return {
		setters: [function (_libsMermaidDistMermaidAPI) {}, function (_appCoreTime_series) {
			TimeSeries = _appCoreTime_series.default;
		}, function (_appCoreUtilsKbn) {
			kbn = _appCoreUtilsKbn.default;
		}, function (_appPluginsSdk) {
			MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
		}, function (_properties) {
			diagramEditor = _properties.diagramEditor;
			displayEditor = _properties.displayEditor;
		}, function (_lodash) {
			_ = _lodash.default;
		}, function (_libsMermaidDistMermaidForestCss) {}, function (_diagramCss) {}],
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
				maxDataPoints: 100,
				mappingType: 1,
				nullPointMode: 'connected',
				format: 'none',
				valueName: 'avg',
				valueMaps: [{ value: 'null', op: '=', text: 'N/A' }],
				content: 'graph LR\n' + 'A[Square Rect] -- Link text --> B((Circle))\n' + 'A --> C(Round Rect)\n' + 'B --> D{Rhombus}\n' + 'C --> D\n'
			};

			_export('MetricsPanelCtrl', _export('DiagramCtrl', DiagramCtrl = function (_MetricsPanelCtrl) {
				_inherits(DiagramCtrl, _MetricsPanelCtrl);

				function DiagramCtrl($scope, $injector, $sce) {
					_classCallCheck(this, DiagramCtrl);

					var _this2 = _possibleConstructorReturn(this, (DiagramCtrl.__proto__ || Object.getPrototypeOf(DiagramCtrl)).call(this, $scope, $injector));

					_.defaults(_this2.panel, panelDefaults);

					_this2.panel.graphId = 'diagram_' + _this2.panel.id;
					_this2.containerDivId = 'container_' + _this2.panel.graphId;
					_this2.svg = {};
					_this2.$sce = $sce;
					_this2.events.on('init-edit-mode', _this2.onInitEditMode.bind(_this2));
					_this2.events.on('data-received', _this2.onDataReceived.bind(_this2));
					_this2.events.on('data-snapshot-load', _this2.onDataReceived.bind(_this2));
					_this2.initializeMermaid();
					return _this2;
				}

				_createClass(DiagramCtrl, [{
					key: 'initializeMermaid',
					value: function initializeMermaid() {
						mermaidAPI.initialize({
							startOnLoad: false,
							cloneCssStyles: false,
							logLevel: 1,
							flowchart: {
								useMaxWidth: true
							}
						});
						mermaidAPI.parseError = this.handleParseError.bind(this);
					}
				}, {
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
					value: function onDataReceived(dataList) {
						console.info('received data');
						console.debug(dataList);
						this.series = dataList.map(this.seriesHandler.bind(this));
						console.info('mapped dataList to series');
						console.debug(this.series);

						var data = {};
						this.setValues(data);
						this.updateDiagram(data);
					}
				}, {
					key: 'seriesHandler',
					value: function seriesHandler(seriesData) {
						var series = new TimeSeries({
							datapoints: seriesData.datapoints,
							alias: seriesData.target
						});
						series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
						return series;
					}
				}, {
					key: 'clearDiagram',
					value: function clearDiagram() {
						$('#' + this.panel.graphId).remove();
						this.svg = {};
					}
				}, {
					key: 'updateDiagram',
					value: function updateDiagram(data) {
						if (this.panel.content.length > 0) {
							this.clearDiagram();
							var _this = this;
							var graphDefinition = this.panel.content;
							var renderCallback = function renderCallback(svgCode, bindFunctions) {
								var svg = _this.updateStyle(svgCode, data);
								_this.svg = _this.$sce.trustAsHtml(svg);
							};
							mermaidAPI.render(this.panel.graphId, graphDefinition, renderCallback);
						}
					}
				}, {
					key: 'updateStyle',
					value: function updateStyle(svgCode, data) {
						console.info('updating svg style');
						var svg = $('<div>' + svgCode + '</div>');
						for (var key in data) {
							var seriesItem = data[key];
							var targetElement = $(svg).find('#' + key).first();
							console.info('setting node:' + key + ' to color:' + seriesItem.color);
							targetElement.children().css('fill', seriesItem.color);
							targetElement.find('div').first().append('<p class="diagram-value" style="background-color:' + seriesItem.color + '">' + seriesItem.valueFormatted + '</p>');
						}
						return $(svg).html();
					}
				}, {
					key: 'setValues',
					value: function setValues(data) {
						var colorData = {};
						colorData.thresholds = this.panel.thresholds.split(',').map(function (strVale) {
							return Number(strVale.trim());
						});
						colorData.colorMap = this.panel.colors;

						if (this.series && this.series.length > 0) {
							for (var i = 0; i < this.series.length; i++) {
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
					}
				}, {
					key: 'invertColorOrder',
					value: function invertColorOrder() {
						var tmp = this.panel.colors[0];
						this.panel.colors[0] = this.panel.colors[2];
						this.panel.colors[2] = tmp;
					}
				}, {
					key: 'getDecimalsForValue',
					value: function getDecimalsForValue(value) {
						if (_.isNumber(this.panel.decimals)) {
							return { decimals: this.panel.decimals, scaledDecimals: null };
						}

						var delta = value / 2;
						var dec = -Math.floor(Math.log(delta) / Math.LN10);

						var magn = Math.pow(10, -dec),
						    norm = delta / magn,
						    // norm is between 1.0 and 10.0
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
						if (Math.floor(value) === value) {
							dec = 0;
						}

						var result = {};
						result.decimals = Math.max(0, dec);
						result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;

						return result;
					}
				}, {
					key: 'link',
					value: function link(scope, elem, attrs, ctrl) {
						var diagramElement = elem.find('.diagram');
						console.debug('found diagram panel');
						console.debug(diagramElement);
					}
				}]);

				return DiagramCtrl;
			}(MetricsPanelCtrl)));

			DiagramCtrl.templateUrl = 'module.html';

			_export('DiagramCtrl', DiagramCtrl);

			_export('MetricsPanelCtrl', DiagramCtrl);
		}
	};
});
//# sourceMappingURL=diagramControl.js.map
