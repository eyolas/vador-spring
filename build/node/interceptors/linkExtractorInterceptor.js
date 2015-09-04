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

var _lodashObjectHas = require('lodash/object/has');

var _lodashObjectHas2 = _interopRequireDefault(_lodashObjectHas);

var _lodashLangIsObject = require('lodash/lang/isObject');

var _lodashLangIsObject2 = _interopRequireDefault(_lodashLangIsObject);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var debug = new _debug2['default']('halClient [Interceptor]');

var TAG_LINK = '_links';
var TAG_HREF = 'href';
var TAG_SELF = 'self';

var LinkExtractorInterceptor = (function (_ResponseInterceptor) {
  _inherits(LinkExtractorInterceptor, _ResponseInterceptor);

  function LinkExtractorInterceptor(tagLink, tagHref, tagSelf) {
    _classCallCheck(this, LinkExtractorInterceptor);

    _get(Object.getPrototypeOf(LinkExtractorInterceptor.prototype), 'constructor', this).call(this);
    this.tagLink = tagLink || TAG_LINK;
    this.tagHref = tagHref || TAG_HREF;
    this.tagSelf = tagSelf || TAG_SELF;
  }

  _createClass(LinkExtractorInterceptor, [{
    key: 'response',
    value: function response(_response) {
      var _this = this;

      debug('link extractor start');
      var value = _response.value;

      if (!_response.hasValue()) {
        debug('link extractor end (do nothing)');
        return _response;
      }

      if (Array.isArray(value)) {
        value.forEach(function (val) {
          return _this._extractOne(val);
        });
      } else {
        this._extractOne(value);
      }

      debug('link extractor end');
      return _response;
    }
  }, {
    key: '_extractOne',
    value: function _extractOne(object) {
      var hasRestLinks = false;
      if ((0, _lodashObjectHas2['default'])(object, '' + this.tagLink) && (0, _lodashLangIsObject2['default'])(object[this.tagLink])) {
        debug('add **links**');
        hasRestLinks = true;

        var _formatLinks2 = this._formatLinks(object[this.tagLink]);

        var finalLinks = _formatLinks2.finalLinks;
        var selfLink = _formatLinks2.selfLink;

        this._defineProperty(object, '**links**', finalLinks);
        this._defineProperty(object, '**selfLink**', selfLink);
      }
      this._defineProperty(object, '**hasLinks**', hasRestLinks);
    }
  }, {
    key: '_defineProperty',
    value: function _defineProperty(object, prop, value) {
      if (object.hasOwnProperty(prop)) {
        object[prop] = value;
      } else {
        Object.defineProperty(object, prop, { value: value, writable: true });
      }
    }
  }, {
    key: '_formatLinks',
    value: function _formatLinks(links) {
      var _this2 = this;

      var finalLinks = {};
      var selfLink = null;
      Object.keys(links).forEach(function (k) {
        var link = links[k];
        if ((0, _lodashLangIsObject2['default'])(link) && (0, _lodashObjectHas2['default'])(link, _this2.tagHref)) {
          if (k === _this2.tagSelf) {
            selfLink = link[_this2.tagHref];
          } else {
            finalLinks[k] = link[_this2.tagHref];
          }
        }
      });
      return { finalLinks: finalLinks, selfLink: selfLink };
    }
  }, {
    key: 'responseError',
    value: function responseError(error) {
      console.error("link extractor responseError", error);
    }
  }]);

  return LinkExtractorInterceptor;
})(_vader.ResponseInterceptor);

exports.LinkExtractorInterceptor = LinkExtractorInterceptor;