if (process.env.TYPE_BUILD === "yaku") {
  global.Promise = require('yaku');
}

export * from './halRestClient/';
export * from './interceptors';

import d from 'debug';
export var debug = d;
