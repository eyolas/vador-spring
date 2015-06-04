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

    response.value = this._extractEmbbeded(value);

    debug('embedded extractor end');
    return response;
  }

  _extractEmbbeded(obj) {
    // if there is an embedded in object set object by the embedded
    if (has(obj, this.tagEmbedded)) {
      obj = obj[this.tagEmbedded];
      let keys = Object.keys(obj);
      if (keys.length === 1) {
        if (keys[0] === this.tagEmbedded) {
          throw new Error("an embedded can't have directly an embedded")
        }

         //if is an array so set object to array (case findAll)
        if (Array.isArray(obj[keys[0]])) {
          obj = obj[keys[0]]
        }
      } else {
        throw new Error('an embedded must have an object with one key');
      }
    }

    return this._internalExtractEmbbeded(obj);
  }

  _internalExtractEmbbeded(obj) {
    //Array first because array is an object
    if (Array.isArray(obj)) {
      return obj.map(v => this._internalExtractEmbbeded(v));
    } else if (isObject(obj)) {
      let newObj = {};
      Object.keys(obj)
        .forEach(k => {
          let val = obj[k];
          if (k === this.tagEmbedded && isObject(val)) {
            if (isObject(val) && Object.keys(val).length === 1) {
              k = Object.keys(val)[0];
              if (k === this.tagEmbedded) {
                throw new Error("an embedded can't have directly an embedded")
              }
              val = val[k];
            } else {
              throw new Error('an embedded must have an object with one key');
            }
          }
          newObj[k] = this._internalExtractEmbbeded(val);
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
