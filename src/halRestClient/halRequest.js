import {Request, config as vaderConfig} from 'vader';
import {Populate} from './populate';
import {PaginationExtractorInterceptor, IdExtractorInterceptor, LinkExtractorInterceptor, EmbeddedExtractorInterceptor, PopulateInterceptor}
from '../interceptors/';


export class HalRequest extends Request {
  constructor(baseUrl, resourceName, restResource, config = {}) {
    super(baseUrl, resourceName, restResource, config);
    this._populates = [];
    this._relations = this._config.relations || null;
    this._restKeys.push('**links**', '**selfLink**', '**hasLinks**');

    //internal interceptors
    var interceptors = [
      new PaginationExtractorInterceptor(),
      new EmbeddedExtractorInterceptor(),
      new LinkExtractorInterceptor(),
      new IdExtractorInterceptor(),
      new PopulateInterceptor()
    ];

    this._interceptors = interceptors.concat(this._interceptors);
  }

  populate(...rel) {
    this._populates.push(...rel);
    return this;
  }

  get populates() {
    return new Populate(this._populates);
  }

  hasPopulate() {
    let pop = this._populates;
    return Array.isArray(pop) && pop.length > 0;
  }

  _proxifyOne(object, request) {
    let obj = super._proxifyOne(object);

    let links = object['**links**'];

    if (links) {
      Object.keys(links)
        .forEach(rel => {
          if (!obj.hasOwnProperty(rel) ) {
            let link = links[rel];
            let url = link.substring(0, link.indexOf(rel));
            let r = this.restResource._createSubInstance(url, rel);
            (function(request) {
              let value;
              Object.defineProperty(obj, `${rel}Async`,
                {
                  enumerable:false,
                  get: function() {
                    if (value !== undefined) {
                      return vaderConfig.Promise.resolve(value);
                    } else {
                      return request
                        .findAll()
                        .sendRequest()
                        .then(res => {
                          value = res.value;
                          return vaderConfig.Promise.resolve(value);
                        });
                    }
                  }
                });
            })(r);
          }
        });
    }

    return obj;
  }
}
