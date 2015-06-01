import {ResponseInterceptor} from 'vador';
import has from 'lodash.has';
import isObject from 'lodash.isobject';
import Debug from 'debug';

var debug = new Debug('halClient [Interceptor]');

const TAG_LINK = '_links';
const TAG_HREF = 'href';
const TAG_SELF = 'self';

export class LinkExtractorInterceptor extends ResponseInterceptor {
  constructor(tagLink, tagHref, tagSelf) {
    super();
    this.tagLink = tagLink || TAG_LINK;
    this.tagHref = tagHref || TAG_HREF;
    this.tagSelf = tagSelf || TAG_SELF;
  }

  response(response) {
    debug('link extractor start');
    let {value} = response;

    if (!response.hasValue()) {
      debug('link extractor end (do nothing)');
      return response;
    }

    if (Array.isArray(value)) {
      value.forEach(val => this._extractOne(val));
    } else {
      this._extractOne(value);
    }

    debug('link extractor end');
    return response;
  }

  _extractOne(object) {
    let hasRestLinks = false;
    if (has(object, `${this.tagLink}`) && isObject(object[this.tagLink])) {
      debug('add **links**');
      hasRestLinks = true;
      let {finalLinks, selfLink} = this._formatLinks(object[this.tagLink]);
      this._defineProperty(object, '**links**', finalLinks);
      this._defineProperty(object, '**selfLink**', selfLink);

    }
    this._defineProperty(object, '**hasLinks**', hasRestLinks);
  }

  _defineProperty(object, prop, value) {
    if (object.hasOwnProperty(prop)) {
      object[prop] = value;
    } else {
      Object.defineProperty(object, prop, {value, writable: true});
    }
  }

  _formatLinks(links) {
    let finalLinks = {};
    let selfLink = null;
    Object
      .keys(links)
      .forEach(k => {
        let link = links[k];
        if (isObject(link) && has(link, this.tagHref)) {
          if (k === this.tagSelf) {
            selfLink = link[this.tagHref];
          } else {
            finalLinks[k] = link[this.tagHref];
          }
        }
      });
    return {finalLinks, selfLink};
  }

  responseError(error){
    console.error("link extractor responseError", error);
  }
}
