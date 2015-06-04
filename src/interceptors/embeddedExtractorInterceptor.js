import {ResponseInterceptor} from 'vador';
import has from 'lodash/object/has';
import Debug from 'debug';
import isObject from 'lodash/lang/isObject';

var debug = new Debug('halClient [Interceptor]');

const EMBEDDED = '_embedded';

export class EmbeddedExtractorInterceptor extends ResponseInterceptor {
  constructor(tagEmbedded) {
    super();
    this.tagEmbedded = tagEmbedded || EMBEDDED;
  }

  response(response) {
    debug('embedded extractor start');
    let {value, request} = response;

    response.value = this.extractEmbbeded(value);

    debug('embedded extractor end');
    return response;
  }

  extractEmbbeded(obj) {
    //Array first because array is an object
    if (Array.isArray(obj)) {
      return obj.map(v => this.extractEmbbeded(v));
    } else if (isObject(obj)) {
      let newObj = {};
      Object.keys(obj)
        .forEach(k => {
          let val = obj[k];
          if (k === '_embedded' && isObject(val) && Object.keys(val).length === 1) {
            if (isObject(val) && Object.keys(val).length === 1) {
              k = Object.keys(val)[0];
              if (k === '_embedded') {
                throw new Error("an embedded can't have directly an embedded")
              }
              val = val[k];
            } else {
              throw new Error('an embedded must have an object with one key');
            }
          }
          newObj[k] = this.extractEmbbeded(val);
        });
      return newObj;
    } else {
      return obj;
    }
  }

  responseError(error){
    console.error("embedded extractor responseError", error);
  }
}
