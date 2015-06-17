import {IdExtractorInterceptor} from '../../src';
import {expect} from 'chai';

var extractor, response, extracted;

var extract = () => extracted = extractor.response(response);

describe('IdExtractorInterceptor', () => {
  beforeEach(() => {
    extractor = new IdExtractorInterceptor();
    response = {value: null, request: null, hasValue: () => !!response.value};
    extracted = null;
  });
  it('whith null', () => {
    extract();
    expect(extracted).to.have.property('value')
      .and.to.be.null;
    expect(extracted).to.have.property('request')
      .and.to.be.null;
  });

  [
    'http://localhost:8080/api/rest/appDefinitions',
    'http://localhost:8080/api/rest/appDefinitions/',
    'http://localhost:8080/api/rest/appDefinitions{?page,size,sort}/',
    'http://localhost:8080/api/rest/appDefinitions{?page,size,sort}',
    'http://localhost:8080/api/{?page,size,sort}/rest/appDefinitions{?page,size,sort}',
    'http://localhost:8080/api/{?page,size,sort}/rest/appDefinitions{?page,size,sort}/',
    'http://localhost:8080/api/{?page,size,sort}/rest/appDefinitions',
    'http://localhost:8080/api/{?page,size,sort}/rest/appDefinitions/'
  ]
  .forEach(function(link) {
    it(link, () => {
      response.value = {'**selfLink**':  link};
      extract();
      expect(extracted).to.have.property('value')
        .that.is.an('object')
        .with.deep.property('id')
          .that.is.a('string')
          .that.is.equal('appDefinitions');
      expect(extracted).to.have.property('request');
    });
  });

  it('with array', () => {
    response.value = [
      {'**selfLink**': 'http://localhost:8080/api/rest/appDefinitions'},
      {'**selfLink**': 'http://localhost:8080/api/rest/appDefinitions/'},
      {'**selfLink**': 'http://localhost:8080/api/rest/appDefinitions{?page,size,sort}/'},
      {'**selfLink**': 'http://localhost:8080/api/rest/appDefinitions{?page,size,sort}'},
      {'**selfLink**': 'http://localhost:8080/api/{?page,size,sort}/rest/appDefinitions{?page,size,sort}'},
      {'**selfLink**': 'http://localhost:8080/api/{?page,size,sort}/rest/appDefinitions{?page,size,sort}/'},
      {'**selfLink**': 'http://localhost:8080/api/{?page,size,sort}/rest/appDefinitions'},
      {'**selfLink**': 'http://localhost:8080/api/{?page,size,sort}/rest/appDefinitions/'}
    ];

    let expected = [
      {'**selfLink**': 'http://localhost:8080/api/rest/appDefinitions', 'id': 'appDefinitions'},
      {'**selfLink**': 'http://localhost:8080/api/rest/appDefinitions/', 'id': 'appDefinitions'},
      {'**selfLink**': 'http://localhost:8080/api/rest/appDefinitions{?page,size,sort}/', 'id': 'appDefinitions'},
      {'**selfLink**': 'http://localhost:8080/api/rest/appDefinitions{?page,size,sort}', 'id': 'appDefinitions'},
      {'**selfLink**': 'http://localhost:8080/api/{?page,size,sort}/rest/appDefinitions{?page,size,sort}', 'id': 'appDefinitions'},
      {'**selfLink**': 'http://localhost:8080/api/{?page,size,sort}/rest/appDefinitions{?page,size,sort}/', 'id': 'appDefinitions'},
      {'**selfLink**': 'http://localhost:8080/api/{?page,size,sort}/rest/appDefinitions', 'id': 'appDefinitions'},
      {'**selfLink**': 'http://localhost:8080/api/{?page,size,sort}/rest/appDefinitions/', 'id': 'appDefinitions'}
    ];

    extract();
    expect(extracted).to.have.property('value')
      .that.is.an('array')
      .and.deep.equal(expected);
    expect(extracted).to.have.property('request');
  });
});
