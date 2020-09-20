'use strict';

System.register(['./libs/analytics/dist/analytics.min', './libs/@analytics/google-analytics/dist/@analytics/google-analytics.min'], function (_export, _context) {
    "use strict";

    var Analytics, googleAnalytics, _createClass, wrapper;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function createAnalytics() {
        return Analytics._analytics.default({
            app: 'diagram-pligin',
            plugins: [googleAnalytics({
                trackingId: 'UA-178409998-1',
                /* Anonymize the IP addresses */
                anonymizeIp: true,
                instanceName: 'gaDiagram',
                cookieConfig: {
                    cookieName: '_gaDiagram'
                },
                /* Google Analytics custom dimensions here */
                customDimensions: {
                    pluginVersion: 'dimension1'
                }
            }, {
                name: 'diagram-analytics'
            })]
        });
    }

    function initAnalytics(enabled) {
        if (enabled) {
            return new wrapper(createAnalytics());
        } else {
            return new wrapper();
        }
    }

    _export('initAnalytics', initAnalytics);

    return {
        setters: [function (_libsAnalyticsDistAnalyticsMin) {
            Analytics = _libsAnalyticsDistAnalyticsMin.default;
        }, function (_libsAnalyticsGoogleAnalyticsDistAnalyticsGoogleAnalyticsMin) {
            googleAnalytics = _libsAnalyticsGoogleAnalyticsDistAnalyticsGoogleAnalyticsMin.default;
        }],
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

            wrapper = function () {
                _createClass(wrapper, [{
                    key: 'track',
                    value: function track(action, props) {
                        var _this = this;

                        if (this._analytics) {
                            setTimeout(function () {
                                return _this._analytics.track(action, props);
                            });
                        }
                    }
                }]);

                function wrapper(_analytics) {
                    _classCallCheck(this, wrapper);

                    this._analytics = _analytics;
                }

                return wrapper;
            }();

            ;
        }
    };
});
//# sourceMappingURL=analytics.js.map
