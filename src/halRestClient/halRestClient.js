import {RestClient} from 'vader';
import {HalResource} from './halResource';
import assign from 'lodash/object/assign';

export class HalRestClient extends RestClient {
  instanciateResource(resourceName, conf) {
   return new HalResource(this._baseUrl, resourceName , conf);
  }
}
