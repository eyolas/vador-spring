'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _vador = require('vador');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var debug = new _debug2['default']('halClient [Interceptor]');

var REGEX_LASTPART = /\/([^/{]*)({[^/{]*})?\/?$/;

var IdExtractorInterceptor = (function (_ResponseInterceptor) {
  function IdExtractorInterceptor() {
    _classCallCheck(this, IdExtractorInterceptor);

    if (_ResponseInterceptor != null) {
      _ResponseInterceptor.apply(this, arguments);
    }
  }

  _inherits(IdExtractorInterceptor, _ResponseInterceptor);

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
      console.error('id extractor responseError');
      console.error(error.stack);
    }
  }]);

  return IdExtractorInterceptor;
})(_vador.ResponseInterceptor);

exports.IdExtractorInterceptor = IdExtractorInterceptor;