'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _vador = require('vador');

var _lodashAssign = require('lodash.assign');

var _lodashAssign2 = _interopRequireDefault(_lodashAssign);

var _halRequest = require('./halRequest');

var HalResource = (function (_RestResource) {
  function HalResource() {
    _classCallCheck(this, HalResource);

    if (_RestResource != null) {
      _RestResource.apply(this, arguments);
    }
  }

  _inherits(HalResource, _RestResource);

  _createClass(HalResource, [{
    key: '_createSubInstance',
    value: function _createSubInstance(url, resource, config) {
      return new HalResource(url, resource, config);
    }
  }, {
    key: 'constructBaseRequest',
    value: function constructBaseRequest() {
      var method = arguments[0] === undefined ? 'get' : arguments[0];
      var responseType = arguments[1] === undefined ? Array : arguments[1];
      var addUrl = arguments[2] === undefined ? '' : arguments[2];

      var request = new _halRequest.HalRequest(this._baseUrl, this._resourceName, this, this._config);
      request.responseType = responseType;
      request.url = this._baseUrl + this._resourceName + addUrl;
      request.method = method;
      return request;
    }
  }, {
    key: '_transformToLink',
    value: function _transformToLink(value, link, rel) {
      var _this = this;

      var newValue = null;
      var href = link.href;
      var type = link.type;

      if (value === null) {
        return { type: type, newValue: newValue };
      }

      if (type === 'many') {
        if (!Array.isArray(value)) {
          throw new Error('For relation ' + rel + ', the value must be an Array');
        }

        newValue = [];
        value.forEach(function (val) {
          var tval = _this._transformToLinkOne(val, href, rel);
          if (tval !== null) {
            newValue.push(tval);
          }
        });
      } else {
        newValue = this._transformToLinkOne(value, href, rel);
      }

      return { type: type, newValue: newValue };
    }
  }, {
    key: '_transformToLinkOne',
    value: function _transformToLinkOne(value, href, rel) {
      if (value == null) {
        return null;
      }

      if (value.id) {
        // remove duplicate slashes
        return ('' + href + '/' + value.id).replace(/\/{2,}/, '/');
      } else {
        throw new Error('For relation ' + rel + ', the value must have id');
      }
    }
  }, {
    key: 'save',
    value: function save(obj) {
      var _this2 = this;

      var links = (0, _lodashAssign2['default'])({}, this._relations || {});
      if (links) {
        Object.keys(links).forEach(function (rel) {
          if (obj.hasOwnProperty(rel)) {
            var _transformToLink = _this2._transformToLink(obj[rel], links[rel], rel);

            var type = _transformToLink.type;
            var newValue = _transformToLink.newValue;

            obj[rel] = newValue;
          }
        });
      }
      return _get(Object.getPrototypeOf(HalResource.prototype), 'save', this).call(this, obj);
    }
  }]);

  return HalResource;
})(_vador.RestResource);

exports.HalResource = HalResource;