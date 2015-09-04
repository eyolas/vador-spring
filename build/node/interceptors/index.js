'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

var _idExtractorInterceptor = require('./idExtractorInterceptor');

_defaults(exports, _interopExportWildcard(_idExtractorInterceptor, _defaults));

var _linkExtractorInterceptor = require('./linkExtractorInterceptor');

_defaults(exports, _interopExportWildcard(_linkExtractorInterceptor, _defaults));

var _embeddedExtractorInterceptor = require('./embeddedExtractorInterceptor');

_defaults(exports, _interopExportWildcard(_embeddedExtractorInterceptor, _defaults));

var _populateInterceptor = require('./populateInterceptor');

_defaults(exports, _interopExportWildcard(_populateInterceptor, _defaults));

var _paginationExtractorInterceptor = require('./paginationExtractorInterceptor');

_defaults(exports, _interopExportWildcard(_paginationExtractorInterceptor, _defaults));