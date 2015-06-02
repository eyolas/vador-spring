'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _vador = require('vador');

var _normalizeUrl = require('normalize-url');

var _normalizeUrl2 = _interopRequireDefault(_normalizeUrl);

var _lodashAssign = require('lodash.assign');

var _lodashAssign2 = _interopRequireDefault(_lodashAssign);

var _halRequest = require('./halRequest');

var _interceptors = require('./interceptors/');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var REGEX_LASTPART = /\/([^/]*)\/?$/;

var HalResource = (function (_RestResource) {
  function HalResource(baseUrl, resourceName) {
    var config = arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, HalResource);

    _get(Object.getPrototypeOf(HalResource.prototype), 'constructor', this).call(this, baseUrl, resourceName, config);
    this._request = new _halRequest.HalRequest(resourceName, this);
    this._relations = this._config.relations || null;
    this._restKeys.push('**links**', '**selfLink**', '**hasLinks**');

    //internal interceptors
    var interceptors = [new _interceptors.EmbeddedExtractorInterceptor(), new _interceptors.LinkExtractorInterceptor(), new _interceptors.IdExtractorInterceptor(), new _interceptors.PopulateInterceptor()];

    this._interceptors = interceptors.concat(this._interceptors);
  }

  _inherits(HalResource, _RestResource);

  _createClass(HalResource, [{
    key: '_createSubInstance',
    value: function _createSubInstance(url, resource) {
      return new HalResource(url, resource, this._allConfig);
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
  }, {
    key: '_proxifyOne',
    value: function _proxifyOne(object, request) {
      var _this3 = this;

      var obj = _get(Object.getPrototypeOf(HalResource.prototype), '_proxifyOne', this).call(this, object);
      var links = object['**links**'];
      if (links) {
        Object.keys(links).forEach(function (rel) {
          if (!obj.hasOwnProperty(rel)) {
            var link = links[rel];
            var url = link.substring(0, link.indexOf(rel));
            var r = _this3._createSubInstance(url, rel);
            (function (request) {
              var value = undefined;
              Object.defineProperty(obj, '' + rel + 'Async', {
                enumerable: false,
                get: function get() {
                  if (value !== undefined) {
                    return _bluebird2['default'].resolve(value);
                  } else {
                    return request.findAll().sendRequest().spread(function (res) {
                      value = res;
                      return _bluebird2['default'].resolve(value);
                    });
                  }
                }
              });
            })(r);
          }
        });
      }
      return obj;
    }
  }, {
    key: 'populate',
    value: function populate() {
      var _request;

      for (var _len = arguments.length, rel = Array(_len), _key = 0; _key < _len; _key++) {
        rel[_key] = arguments[_key];
      }

      (_request = this._request).populate.apply(_request, rel);
      return this;
    }
  }]);

  return HalResource;
})(_vador.RestResource);

exports.HalResource = HalResource;