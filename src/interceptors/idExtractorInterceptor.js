import {ResponseInterceptor} from 'vador';
import Debug from 'debug';

var debug = new Debug('halClient [Interceptor]');

const REGEX_LASTPART = /.*\/([^\{]+)/; // get last element before { (example: /api/rest/credentials/admin{?projection} -> admin)

export class IdExtractorInterceptor extends ResponseInterceptor {

  response(response) {
    debug('id extractor start');
    let {value} = response;


    if (!response.hasValue()) {
      debug('id extractor end (do nothing)');
      return response;
    }

    if (Array.isArray(value)) {
      value.forEach(val => this._extractId(val));
    } else {
      this._extractId(value);
    }

    debug('id extractor end');
    return response;
  }

  _extractId(object) {
    if (!object.id) {
      let link = object['**selfLink**'];
      if (link) {
        let matches = link.match(REGEX_LASTPART);
        if (matches.length > 1) {
          object.id = matches[1];
        }
      }
    }
  }

  responseError(error){
    console.error("id extractor responseError");
    console.error(error.stack);
  }
}
