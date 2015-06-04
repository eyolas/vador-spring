'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _vador = require('vador');

var _lodashObjectHas = require('lodash/object/has');

var _lodashObjectHas2 = _interopRequireDefault(_lodashObjectHas);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _lodashLangIsObject = require('lodash/lang/isObject');

var _lodashLangIsObject2 = _interopRequireDefault(_lodashLangIsObject);

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
      debug('embedded extractor start');
      var value = _response.value;
      var request = _response.request;

      _response.value = this._extractEmbbeded(value);

      debug('embedded extractor end');
      return _response;
    }
  }, {
    key: '_extractEmbbeded',
    value: function _extractEmbbeded(obj) {
      // if there is an embedded in object set object by the embedded
      if ((0, _lodashObjectHas2['default'])(obj, this.tagEmbedded)) {
        obj = obj[this.tagEmbedded];
        var keys = Object.keys(obj);
        if (keys.length === 1) {
          if (keys[0] === this.tagEmbedded) {
            throw new Error('an embedded can\'t have directly an embedded');
          }

          //if is an array so set object to array (case findAll)
          if (Array.isArray(obj[keys[0]])) {
            obj = obj[keys[0]];
          }
        } else {
          throw new Error('an embedded must have an object with one key');
        }
      }

      return this._internalExtractEmbbeded(obj);
    }
  }, {
    key: '_internalExtractEmbbeded',
    value: function _internalExtractEmbbeded(obj) {
      var _this = this;

      //Array first because array is an object
      if (Array.isArray(obj)) {
        return obj.map(function (v) {
          return _this._internalExtractEmbbeded(v);
        });
      } else if ((0, _lodashLangIsObject2['default'])(obj)) {
        var _ret = (function () {
          var newObj = {};
          Object.keys(obj).forEach(function (k) {
            var val = obj[k];
            if (k === _this.tagEmbedded && (0, _lodashLangIsObject2['default'])(val)) {
              if ((0, _lodashLangIsObject2['default'])(val) && Object.keys(val).length === 1) {
                k = Object.keys(val)[0];
                if (k === _this.tagEmbedded) {
                  throw new Error('an embedded can\'t have directly an embedded');
                }
                val = val[k];
              } else {
                throw new Error('an embedded must have an object with one key');
              }
            }
            newObj[k] = _this._internalExtractEmbbeded(val);
          });
          return {
            v: newObj
          };
        })();

        if (typeof _ret === 'object') return _ret.v;
      } else {
        return obj;
      }
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