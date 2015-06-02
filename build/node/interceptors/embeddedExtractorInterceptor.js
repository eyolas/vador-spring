'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _vador = require('vador');

var _lodashHas = require('lodash.has');

var _lodashHas2 = _interopRequireDefault(_lodashHas);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var debug = new _debug2['default']('halClient [Interceptor]');

var EMBEDDED = '_embedded';

var EmbeddedExtractorInterceptor = (function (_ResponseInterceptor) {
  function EmbeddedExtractorInterceptor(tagEmbedded) {
    _classCallCheck(this, EmbeddedExtractorInterceptor);

    _get(Object.getPrototypeOf(EmbeddedExtractorInterceptor.prototype), 'constructor', this).call(this);
    this.tagEmbedded = tagEmbedded || EMBEDDED;
  }

  _inherits(EmbeddedExtractorInterceptor, _ResponseInterceptor);

  _createClass(EmbeddedExtractorInterceptor, [{
    key: 'response',
    value: function response(_response) {
      debug('embedded extractor start', _response.request.resourceName, _response.request.responseType, _response.value);
      var value = _response.value;
      var request = _response.request;

      if (request.responseType === Array) {
        if ((0, _lodashHas2['default'])(value, '' + this.tagEmbedded + '.' + request.resourceName)) {
          var val = [];
          for (var k in value) {
            if (k !== this.tagEmbedded) {
              val[k] = value[k];
            }
          }
          val.push.apply(val, _toConsumableArray(value[this.tagEmbedded][request.resourceName]));
          value = val;
        }
      }

      _response.value = value;

      debug('embedded extractor end');
      return _response;
    }
  }, {
    key: 'responseError',
    value: function responseError(error) {
      console.error('embedded extractor responseError', error);
    }
  }]);

  return EmbeddedExtractorInterceptor;
})(_vador.ResponseInterceptor);

exports.EmbeddedExtractorInterceptor = EmbeddedExtractorInterceptor;