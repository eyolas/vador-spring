import {ResponseInterceptor} from 'vader';
import has from 'lodash/object/has';
import Debug from 'debug';

var debug = new Debug('halClient [Interceptor]');

export class PopulateInterceptor extends ResponseInterceptor {
  response(response) {
    debug('populate interceptor begin');
    let {value, request} = response;

    if (!response.hasValue() || !request.hasPopulate()) {
      debug('Populate extractor end (do nothing)');
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
    var populates = request.populates;

    populates
      .keys()
      .forEach(rel => {
        if (rel && has(links, rel)) {
          let link = links[rel];
          let url = link.substring(0, link.indexOf(rel));
          let r = request.restResource._createSubInstance(url, rel);
          var promise = r.findAll();
          var subPopulate = populates.getSubPopulate(rel);
          if (Array.isArray(subPopulate) && subPopulate.length) {
            promise.populate(...subPopulate);
          }
          promise = promise
            .sendRequest()
            .then(res => {
              object[rel] = res.value;
            });
          promises.push(promise);
        }
      });

    return Promise
      .all(promises)
      .then(() => {
        return object;
      });
  }

  responseError(error){
    console.error("populate extractor responseError", error);
  }
}
