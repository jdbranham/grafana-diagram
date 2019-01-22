'use strict';

System.register(['./libs/mermaid/dist/mermaidAPI', 'app/core/time_series2', 'app/core/utils/kbn', 'app/plugins/sdk', './properties', 'lodash', './series_overrides_diagram_ctrl', './css/diagram.css!'], function (_export, _context) {
  "use strict";

  var TimeSeries, kbn, MetricsPanelCtrl, diagramEditor, displayEditor, compositeEditor, _, _createClass, panelDefaults, DiagramCtrl;

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
    console.debug('Getting color for value');
    console.debug(data);
    console.debug(value);
    for (var i = data.thresholds.length; i > 0; i--) {
      if (value >= data.thresholds[i - 1]) {
        console.debug('Color[' + (i - 1) + ']: ' + data.colorMap[i]);
        return data.colorMap[i - 1];
        //return data.colorMap[i];
      }
    }
    return _.first(data.colorMap);
  }

  function getColorByXPercentage(canvas, xPercent) {
    var x = canvas.width * xPercent;
    var context = canvas.getContext("2d");
    var p = context.getImageData(x, 1, 1, 1).data;
    var color = 'rgba(' + [p[0] + ',' + p[1] + ',' + p[2] + ',' + p[3]] + ')';
    return color;
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
      compositeEditor = _properties.compositeEditor;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_series_overrides_diagram_ctrl) {}, function (_cssDiagramCss) {}],
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
        composites: [],
        metricCharacterReplacements: [],
        // other style overrides
        seriesOverrides: [],
        thresholds: '0,10',
        decimals: 2, // decimal precision
        colors: ['rgba(50, 172, 45, 0.97)', 'rgba(237, 129, 40, 0.89)', 'rgba(245, 54, 54, 0.9)'],
        legend: {
          show: true,
          min: true,
          max: true,
          avg: true,
          current: true,
          total: true,
          gradient: {
            enabled: true,
            show: true
          }
        },
        maxDataPoints: 100,
        mappingType: 1,
        maxWidth: false,
        nullPointMode: 'connected',
        moddedSeriesVal: 0,
        format: 'none',
        valueName: 'avg',
        valueOptions: ['avg', 'min', 'max', 'total', 'current'],
        valueMaps: [{
          value: 'null',
          op: '=',
          text: 'N/A'
        }],
        content: 'graph LR\n' + 'A[Square Rect] -- Link text --> B((Circle))\n' + 'A --> C(Round Rect)\n' + 'B --> D{Rhombus}\n' + 'C --> D\n',
        mode: 'content', //allowed values: 'content' and 'url'
        mermaidServiceUrl: '',
        init: {
          logLevel: 3, //1:debug, 2:info, 3:warn, 4:error, 5:fatal
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
            useMaxWidth: true // - when this flag is set the height and width is set to 100% and is then scaling with the available space if not the absolute space required is used
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
            numberSectionStyles: 3 // - the number of alternating section styles
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
          }
          //classDiagram: {},
          //info: {}
        }
      };

      _export('MetricsPanelCtrl', _export('DiagramCtrl', DiagramCtrl = function (_MetricsPanelCtrl) {
        _inherits(DiagramCtrl, _MetricsPanelCtrl);

        function DiagramCtrl($scope, $injector, $sce, $http) {
          _classCallCheck(this, DiagramCtrl);

          var _this2 = _possibleConstructorReturn(this, (DiagramCtrl.__proto__ || Object.getPrototypeOf(DiagramCtrl)).call(this, $scope, $injector));

          _.defaults(_this2.panel, panelDefaults);
          _this2.$http = $http;
          _this2.panel.graphId = 'diagram_' + _this2.panel.id;
          _this2.containerDivId = 'container_' + _this2.panel.graphId;
          _this2.$sce = $sce;
          _this2.events.on('init-edit-mode', _this2.onInitEditMode.bind(_this2));
          _this2.events.on('data-received', _this2.onDataReceived.bind(_this2));
          _this2.events.on('data-snapshot-load', _this2.onDataReceived.bind(_this2));
          _this2.unitFormats = kbn.getUnitFormats();
          _this2.initializeMermaid();
          return _this2;
        }

        _createClass(DiagramCtrl, [{
          key: 'initializeMermaid',
          value: function initializeMermaid() {
            mermaidAPI.initialize(this.panel.init);
            mermaidAPI.parseError = this.handleParseError.bind(this);
          }
        }, {
          key: 'handleParseError',
          value: function handleParseError(err, hash) {
            this.error = 'Failed to parse diagram definition';
            this.errorText = this.$sce.trustAsHtml('<p>Diagram Definition:</p><pre>' + err + '</pre>');
          }
        }, {
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            this.addEditorTab('Diagram', diagramEditor, 2);
            this.addEditorTab('Display', displayEditor, 3);
            this.addEditorTab('Metric Composites', compositeEditor, 4);
          }
        }, {
          key: 'getDiagramContainer',
          value: function getDiagramContainer() {
            return $(document.getElementById(this.containerDivId));
          }
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(dataList) {
            console.debug('received data');
            console.debug(dataList);
            this.series = dataList.map(this.seriesHandler.bind(this));
            console.debug('mapped dataList to series');
            console.debug(this.series);
            var data = this.setValues();
            // this update works for local diagrams, if the url method is used the data has to be stored in the callback
            this.svgData = data;
            this.updateDiagram(data);
            this.render();
          }
        }, {
          key: 'replaceMetricCharacters',
          value: function replaceMetricCharacters(metricName) {
            // a datasource sending bad data will have a type other than string, set it to "MISSING_METRIC_TARGET" and return
            if (typeof metricName !== 'string') return "DATASOURCE_SENT_INVALID_METRIC_TARGET";
            var replacedText = metricName.replace(/"|,|;|=|:|{|}/g, '_');
            for (var index in this.panel.metricCharacterReplacements) {
              var replacement = this.panel.metricCharacterReplacements[index];
              // start with a simple replacement
              var pattern = replacement.replacementPattern;
              // check if the pattern is empty
              if (pattern.length === 0) continue;
              // if it is a regex, convert
              if (pattern[0] === '/') {
                pattern = kbn.stringToJsRegex(replacement.replacementPattern);
              }
              replacedText = replacedText.replace(pattern, replacement.replaceWithText);
            }
            return replacedText;
          }
        }, {
          key: 'seriesHandler',
          value: function seriesHandler(seriesData) {
            var alias = this.replaceMetricCharacters(seriesData.target);
            var series = new TimeSeries({
              datapoints: seriesData.datapoints,
              alias: alias,
              unit: seriesData.unit
            });
            series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
            var datapoints = seriesData.datapoints || [];
            if (datapoints && datapoints.length > 0) {
              var last = datapoints[datapoints.length - 1][1];
              var from = this.range.from;
              if (last - from < -10000) {
                series.isOutsideRange = true;
              }
            }
            return series;
          }
        }, {
          key: 'addSeriesOverride',
          value: function addSeriesOverride(override) {
            this.panel.seriesOverrides.push(override || {});
          }
        }, {
          key: 'removeSeriesOverride',
          value: function removeSeriesOverride(override) {
            this.panel.seriesOverrides = _.without(this.panel.seriesOverrides, override);
            this.refresh();
          }
        }, {
          key: 'addComposite',
          value: function addComposite(composite) {
            this.panel.composites.push(composite || {});
          }
        }, {
          key: 'removeComposite',
          value: function removeComposite(composite) {
            this.panel.composites = _.without(this.panel.composites, composite);
            this.refresh();
          }
        }, {
          key: 'getSeriesNamesForComposites',
          value: function getSeriesNamesForComposites() {
            return _.map(this.$scope.ctrl.series, function (series) {
              return series.alias;
            });
          }
        }, {
          key: 'addMetricToComposite',
          value: function addMetricToComposite(composite) {
            if (composite.metrics === undefined) {
              composite.metrics = [{}];
            } else {
              composite.metrics.push({});
            }
            this.refresh();
          }
        }, {
          key: 'removeMetricFromComposite',
          value: function removeMetricFromComposite(composite, metric) {
            composite.metrics = _.without(composite.metrics, metric);
            this.refresh();
          }
        }, {
          key: 'addMetricCharacterReplacement',
          value: function addMetricCharacterReplacement(replacement) {
            this.panel.metricCharacterReplacements.push(replacement || {
              replacementPattern: '',
              replaceWithText: '_'
            });
          }
        }, {
          key: 'removeMetricCharacterReplacement',
          value: function removeMetricCharacterReplacement(replacement) {
            this.panel.metricCharacterReplacements = _.without(this.panel.metricCharacterReplacements, replacement);
            this.refresh();
          }
        }, {
          key: 'updateThresholds',
          value: function updateThresholds() {
            var thresholdCount = this.panel.thresholds.length;
            var colorCount = this.panel.colors.length;
            this.refresh();
          }
        }, {
          key: 'changeColor',
          value: function changeColor(colorIndex, color) {
            this.panel.colors[colorIndex] = color;
          }
        }, {
          key: 'removeColor',
          value: function removeColor(colorIndex) {
            this.panel.colors.splice(colorIndex, 1);
          }
        }, {
          key: 'addColor',
          value: function addColor() {
            this.panel.colors.push('rgba(255, 255, 255, 1)');
          }
        }, {
          key: 'setUnitFormat',
          value: function setUnitFormat(subItem) {
            this.panel.format = subItem.value;
            this.refresh();
          }
        }, {
          key: 'clearDiagram',
          value: function clearDiagram() {
            if ($('#' + this.panel.graphId).length) {
              $('#' + this.panel.graphId).remove();
            }
            this.svg = {};
          }
        }, {
          key: 'renderDiagram',
          value: function renderDiagram(graphDefinition, data) {
            // substitute values inside "link text"
            // this will look for any composite prefixed with a # and substitute the value of the composite
            // if a series alias is found, in the form #alias, the value will be substituted
            // this allows link values to be displayed based on the metric
            graphDefinition = this.substituteHashPrefixedNotation(graphDefinition, data);
            graphDefinition = this.templateSrv.replaceWithText(graphDefinition);
            this.diagramType = mermaidAPI.detectType(graphDefinition);
            var diagramContainer = $(document.getElementById(this.containerDivId));
            var _this = this;
            var renderCallback = function renderCallback(svgCode, bindFunctions) {
              if (svgCode === '') {
                diagramContainer.html('There was a problem rendering the graph');
              } else {
                diagramContainer.html(svgCode);
                bindFunctions(diagramContainer[0]);
                console.debug("Inside rendercallback of renderDiagram");
                // svgData is empty when this callback happens, update it so the styles will be applied
                _this.svgData = data;
                // force a render or we will not see an update
                _this.render();
              }
            };
            // if parsing the graph definition fails, the error handler will be called but the renderCallback() may also still be called.
            mermaidAPI.render(this.panel.graphId, graphDefinition, renderCallback);
          }
        }, {
          key: 'updateDiagram',
          value: function updateDiagram(data) {
            if (this.panel.content.length > 0) {
              var mode = this.panel.mode;
              if (mode == 'url') {
                var templatedURL = this.templateSrv.replace(this.panel.mermaidServiceUrl, this.panel.scopedVars);
                var _this = this;
                this.$http({
                  method: 'GET',
                  url: templatedURL,
                  headers: { 'Accept': 'text/x-mermaid,text/plain;q=0.9,*/*;q=0.8' }
                }).then(function successCallback(response) {
                  //the response must have text/plain content-type
                  // clearing the diagram here will result in less artifacting waiting for the response
                  _this.clearDiagram();
                  _this.renderDiagram(response.data, data);
                }, function errorCallback(response) {
                  console.warn('error', response);
                });
              } else {
                this.clearDiagram();
                this.renderDiagram(this.panel.content, data);
              }
            }
          }
        }, {
          key: 'substituteHashPrefixedNotation',
          value: function substituteHashPrefixedNotation(graphDefinition, data) {
            // inspect the string, locate all # prefixed items, and replace them with the value
            // of the series. If no matching series is found, leave it alone
            var matches = graphDefinition.match(/(?:#|!|@|&)(\w+)/g);
            if (matches === null) return graphDefinition;
            // check if there is a composite with a matching name
            for (var i = 0; i < matches.length; i++) {
              var aMatch = matches[i];
              var valueType = aMatch[0];
              aMatch = aMatch.substring(1);
              // check composites first
              for (var j = 0; j < this.panel.composites.length; j++) {
                var aComposite = this.panel.composites[j];
                if (aComposite.name === aMatch) {
                  // found matching composite, get the valueFormatted
                  var displayedValue = null;
                  switch (valueType) {
                    case '#':
                      displayedValue = data[aComposite.name].value;
                      graphDefinition = graphDefinition.replace('#' + aMatch, displayedValue);
                      break;
                    case '!':
                      displayedValue = data[aComposite.name].valueRawFormattedWithPrefix;
                      graphDefinition = graphDefinition.replace('!' + aMatch, displayedValue);
                      break;
                    case '@':
                      displayedValue = data[aComposite.name].valueFormatted;
                      graphDefinition = graphDefinition.replace('@' + aMatch, displayedValue);
                      break;
                    case '&':
                      displayedValue = data[aComposite.name].valueFormattedWithPrefix;
                      graphDefinition = graphDefinition.replace('&' + aMatch, displayedValue);
                      break;
                  }
                }
              }
              // next check series
              for (var k = 0; k < this.series.length; k++) {
                var seriesItem = this.series[k];
                if (seriesItem.alias === aMatch) {
                  var displayedValue = null;
                  switch (valueType) {
                    case '#':
                      displayedValue = data[seriesItem.alias].value;
                      graphDefinition = graphDefinition.replace('#' + aMatch, displayedValue);
                      break;
                    case '@':
                      displayedValue = data[seriesItem.alias].valueFormatted;
                      graphDefinition = graphDefinition.replace('@' + aMatch, displayedValue);
                      break;
                  }
                }
              }
            }
            return graphDefinition;
          }
        }, {
          key: 'setValues',
          value: function setValues() {
            var data = {};
            if (this.series && this.series.length > 0) {
              for (var i = 0; i < this.series.length; i++) {
                var seriesItem = this.series[i];
                console.debug('setting values for series');
                console.debug(seriesItem);
                data[seriesItem.alias] = this.applyOverrides(seriesItem.alias);
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
                  data[seriesItem.alias].value = seriesItem.stats[data[seriesItem.alias].valueName];
                  var decimalInfo = this.getDecimalsForValue(data[seriesItem.alias].value);
                  var formatFunc = kbn.valueFormats[data[seriesItem.alias].format];
                  // put the value in quotes to escape "most" special characters
                  data[seriesItem.alias].valueFormatted = formatFunc(data[seriesItem.alias].value, decimalInfo.decimals, decimalInfo.scaledDecimals);
                  data[seriesItem.alias].valueRounded = kbn.roundValue(data[seriesItem.alias].value, decimalInfo.decimals);
                }
                if (this.panel.legend.gradient.enabled) {
                  data[seriesItem.alias].color = this.getGradientForValue(data[seriesItem.alias].colorData, data[seriesItem.alias].value);
                } else {
                  data[seriesItem.alias].color = getColorForValue(data[seriesItem.alias].colorData, data[seriesItem.alias].value);
                }
              }
            }
            // now add the composites to data
            for (var i = 0; i < this.panel.composites.length; i++) {
              var aComposite = this.panel.composites[i];
              var currentWorstSeries = null;
              var currentWorstSeriesName = null;
              for (var j = 0; j < aComposite.metrics.length; j++) {
                var aMetric = aComposite.metrics[j];
                var seriesName = aMetric.seriesName;
                // For testing
                console.debug("aMetric value: " + seriesItem.valueFormatted);
                console.debug("aMetric: " + seriesName);
                // make sure we have a match
                if (!data.hasOwnProperty(seriesName)) continue;
                var seriesItem = data[seriesName];
                // add the name of the series Item
                seriesItem.nameOfMetric = seriesName;
                // check colorData thresholds
                if (currentWorstSeries === null) {
                  currentWorstSeries = seriesItem;
                  currentWorstSeriesName = seriesItem.nameOfMetric;
                } else {
                  currentWorstSeries = this.getWorstSeries(currentWorstSeries, seriesItem);
                  currentWorstSeriesName = currentWorstSeries.nameOfMetric;
                }
                delete seriesItem.nameOfMetric;
              }
              // Prefix the valueFormatted with the actual metric name
              if (currentWorstSeries !== null) {
                currentWorstSeries.valueFormattedWithPrefix = currentWorstSeriesName + ': ' + currentWorstSeries.valueFormatted;
                currentWorstSeries.valueRawFormattedWithPrefix = currentWorstSeriesName + ': ' + currentWorstSeries.value;
                // currentWorstSeries.valueFormatted = currentWorstSeriesName + ': ' + currentWorstSeries.valueFormatted;
                // now push the composite into data
                data[aComposite.name] = currentWorstSeries;
              }
            }
            return data;
          }
        }, {
          key: 'getWorstSeries',
          value: function getWorstSeries(series1, series2) {
            var worstSeries = series1;
            var series1thresholdLevel = this.getThresholdLevel(series1);
            var series2thresholdLevel = this.getThresholdLevel(series2);
            console.debug("Series1 threshold level: " + series1thresholdLevel);
            console.debug("Series2 threshold level: " + series2thresholdLevel);
            if (series2thresholdLevel > series1thresholdLevel) {
              // series2 has higher threshold violation
              worstSeries = series2;
            }
            return worstSeries;
          }
        }, {
          key: 'getThresholdLevel',
          value: function getThresholdLevel(series) {
            // default to ok
            var thresholdLevel = 0;
            var value = series.value;
            var thresholds = series.colorData.thresholds;
            // if no thresholds are defined, return 0
            if (thresholds === undefined) {
              return thresholdLevel;
            }
            // make sure thresholds is an array of size 2
            if (thresholds.length !== 2) {
              return thresholdLevel;
            }
            if (value >= thresholds[0]) {
              // value is equal or greater than first threshold
              thresholdLevel = 1;
            }
            if (value >= thresholds[1]) {
              // value is equal or greater than second threshold
              thresholdLevel = 2;
            }
            return thresholdLevel;
          }
        }, {
          key: 'getGradientForValue',
          value: function getGradientForValue(data, value) {
            console.debug('Getting gradient for value');
            console.debug(data);
            console.debug(value);
            var min = Math.min.apply(Math, data.thresholds);
            var max = Math.max.apply(Math, data.thresholds);
            var absoluteDistance = max - min;
            var valueDistanceFromMin = value - min;
            var xPercent = valueDistanceFromMin / absoluteDistance;
            // Get the smaller number to clamp at 0.999 max
            xPercent = Math.min(0.999, xPercent);
            // Get the larger number to clamp at 0.001 min
            xPercent = Math.max(0.001, xPercent);
            if (data.invertColors) {
              xPercent = 1 - xPercent;
            }

            return getColorByXPercentage(this.canvas, xPercent);
          }
        }, {
          key: 'applyOverrides',
          value: function applyOverrides(seriesItemAlias) {
            var seriesItem = {},
                colorData = {},
                overrides = {};

            console.debug('applying overrides for seriesItem');
            console.debug(seriesItemAlias);
            console.debug(this.panel.seriesOverrides);
            for (var i = 0; i <= this.panel.seriesOverrides.length; i++) {
              console.debug('comparing:');
              console.debug(this.panel.seriesOverrides[i]);

              if (this.panel.seriesOverrides[i]) {
                var regex = kbn.stringToJsRegex(this.panel.seriesOverrides[i].alias);
                var matches = seriesItemAlias.match(regex);
                if (matches && matches.length > 0) {
                  overrides = this.panel.seriesOverrides[i];
                }
              }
            }
            colorData.thresholds = (overrides.thresholds || this.panel.thresholds).split(',').map(function (strVale) {
              return Number(strVale.trim());
            });
            colorData.colorMap = this.panel.colors.slice();
            colorData.invertColors = overrides.invertColors || false;
            if (colorData.invertColors) {
              colorData.colorMap.reverse();
            }
            seriesItem.colorData = colorData;

            seriesItem.valueName = overrides.valueName || this.panel.valueName;

            seriesItem.format = overrides.unitFormat || this.panel.format;
            return seriesItem;
          }
        }, {
          key: 'invertColorOrder',
          value: function invertColorOrder() {
            this.panel.colors.reverse();
            this.refresh();
          }
        }, {
          key: 'getDecimalsForValue',
          value: function getDecimalsForValue(value) {
            if (_.isNumber(this.panel.decimals)) {
              return {
                decimals: this.panel.decimals,
                scaledDecimals: null
              };
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
            var templateSrv = this.templateSrv;
            var diagramElement = elem.find('.diagram');
            diagramElement.append('<div id="' + ctrl.containerDivId + '"></div>');
            var diagramContainer = $(document.getElementById(ctrl.containerDivId));
            console.debug('found diagramContainer');
            console.debug(diagramContainer);
            elem.css('height', '100%');

            var canvas = elem.find('.canvas')[0];
            ctrl.canvas = canvas;
            var gradientValueMax = elem.find('.gradient-value-max')[0];
            var gradientValueMin = elem.find('.gradient-value-min')[0];

            function updateCanvasStyle() {
              canvas.width = Math.max(diagramElement[0].clientWidth, 100);
              var canvasContext = canvas.getContext("2d");
              canvasContext.clearRect(0, 0, canvas.width, canvas.height);

              var grd = canvasContext.createLinearGradient(0, 0, canvas.width, 0);
              var colorWidth = 1 / Math.max(ctrl.panel.colors.length, 1);
              for (var i = 0; i < ctrl.panel.colors.length; i++) {
                var currentColor = ctrl.panel.colors[i];
                grd.addColorStop(Math.min(colorWidth * i, 1), currentColor);
              }
              canvasContext.fillStyle = grd;
              canvasContext.fillRect(0, 0, canvas.width, 3);
              ctrl.canvasContext = canvasContext;

              gradientValueMax.innerText = Math.max.apply(Math, ctrl.panel.thresholds.split(','));
              gradientValueMin.innerText = Math.min.apply(Math, ctrl.panel.thresholds.split(','));
            }
            updateCanvasStyle(); // run once at beginning so the gradients are ready on first data

            function updateStyle() {
              var data = ctrl.svgData;
              ctrl.svgData = {}; // get rid of the data after consuming it. This prevents adding duplicate DOM elements
              console.debug('updating svg style');
              var svg = $(document.getElementById(ctrl.panel.graphId));
              $(svg).css('min-width', $(svg).css('max-width'));
              if (ctrl.panel.maxWidth) {
                $(svg).css('max-width', '100%');
              }

              if (svg[0] === undefined) {
                return;
              }

              for (var key in data) {
                var seriesItem = data[key];

                // Find nodes by ID if we can
                //console.info('finding targetElement');
                var targetElement = d3.select(svg[0].getElementById(key)); // $(svg).find('#'+key).first(); // jquery doesnt work for some ID expressions [prometheus data]
                console.debug("Series item: " + seriesItem.valueFormated);
                if (targetElement[0][0] !== null) {
                  // probably a flowchart
                  targetElement.selectAll('rect,circle,polygon').style('fill', seriesItem.color);

                  var div = targetElement.select('div');
                  var fo = targetElement.select('foreignObject');
                  // make foreign object element taller to accomdate value in FireFox/IE
                  fo.attr('height', 45);
                  // Add value text
                  var p = div.append('p');
                  p.classed('diagram-value');
                  p.style('background-color', seriesItem.color);
                  p.html(seriesItem.valueFormatted);
                } else {
                  console.debug('finding element that contains id: ' + key);
                  // maybe a flowchart with an alias text node
                  targetElement = $(svg).find('div:contains("' + key + '")').filter(function () {
                    // Matches node name ( 'foo' in both 'foo' and 'foo[bar]')
                    return $(this).attr('id') === key;
                  });
                  if (targetElement.length > 0) {
                    targetElement.parents('.node').find('rect, circle, polygon').css('fill', seriesItem.color);
                    // make foreign object element taller to accomdate value in FireFox/IE
                    targetElement.parents('.node').find('foreignObject').attr('height', 45);
                    // for edge matches
                    var edgeElement = targetElement.parent().find('.edgeLabel');
                    if (edgeElement.length > 0) {
                      edgeElement.css('background-color', 'transparent');
                      edgeElement.append('<br/>' + seriesItem.valueFormatted).addClass('diagram-value');
                      edgeElement.parent('div').css('text-align', 'center').css('background-color', seriesItem.color);
                    } else {
                      var dElement = d3.select(targetElement[0]);
                      // Add value text
                      var p = dElement.append('p');
                      p.classed('diagram-value');
                      p.style('background-color', seriesItem.color);
                      p.html(seriesItem.valueFormatted);
                    }
                  } else {
                    targetElement = $(svg).find('text:contains("' + key + '")'); // sequence diagram, gantt ?
                    if (targetElement.length === 0) {
                      console.debug('couldnt not find a diagram node with id/text: ' + key);
                      continue;
                    }
                    // for node matches
                    targetElement.parent().find('rect, circle, polygon').css('fill', seriesItem.color);
                    targetElement.append('\n' + seriesItem.valueFormatted);
                  }
                }

                console.debug(targetElement);
                console.debug('set nodes:' + key + ' to color:' + seriesItem.color);
              }
              //return $(svg).html();
            } // End updateStyle()

            function render() {
              updateCanvasStyle();
              updateStyle();
            }

            this.events.on('render', function () {
              render();
              ctrl.renderingCompleted();
            });
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
