import {ResponseInterceptor} from 'vador';
import has from 'lodash.has';
import Promise from 'bluebird';
import Debug from 'debug';

var debug = new Debug('halClient [Interceptor]');

export class PopulateInterceptor extends ResponseInterceptor {
  response(response) {
    debug('populate interceptor begin');
    let {value, request} = response;

    if (!response.hasValue()) {
      debug('id extractor end (do nothing)');
      return response;
    }

    let promises = [];
    if (Array.isArray(value)) {
      value.forEach(val => {
        promises.push(this._populateOne(val, request));
      });
    } else {
      promises.push(this._populateOne(value, request));
    }

    return Promise
      .all(promises)
      .then(() => {
        debug('populate interceptor end');
        return response;
      });
  }

  _populateOne(object, request) {
    debug('populate one');
    let links = object['**links**'];

    let promises = [];
    request.populates.forEach(pop => {
      var t = pop.split('.');
      var rel = t.shift();

      if (rel && has(links, rel)) {
        let link = links[rel];
        let url = link.substring(0, link.indexOf(rel));
        let r = request.restResource._createSubInstance(url, rel);
        var promise = r.findAll();
        if (t && t.length) {
          promise.populate(t.join('.'));
        }
        promise = promise
          .sendRequest()
          .then(res => {
            object[rel] = res[0];
          });
        promises.push(promise);
      }
    });

    return Promise
      .all(promises)
      .then(() => object);
  }

  responseError(error){
    console.error("populate extractor responseError", error);
  }
}
