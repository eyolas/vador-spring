import {RestResource} from 'vador';
import normalizeUrl from 'normalize-url';
import assign from 'lodash.assign';
import {HalRequest} from './halRequest';
import {IdExtractorInterceptor, LinkExtractorInterceptor, EmbeddedExtractorInterceptor, PopulateInterceptor}
from './interceptors/';


const REGEX_LASTPART = /\/([^/]*)\/?$/;

export class HalResource extends RestResource {
  constructor(baseUrl, resourceName , config = {}) {
    super(baseUrl, resourceName , config);
    this._request = new HalRequest(resourceName, this);
    this._relations = this._config.relations || null;
    this._restKeys.push('**links**', '**selfLink**', '**hasLinks**');

    //internal interceptors
    var interceptors = [
      new EmbeddedExtractorInterceptor(),
      new LinkExtractorInterceptor(),
      new IdExtractorInterceptor(),
      new PopulateInterceptor()
    ];

    this._interceptors = interceptors.concat(this._interceptors);
  }

  _createSubInstance(url, resource) {
    return new HalResource(url, resource, this._allConfig);
  }

  _transformToLink(value, link, rel) {
    let newValue = null;
    let {href, type} = link;

    if (value === null) {
      return {type, newValue};
    }

    if (type === 'many') {
      if (!Array.isArray(value)) {
        throw new Error(`For relation ${rel}, the value must be an Array`);
      }

      newValue = [];
      value.forEach(val => {
        let tval = this._transformToLinkOne(val, href, rel);
        if (tval !== null) {
          newValue.push(tval);
        }
      });
    } else {
      newValue = this._transformToLinkOne(value, href, rel);
    }

    return {type, newValue};
  }

  _transformToLinkOne(value, href, rel) {
    if(value == null) {
      return null;
    }

    if (value.id) {
      // remove duplicate slashes
      return `${href}/${value.id}`.replace(/\/{2,}/, '/');
    } else {
      throw new Error(`For relation ${rel}, the value must have id`);
    }
  }



  save(obj) {
    let links = assign({}, this._relations || {});
    if (links) {
      Object
        .keys(links)
        .forEach(rel =>{
          if (obj.hasOwnProperty(rel)) {
            let {type, newValue} = this._transformToLink(obj[rel], links[rel], rel);
            obj[rel] = newValue;
          }
        });
    }
    return super.save(obj);
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
            let r = this._createSubInstance(url, rel);
            (function(request) {
              let value;
              Object.defineProperty(obj, `${rel}Async`,
                {
                  enumerable:false,
                  get: function() {
                    if (value !== undefined) {
                      return Promise.resolve(value);
                    } else {
                      return request
                        .findAll()
                        .sendRequest()
                        .spread(res => {
                          value = res;
                          return Promise.resolve(value);
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

  populate(...rel) {
    this._request.populate(...rel);
    return this;
  }

}
