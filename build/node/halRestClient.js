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

var _lodashObjectAssign = require('lodash/object/assign');

var _lodashObjectAssign2 = _interopRequireDefault(_lodashObjectAssign);

var HalRestClient = (function (_RestClient) {
  function HalRestClient() {
    _classCallCheck(this, HalRestClient);

    if (_RestClient != null) {
      _RestClient.apply(this, arguments);
    }
  }

  _inherits(HalRestClient, _RestClient);

  _createClass(HalRestClient, [{
    key: 'instanciateResource',
    value: function instanciateResource(resourceName, conf) {
      return new _halResource.HalResource(this._baseUrl, resourceName, conf);
    }
  }]);

  return HalRestClient;
})(_vador.RestClient);

exports.HalRestClient = HalRestClient;