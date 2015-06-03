'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

var _idExtractorInterceptor = require('./idExtractorInterceptor');

_defaults(exports, _interopRequireWildcard(_idExtractorInterceptor));

var _linkExtractorInterceptor = require('./linkExtractorInterceptor');

_defaults(exports, _interopRequireWildcard(_linkExtractorInterceptor));

var _embeddedExtractorInterceptor = require('./embeddedExtractorInterceptor');

_defaults(exports, _interopRequireWildcard(_embeddedExtractorInterceptor));

var _populateInterceptor = require('./populateInterceptor');

_defaults(exports, _interopRequireWildcard(_populateInterceptor));

var _paginationExtractorInterceptor = require('./paginationExtractorInterceptor');

_defaults(exports, _interopRequireWildcard(_paginationExtractorInterceptor));