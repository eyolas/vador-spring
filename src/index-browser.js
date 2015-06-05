if (process.env.TYPE_BUILD === "yaku") {
  global.Promise = require('yaku');
}

export * from './halRestClient';
export * from './halResource';
export * from './halRequest';
export * from './interceptors';

import d from 'debug';
export var debug = d;
