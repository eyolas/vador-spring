import {RestClient} from 'vador';
import {HalResource} from './halResource';
import assign from 'lodash/object/assign';

export class HalRestClient extends RestClient {
  resource(resourceName, config = {}) {
    if (!this._cache[resourceName]) {
      let conf = assign({}, this._config, config);
      conf.defaultHeaders = assign({}, this._headers, config.defaultHeaders || {});
      conf.interceptors = (config.interceptors || []).concat(this._interceptors);
      if (!conf.http) {
        conf.http = this._http;
      }

      this._cache[resourceName] = new HalResource(this._baseUrl, resourceName , conf);
    }

    return this._cache[resourceName];
  }
}
