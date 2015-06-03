'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _vador = require('vador');

var _populate = require('./populate');

var _interceptors = require('./interceptors/');

var HalRequest = (function (_Request) {
  function HalRequest(baseUrl, resourceName, restResource) {
    var config = arguments[3] === undefined ? {} : arguments[3];

    _classCallCheck(this, HalRequest);

    _get(Object.getPrototypeOf(HalRequest.prototype), 'constructor', this).call(this, baseUrl, resourceName, restResource, config);
    this._populates = [];
    this._relations = this._config.relations || null;
    this._restKeys.push('**links**', '**selfLink**', '**hasLinks**');

    //internal interceptors
    var interceptors = [new _interceptors.EmbeddedExtractorInterceptor(), new _interceptors.LinkExtractorInterceptor(), new _interceptors.IdExtractorInterceptor(), new _interceptors.PopulateInterceptor()];

    this._interceptors = interceptors.concat(this._interceptors);
  }

  _inherits(HalRequest, _Request);

  _createClass(HalRequest, [{
    key: 'populate',
    value: function populate() {
      var _populates;

      for (var _len = arguments.length, rel = Array(_len), _key = 0; _key < _len; _key++) {
        rel[_key] = arguments[_key];
      }

      (_populates = this._populates).push.apply(_populates, rel);
      return this;
    }
  }, {
    key: 'populates',
    get: function () {
      return new _populate.Populate(this._populates);
    }
  }, {
    key: 'hasPopulate',
    value: function hasPopulate() {
      var pop = this._populates;
      return Array.isArray(pop) && pop.length > 0;
    }
  }, {
    key: '_proxifyOne',
    value: function _proxifyOne(object, request) {
      var _this = this;

      var obj = _get(Object.getPrototypeOf(HalRequest.prototype), '_proxifyOne', this).call(this, object);

      var links = object['**links**'];

      if (links) {
        Object.keys(links).forEach(function (rel) {
          if (!obj.hasOwnProperty(rel)) {
            var link = links[rel];
            var url = link.substring(0, link.indexOf(rel));
            var r = _this.restResource._createSubInstance(url, rel);
            (function (request) {
              var value = undefined;
              Object.defineProperty(obj, '' + rel + 'Async', {
                enumerable: false,
                get: function get() {
                  if (value !== undefined) {
                    return Promise.resolve(value);
                  } else {
                    return request.findAll().sendRequest().then(function (res) {
                      value = res.value;
                      return Promise.resolve(value);
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
  }]);

  return HalRequest;
})(_vador.Request);

exports.HalRequest = HalRequest;