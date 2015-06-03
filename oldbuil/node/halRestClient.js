'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _vador = require('vador');

var _halResource = require('./halResource');

var _lodashAssign = require('lodash.assign');

var _lodashAssign2 = _interopRequireDefault(_lodashAssign);

var HalRestClient = (function (_RestClient) {
  function HalRestClient() {
    _classCallCheck(this, HalRestClient);

    if (_RestClient != null) {
      _RestClient.apply(this, arguments);
    }
  }

  _inherits(HalRestClient, _RestClient);

  _createClass(HalRestClient, [{
    key: 'resource',
    value: function resource(resourceName) {
      var config = arguments[1] === undefined ? {} : arguments[1];

      if (!this._cache[resourceName]) {
        var conf = (0, _lodashAssign2['default'])({}, this._config, config);
        conf.defaultHeaders = (0, _lodashAssign2['default'])({}, this._headers, config.defaultHeaders || {});
        conf.interceptors = (config.interceptors || []).concat(this._interceptors);
        if (!conf.http) {
          conf.http = this._http;
        }

        this._cache[resourceName] = new _halResource.HalResource(this._baseUrl, resourceName, conf);
      }

      return this._cache[resourceName];
    }
  }]);

  return HalRestClient;
})(_vador.RestClient);

exports.HalRestClient = HalRestClient;