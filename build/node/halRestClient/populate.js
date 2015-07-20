'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashObjectSet = require('lodash/object/set');

var _lodashObjectSet2 = _interopRequireDefault(_lodashObjectSet);

var _lodashLangIsObject = require('lodash/lang/isObject');

var _lodashLangIsObject2 = _interopRequireDefault(_lodashLangIsObject);

var Populate = (function () {
  function Populate() {
    var _this = this;

    var populates = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    _classCallCheck(this, Populate);

    if (!Array.isArray(populates)) {
      populates = [];
    }
    this._populates = {};

    //transform array to tree
    populates.forEach(function (populate) {
      _this._populates = (0, _lodashObjectSet2['default'])(_this._populates, populate, {});
    });
  }

  _createClass(Populate, [{
    key: 'keys',
    value: function keys() {
      return Object.keys(this._populates);
    }
  }, {
    key: 'getPopulateArray',
    value: function getPopulateArray() {
      return this._getPopulate(this._populates);
    }
  }, {
    key: '_getPopulate',
    value: function _getPopulate(obj) {
      var _this2 = this;

      var populates = [];
      Object.keys(obj).forEach(function (k) {
        var val = obj[k];
        if ((0, _lodashLangIsObject2['default'])(val) && Object.keys(val).length) {
          var p = _this2._getPopulate(val);
          p.forEach(function (v) {
            return populates.push(k + '.' + v);
          });
        } else {
          populates.push(k);
        }
      });
      return populates;
    }
  }, {
    key: 'getSubPopulate',
    value: function getSubPopulate(sub) {
      var subPopulate = this._populates[sub];
      if (subPopulate) {
        return this._getPopulate(subPopulate);
      } else {
        return [];
      }
    }
  }, {
    key: 'populates',
    get: function get() {
      return this._populates;
    }
  }]);

  return Populate;
})();

exports.Populate = Populate;