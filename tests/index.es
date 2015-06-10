import mocha from 'mocha';
import { expect } from 'chai';
import request from '../index.es';

request.defaults({
	timeout: 5000,
	strictSSL: false
});

describe('request-easy-cache', function() {
	this.timeout(5000);

	describe('.get()', λ => {
        let cached;

        it('should handle initial request normally', done => {
            let start = Date.now();
        	request.get('http://pokeapi.co/api/v1/pokemon/1', {
				json: true
            }, (err, res, body) => {
                let time = Date.now() - start;
                console.log(`Request took ${time}ms`);

                expect(time).to.be.lessThan(4900);
                expect(time).to.be.greaterThan(5);

                expect(err).to.equal(null);         // Should not return an error
                expect(body).to.be.an('object');    // Should fetch an Object body

                cached = { res, body };

                done();
            });
        });

        it('should return subsequent request from cache', done => {
            let start = Date.now();
        	request.get('http://pokeapi.co/api/v1/pokemon/1', {
				json: true
            }, (err, res, body) => {
                let time = Date.now() - start;
                console.log(`Cached request took ${time}ms`);

                expect(time).to.be.lessThan(10);

                expect(err).to.equal(null);
				expect(res).to.deep.equal(cached.res);
				expect(body).to.deep.equal(cached.body);

                done();
            });
        });

		it('should handle 404 normally', done => {
            let start = Date.now();
        	request.get('http://example.com/foo/bar', (err, res, body) => {
                let time = Date.now() - start;
                console.log(`Request took ${time}ms`);

                expect(time).to.be.lessThan(4900);
                expect(time).to.be.greaterThan(5);

                expect(err).to.equal(null);
                expect(body).to.be.a('string');

                cached = { res, body };

                done();
            });
        });

		it('should cache 404 result', done => {
            let start = Date.now();
        	request.get('http://example.com/foo/bar', (err, res, body) => {
                let time = Date.now() - start;
                console.log(`Request took ${time}ms`);

				expect(time).to.be.lessThan(10);

                expect(err).to.equal(null);
				expect(res).to.deep.equal(cached.res);
				expect(body).to.deep.equal(cached.body);

                done();
            });
        });

    });
});
