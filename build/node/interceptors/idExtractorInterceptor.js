'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _vader = require('vader');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var debug = new _debug2['default']('halClient [Interceptor]');

var REGEX_LASTPART = /\/([^/{]*)({[^/{]*})?\/?$/;

var IdExtractorInterceptor = (function (_ResponseInterceptor) {
  _inherits(IdExtractorInterceptor, _ResponseInterceptor);

  function IdExtractorInterceptor() {
    _classCallCheck(this, IdExtractorInterceptor);

    _get(Object.getPrototypeOf(IdExtractorInterceptor.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(IdExtractorInterceptor, [{
    key: 'response',
    value: function response(_response) {
      var _this = this;

      debug('id extractor start');
      var value = _response.value;

      if (!_response.hasValue()) {
        debug('id extractor end (do nothing)');
        return _response;
      }

      if (Array.isArray(value)) {
        value.forEach(function (val) {
          return _this._extractId(val);
        });
      } else {
        this._extractId(value);
      }

      debug('id extractor end');
      return _response;
    }
  }, {
    key: '_extractId',
    value: function _extractId(object) {
      if (!object.id) {
        var link = object['**selfLink**'];
        if (link) {
          var matches = link.match(REGEX_LASTPART);
          if (matches.length > 1) {
            object.id = matches[1];
          }
        }
      }
    }
  }, {
    key: 'responseError',
    value: function responseError(error) {
      console.error("id extractor responseError");
      console.error(error.stack);
    }
  }]);

  return IdExtractorInterceptor;
})(_vader.ResponseInterceptor);

exports.IdExtractorInterceptor = IdExtractorInterceptor;