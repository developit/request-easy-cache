[![NPM version][npm-version-image]][npm-url] [![NPM downloads][npm-downloads-image]][npm-url] [![MIT License][license-image]][license-url] [![Build Status][travis-image]][travis-url]

# request-easy-cache

> A caching wrapper around [request].
>
> `npm install --save request-easy-cache`

`request-easy-cache` wraps calls to `request` in a layer that caches HTTP responses automatically. Multiple identical requests produce a cached `response` and `body`.

Caching is done in-memory using [lru-cache], keyed on `{url,options}`. Calls with identical `url` and `options` return the same `response` and a cloned `body`.


---


## Usage

Provided in ES6 for clarity.

```js
import request from 'request-easy-cache';

function get(callback) {
	request.get('http://pokeapi.co/api/v1/pokemon/1', {
		json: true
	}, (err, res, body) => {
		callback(body);
	});
}

// simple test example
get( body => {

	let start = Date.now();
	get( body2 => {
		let time = Date.now() - start;

		assert.ok(time<10, 'Should be a cache hit (<10ms)');

		assert.deepEqual(body, body2, 'Should return the same data for a cached call');
	});
});
```


> _**Note:** In addition to [request]'s options, `request-easy-cache` adds a `{boolean} cache` option that, when set to `false`, disables caching for the request._


---


## Methods


##### `.get(url, callback)`

> Fetch a URL using the default options.
>
> Callback signature is identical to [request]'s: `(err, res, body)`.

##### `.get(url, options, callback)`

> Fetch a URL with the specified options.
>
> Supports all [request] options.

##### `.get(options, callback)`

> Fetch via the specified options.
>
> One of `options.url` or `options.uri` must be set.
>
> Supports all [request] options.


---


## Configuration

The default export is an instance of `RequestEasyCache` with all default options.

* `max: 100`: Maximum number of responses to keep cached. Least-recently-used responses are dropped in favor of new ones.
* `maxAge: 60000`: Maximum time to keep cached responses, in milliseconds. Defaults to 1 minute.

You can override the default settings:

```js
requestEasyCache.enableCache({
	max: 100,		   // 100 cached responses
	maxAge: 60000	   // 60 seconds, in milliseconds
});
```

It is also possible to create customized instances of `RequestEasyCache`:

```js
import { RequestEasyCache } from 'request-easy-cache';

let cachedRequest = new RequestEasyCache({
	cacheHttpErrors: false,		// don't cache 4xx/5xx errors
	cache: {
		max: 200,		// max number of responses to keep
		maxAge: 5*6e4	// 5 minute cache lifetime
	}
});

cachedRequest.get('...', (err, res, body) => {});
```


## How It Works

Caching uses a compound key `{ url, options }`. Calls with identical `url` and `options` return the same data.


---


## Version History

* `1.2.0` - Support time strings for `cache.maxAge` via [ms](https://www.npmjs.com/package/ms).
* `1.1.1` - Added preferred support for `.get()`. `.cached()` is now an alias.
* `1.1.0` - Updated to be simpler and more similar to the [request] API (retains backwards compatibility).
* `1.0.0` - Forked from [request-again], rewritten in ES6.


[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-url]: https://github.com/developit/request-easy-cache/blob/master/LICENSE

[npm-version-image]: http://img.shields.io/npm/v/request-easy-cache.svg?style=flat-square
[npm-downloads-image]: http://img.shields.io/npm/dm/request-easy-cache.svg?style=flat-square
[npm-url]: https://npmjs.org/package/request-easy-cache

[travis-image]: http://img.shields.io/travis/developit/request-easy-cache.svg?style=flat-square
[travis-url]: http://travis-ci.org/developit/request-easy-cache

[request]: https://www.npmjs.com/package/request
[request-again]: https://github.com/hemphillcc/request-again
[lru-cache]: https://www.npmjs.com/package/lru-cache
