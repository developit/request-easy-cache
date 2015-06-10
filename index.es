import request from 'request';
import cache from 'lru-cache';

const CACHE_DEFAULTS = {
	max: 100,
	maxAge: 60000
};


/** @class RequestEasyCache
 *	@param {object} [opts={}]
 *	@param {boolean} [opts.cacheHttpErrors=true]	Cache 4xx & 5xx responses?
 *	@param {object} [opts.cache={}]					Options for `lru-cache`
 *	@param {number} [opts.cache.max=100]			Maximum number of responses to cache
*	@param {number} [opts.cache.maxAge=60000]		Maximum length of time to consider a cached result valid (default: 60s)
*	@param {object} [request=global.request]		Optionally pass a `request` instance for DI.
 */
export class CachedRequest {
    constructor(opts={}, request=global.request) {
		this.cacheHttpErrors = opts.cacheHttpErrors!==false;
        this._request = request;
        this.cacheOptions = extend({}, CACHE_DEFAULTS, opts.cache || {});
    	this.cache = new cache(this.cacheOptions);
    }

    enableCache(options={}) {
        extend(this.cacheOptions, options);
    	this.cache = new cache(this.cacheOptions);
    	return this;
    }

    get(...args) {
    	let url, options, callback;
        args.forEach( arg => {
            switch (typeof arg) {
                case 'string': url = arg; break;
                case 'object': options = arg; break;
                case 'function': callback = arg; break;
            }
        });

        url = url || options.url || options.uri;
		options = options || {};
        callback = callback || noop;

    	if (!url) throw new Error('Request URL is required.');

		if (options.cache!==false) {
	    	let cached = this._getCache(url, options);
	    	if (cached) {
				return callback(null, cached.res, clone(cached.body));
			}
		}
		delete options.cache;

    	this._request(url, options, (err, res, body) => {
    		if (err) return callback(err);

			if (this.cacheHttpErrors!==false || (res.status && res.status<400)) {
	    		this._setCache(url, options, { res, body });
			}
    		callback(null, res, clone(body));
    	});
    }

	// for old time's sake
	cached(...args) {
		return this.get(...args);
	}

    defaults(opts={}) {
    	this._request = request.defaults(opts);
    	return this;
    }

    _setCache(url, options={}, value=null) {
    	this.cache.set(
            cacheKey(url, options),
            value
        );
    }

    _getCache(url, options={}) {
    	return this.cache.get(
            cacheKey(url, options)
        );
    }
}


export default new CachedRequest();



function extend(base, ...args) {
    for (let i=0; i<args.length; i++) {
		let props = args[i];
        for (let p in props) {
			if (props.hasOwnProperty(p)) {
				base[p] = props[p];
			}
		}
	}
    return base;
}

function cacheKey(url, options) {
	return JSON.stringify({ url, options });
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function noop(){}
