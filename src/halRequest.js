import {Request} from 'vador';

export class HalRequest extends Request {
  constructor(resourceName, restResource)  {
    super(resourceName, restResource);
    this._populate = [];
  }

  populate(...rel) {
    this._populate.push(...rel);
  }

  get populates() {
    return this._populate;
  }

  hasPopulate() {
    let pop = this._populate;
    return Array.isArray(pop) && pop.length > 0;
  }

  reset() {
    super.reset();
    this._populate = [];
  }
}
