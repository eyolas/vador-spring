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

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var debug = new _debug2['default']('halClient [Interceptor]');

var PAGE = 'page';

var PaginationExtractorInterceptor = (function (_ResponseInterceptor) {
  _inherits(PaginationExtractorInterceptor, _ResponseInterceptor);

  function PaginationExtractorInterceptor(tagPage) {
    _classCallCheck(this, PaginationExtractorInterceptor);

    _get(Object.getPrototypeOf(PaginationExtractorInterceptor.prototype), 'constructor', this).call(this);
    this.tagPage = tagPage || PAGE;
  }

  _createClass(PaginationExtractorInterceptor, [{
    key: 'response',
    value: function response(_response) {
      debug('pagination extractor start');
      var value = _response.value;
      var request = _response.request;

      if ((0, _lodashObjectHas2['default'])(value, this.tagPage)) {
        _response.page = value.page;
      }

      debug('pagination extractor end');
      return _response;
    }
  }, {
    key: 'responseError',
    value: function responseError(error) {
      console.error("pagination extractor responseError", error);
    }
  }]);

  return PaginationExtractorInterceptor;
})(_vader.ResponseInterceptor);

exports.PaginationExtractorInterceptor = PaginationExtractorInterceptor;