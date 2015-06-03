import {ResponseInterceptor} from 'vador';
import has from 'lodash/object/has';
import Debug from 'debug';

var debug = new Debug('halClient [Interceptor]');

const PAGE = 'page';

export class PaginationExtractorInterceptor extends ResponseInterceptor {
  constructor(tagPage) {
    super();
    this.tagPage = tagPage || PAGE;
  }

  response(response) {
    debug('pagination extractor start');
    let {value, request} = response;
    if (has(value), this.tagPage) {
      response.page = value.page;
    }

    debug('pagination extractor end');
    return response;
  }

  responseError(error){
    console.error("pagination extractor responseError", error);
  }
}
