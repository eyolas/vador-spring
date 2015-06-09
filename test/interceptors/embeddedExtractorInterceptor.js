import {EmbeddedExtractorInterceptor} from '../../src';
import {expect} from 'chai';

var extractor, response, extracted;

var extract = () => extracted = extractor.response(response);

describe('EmbeddedExtractorInterceptor', () => {
  describe('test with default tag', () => {
    beforeEach(() => {
      extractor = new EmbeddedExtractorInterceptor();
      response = {value: null, request: null};
      extracted = null;
    });
    describe('tests success', () => {
      it('test config', () => {
        expect(extractor).to.have.property('tagEmbedded')
          .and.equal('_embedded');
      });

      it('whith null', () => {
        extract();
        expect(extracted).to.have.property('value')
          .and.to.be.null;
        expect(extracted).to.have.property('request')
          .and.to.be.null;
      });

      it('with object', () => {
        response.value = {
          _embedded: {
              test: {
                  lol: "toto",
                  _embedded: {
                      profils: [{
                          "id": 'god',
                          _embedded: {
                              u: {
                                  "nam": "ahah"
                              }
                          }
                      }, {
                          "id": 'god2',
                          _embedded: {
                              u: {
                                  "nam": "azeaze"
                              }
                          }
                      }]
                  }
              }
          }
        };

        let expected = {
          test: {
              lol: "toto",
              profils: [{
                "id": 'god',
                u: {
                  "nam": "ahah"
                }
              }, {
                "id": 'god2',
                u: {
                  "nam": "azeaze"
                }
              }]
          }
        };
        extract();
        expect(extracted).to.have.property('value')
          .and.to.deep.equal(expected);
        expect(extracted).to.have.property('request');
      });

      it('with array', () => {
        response.value = {
          _embedded: {
            profils: [{
              "id": 'god',
              _embedded: {
                u: {
                  "nam": "ahah"
                }
              }
            }, {
              "id": 'god2',
              _embedded: {
                u: {
                  "nam": "azeaze"
                }
              }
            }]
          }
        };

        let expected = [{
          "id": 'god',
          u: {
            "nam": "ahah"
          }
        }, {
          "id": 'god2',
          u: {
            "nam": "azeaze"
          }
        }];

        extract();
        expect(extracted).to.have.property('value')
          .and.to.deep.equal(expected);
        expect(extracted).to.have.property('request');
      });

      it('with no _embedded and pagination (case with search return no response)', () => {
        let page = {
          "size": 20,
          "totalElements": 4,
          "totalPages": 1,
          "number": 12
        };
        response.value = {
          "_links": {
            "self": {
              "href": "http://localhost:8080/api/rest/services?page=12&size=20{&sort}",
              "templated": true
            },
            "prev": {
              "href": "http://localhost:8080/api/rest/services?page=11&size=20{&sort}",
              "templated": true
            }
          },
          "page": {
            "size": 20,
            "totalElements": 4,
            "totalPages": 1,
            "number": 12
          }
        };
        response.page = {
          "size": 20,
          "totalElements": 4,
          "totalPages": 1,
          "number": 12
        };
        extract();
        expect(extracted).to.have.property('value')
          .and.to.deep.equal([]);
        expect(extracted).to.have.property('request');
        expect(extracted).to.have.property('page')
          .that.deep.equal(page);
      });
    });

    describe('tests errors', () => {
      it('with 2 tag embedded', () => {
        response.value = {
          _embedded: {
            _embedded: {
              'darth': 'vader'
            }
          }
        };
        expect(extract).to.throw(Error, /directly an embedded/);
      });

      it('with 2 tag embedded in sub obj', () => {
        response.value = {
          _embedded: {
            'test': {
              _embedded: {
                _embedded: {
                  'darth': 'vader'
                }
              }
            }
          }
        };
        expect(extract).to.throw(Error, /directly an embedded/);
      });

      it('with 2 tag embedded in sub array', () => {
        response.value = {
          _embedded: {
            'tests': [{
              _embedded: {
                _embedded: {
                  'darth': 'vader'
                }
              }
            }]
          }
        };
        expect(extract).to.throw(Error, /directly an embedded/);
      });


      it('with 2 embedded', () => {
        response.value = {
          _embedded: {
            test1: {
              'darth': 'vader'
            },
            test2: {
              'Luke': 'Skywalker'
            }
          }
        };
        expect(extract).to.throw(Error, /an object with one key/);
      });

      it('with 2 embedded in sub obj', () => {
        response.value = {
          _embedded: {
            'test': {
              _embedded: {
                test1: {
                'darth': 'vader'
                },
                test2: {
                  'Luke': 'Skywalker'
                }
              }
            }
          }
        };
        expect(extract).to.throw(Error, /an object with one key/);
      });

      it('with 2 embedded in sub array', () => {
        response.value = {
          _embedded: {
            'tests': [{
              _embedded: {
                test1: {
                  'darth': 'vader'
                },
                test2: {
                  'Luke': 'Skywalker'
                }
              }
            }]
          }
        };
        expect(extract).to.throw(Error, /an object with one key/);
      });
    });
  });

  describe('test with custom tag', () => {
    before(() => {
      extractor = new EmbeddedExtractorInterceptor('_custom');
      response = {value: null, request: null};
      extracted = null;
    });
    describe('tests success', () => {
      it('test config', () => {
        expect(extractor).to.have.property('tagEmbedded')
          .and.equal('_custom');
      });

      it('whith null', () => {
        extract();
        expect(extracted).to.have.property('value')
          .and.to.be.null;
        expect(extracted).to.have.property('request')
          .and.to.be.null;
      });

      it('with object', () => {
        response.value = {
          _custom: {
              test: {
                  lol: "toto",
                  _custom: {
                      profils: [{
                          "id": 'god',
                          _custom: {
                              u: {
                                  "nam": "ahah"
                              }
                          }
                      }, {
                          "id": 'god2',
                          _custom: {
                              u: {
                                  "nam": "azeaze"
                              }
                          }
                      }]
                  }
              }
          }
        };

        let expected = {
          test: {
              lol: "toto",
              profils: [{
                "id": 'god',
                u: {
                  "nam": "ahah"
                }
              }, {
                "id": 'god2',
                u: {
                  "nam": "azeaze"
                }
              }]
          }
        };
        extract();
        expect(extracted).to.have.property('value')
          .and.to.deep.equal(expected);
        expect(extracted).to.have.property('request');
      });

      it('with array', () => {
        response.value = {
          _custom: {
            profils: [{
              "id": 'god',
              _custom: {
                u: {
                  "nam": "ahah"
                }
              }
            }, {
              "id": 'god2',
              _custom: {
                u: {
                  "nam": "azeaze"
                }
              }
            }]
          }
        };

        let expected = [{
          "id": 'god',
          u: {
            "nam": "ahah"
          }
        }, {
          "id": 'god2',
          u: {
            "nam": "azeaze"
          }
        }];

        extract();
        expect(extracted).to.have.property('value')
          .and.to.deep.equal(expected);
        expect(extracted).to.have.property('request');
      });

      it('with no _custom and pagination (case with search return no response)', () => {
        let page = {
          "size": 20,
          "totalElements": 4,
          "totalPages": 1,
          "number": 12
        };
        response.value = {
          "_links": {
            "self": {
              "href": "http://localhost:8080/api/rest/services?page=12&size=20{&sort}",
              "templated": true
            },
            "prev": {
              "href": "http://localhost:8080/api/rest/services?page=11&size=20{&sort}",
              "templated": true
            }
          },
          "page": {
            "size": 20,
            "totalElements": 4,
            "totalPages": 1,
            "number": 12
          }
        };
        response.page = {
          "size": 20,
          "totalElements": 4,
          "totalPages": 1,
          "number": 12
        };
        extract();
        expect(extracted).to.have.property('value')
          .and.to.deep.equal([]);
        expect(extracted).to.have.property('request');
        expect(extracted).to.have.property('page')
          .that.deep.equal(page);
      });
    });

    describe('tests errors', () => {
      it('with 2 tag embedded', () => {
        response.value = {
          _custom: {
            _custom: {
              'darth': 'vader'
            }
          }
        };
        expect(extract).to.throw(Error, /directly an embedded/);
      });

      it('with 2 tag embedded in sub obj', () => {
        response.value = {
          _custom: {
            'test': {
              _custom: {
                _custom: {
                  'darth': 'vader'
                }
              }
            }
          }
        };
        expect(extract).to.throw(Error, /directly an embedded/);
      });

      it('with 2 tag embedded in sub array', () => {
        response.value = {
          _custom: {
            'tests': [{
              _custom: {
                _custom: {
                  'darth': 'vader'
                }
              }
            }]
          }
        };
        expect(extract).to.throw(Error, /directly an embedded/);
      });


      it('with 2 embedded', () => {
        response.value = {
          _custom: {
            test1: {
              'darth': 'vader'
            },
            test2: {
              'Luke': 'Skywalker'
            }
          }
        };
        expect(extract).to.throw(Error, /an object with one key/);
      });

      it('with 2 embedded in sub obj', () => {
        response.value = {
          _custom: {
            'test': {
              _custom: {
                test1: {
                'darth': 'vader'
                },
                test2: {
                  'Luke': 'Skywalker'
                }
              }
            }
          }
        };
        expect(extract).to.throw(Error, /an object with one key/);
      });

      it('with 2 embedded in sub array', () => {
        response.value = {
          _custom: {
            'tests': [{
              _custom: {
                test1: {
                  'darth': 'vader'
                },
                test2: {
                  'Luke': 'Skywalker'
                }
              }
            }]
          }
        };
        expect(extract).to.throw(Error, /an object with one key/);
      });
    });

  });
});
