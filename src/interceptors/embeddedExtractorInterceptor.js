import {ResponseInterceptor} from 'vador';
import has from 'lodash/object/has';
import Debug from 'debug';

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
    if (request.responseType === Array) {
      if (has(value, `${this.tagEmbedded}.${request.resourceName}`)) {
        value = value[this.tagEmbedded][request.resourceName];
      }
    }

    response.value = value;

    debug('embedded extractor end');
    return response;
  }

  responseError(error){
    console.error("embedded extractor responseError", error);
  }
}
