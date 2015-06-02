import {RestResource} from 'vador';
import assign from 'lodash.assign';
import {HalRequest} from './halRequest';

export class HalResource extends RestResource {
  _createSubInstance(url, resource, config) {
    return new HalResource(url, resource, config);
  }

  constructBaseRequest(method = 'get', responseType = Array, addUrl = '') {
    var request = new HalRequest(this._baseUrl, this.resourceName, this, this._config);
    request.responseType = responseType;
    request.url = this._baseUrl + this.resourceName + addUrl;
    request.method = method;
    return request;
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

}
