'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

var _vader = require('vader');

Object.defineProperty(exports, 'config', {
  enumerable: true,
  get: function get() {
    return _vader.config;
  }
});

var _halRestClient = require('./halRestClient/');

_defaults(exports, _interopExportWildcard(_halRestClient, _defaults));

var _interceptors = require('./interceptors');

_defaults(exports, _interopExportWildcard(_interceptors, _defaults));