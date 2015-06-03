import set from 'lodash/object/set';
import isObject from 'lodash/lang/isObject';

export class Populate {
  constructor(populates = []) {
    if (!Array.isArray(populates)) {
      populates = [];
    }
    this._populates = {};

    //transform array to tree
    populates
      .forEach(populate => {
        this._populates = set(this._populates, populate, {});
      });

  }

  keys() {
    return Object.keys(this._populates);
  }

  get populates() {
    return this._populates;
  }

  getPopulateArray() {
    return this._getPopulate(this._populates);
  }


  _getPopulate(obj) {
    var populates = [];
    Object.keys(obj)
      .forEach(k => {
        var val = obj[k];
        if (isObject(val) && Object.keys(val).length) {
          var p = this._getPopulate(val);
          p.forEach(v => populates.push(k + '.' + v));
        } else {
          populates.push(k);
        }
      });
    return populates;
  }

  getSubPopulate(sub) {
    let subPopulate = this._populates[sub];
    if (subPopulate) {
      return this._getPopulate(subPopulate)
    } else {
      return [];
    }
  }
}
