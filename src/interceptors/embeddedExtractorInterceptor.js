import {ResponseInterceptor} from 'vador';
import has from 'lodash/object/has';
import Debug from 'debug';

var debug = new Debug('halClient [Interceptor]');

const EMBEDDED = '_embedded';
const PAGE = 'page';

export class EmbeddedExtractorInterceptor extends ResponseInterceptor {
  constructor(tagEmbedded, tagPage) {
    super();
    this.tagEmbedded = tagEmbedded || EMBEDDED;
    this.tagPage = tagPage || PAGE;
  }

  response(response) {
    debug('embedded extractor start');
    let {value, request} = response;
    if (request.responseType === Array) {
      if (has(value, `${this.tagEmbedded}.${request.resourceName}`)) {
        if (has(value), this.tagPage) {
          response.page = value.page;
        }
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
