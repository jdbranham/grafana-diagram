'use strict';

System.register(['app/plugins/sdk', 'moment'], function (_export, _context) {
  "use strict";

  var PanelCtrl, moment, _createClass, DiagramCtrl;

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
    setters: [function (_appPluginsSdk) {
      PanelCtrl = _appPluginsSdk.PanelCtrl;
    }, function (_moment) {
      moment = _moment.default;
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

      _export('DiagramCtrl', DiagramCtrl = function (_PanelCtrl) {
        _inherits(DiagramCtrl, _PanelCtrl);

        function DiagramCtrl($scope, $injector) {
          _classCallCheck(this, DiagramCtrl);

          var _this = _possibleConstructorReturn(this, (DiagramCtrl.__proto__ || Object.getPrototypeOf(DiagramCtrl)).call(this, $scope, $injector));

          _this.updateClock();
          return _this;
        }

        _createClass(DiagramCtrl, [{
          key: 'updateClock',
          value: function updateClock() {
            var _this2 = this;

            this.time = moment().format('hh:mm:ss');
            this.$timeout(function () {
              _this2.updateClock();
            }, 1000);
          }
        }]);

        return DiagramCtrl;
      }(PanelCtrl));

      _export('DiagramCtrl', DiagramCtrl);

      DiagramCtrl.templateUrl = 'module.html';
    }
  };
});
//# sourceMappingURL=diagramControl.js.map
