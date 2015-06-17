import {config} from 'vador';

if (process.env.TYPE_BUILD === "yaku") {
  config.Promise = require('yaku');
}

export {config};

export * from './halRestClient/';
export * from './interceptors';

import d from 'debug';
export var debug = d;
