'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _vader = require('vader');

var _lodashObjectHas = require('lodash/object/has');

var _lodashObjectHas2 = _interopRequireDefault(_lodashObjectHas);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var debug = new _debug2['default']('halClient [Interceptor]');

var PopulateInterceptor = (function (_ResponseInterceptor) {
  _inherits(PopulateInterceptor, _ResponseInterceptor);

  function PopulateInterceptor() {
    _classCallCheck(this, PopulateInterceptor);

    _get(Object.getPrototypeOf(PopulateInterceptor.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(PopulateInterceptor, [{
    key: 'response',
    value: function response(_response) {
      var _this = this;

      debug('populate interceptor begin');
      var value = _response.value;
      var request = _response.request;

      if (!_response.hasValue() || !request.hasPopulate()) {
        debug('Populate extractor end (do nothing)');
        return _response;
      }

      var promises = [];
      if (Array.isArray(value)) {
        value.forEach(function (val) {
          promises.push(_this._populateOne(val, request));
        });
      } else {
        promises.push(this._populateOne(value, request));
      }

      return _vader.config.Promise.all(promises).then(function () {
        debug('populate interceptor end');
        return _response;
      });
    }
  }, {
    key: '_populateOne',
    value: function _populateOne(object, request) {
      debug('populate one');
      var links = object['**links**'];

      var promises = [];
      var populates = request.populates;

      populates.keys().forEach(function (rel) {
        if (rel && (0, _lodashObjectHas2['default'])(links, rel)) {
          var link = links[rel];
          var url = link.substring(0, link.indexOf(rel));
          var r = request.restResource._createSubInstance(url, rel);
          var promise = r.findAll();
          var subPopulate = populates.getSubPopulate(rel);
          if (Array.isArray(subPopulate) && subPopulate.length) {
            var _promise;

            (_promise = promise).populate.apply(_promise, _toConsumableArray(subPopulate));
          }
          promise = promise.sendRequest().then(function (res) {
            object[rel] = res.value;
          });
          promises.push(promise);
        }
      });

      return _vader.config.Promise.all(promises).then(function () {
        return object;
      });
    }
  }, {
    key: 'responseError',
    value: function responseError(error) {
      console.error("populate extractor responseError", error);
    }
  }]);

  return PopulateInterceptor;
})(_vader.ResponseInterceptor);

exports.PopulateInterceptor = PopulateInterceptor;