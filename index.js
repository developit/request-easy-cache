'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _lruCache = require('lru-cache');

var _lruCache2 = _interopRequireDefault(_lruCache);

var _ms = require('ms');

var _ms2 = _interopRequireDefault(_ms);

var CACHE_DEFAULTS = {
	max: 100,
	maxAge: '1m'
};

/** @class RequestEasyCache
 *	@param {object} [opts={}]
 *	@param {boolean} [opts.cacheHttpErrors=true]	Cache 4xx & 5xx responses?
 *	@param {object} [opts.cache={}]					Options for `lru-cache`
 *	@param {number} [opts.cache.max=100]			Maximum number of responses to cache
*	@param {number} [opts.cache.maxAge='1m']		Maximum length of time to consider a cached result valid.
*	@param {object} [request]						Optionally pass a `request` instance for DI.
 */

var CachedRequest = (function () {
	function CachedRequest() {
		var opts = arguments[0] === undefined ? {} : arguments[0];
		var request = arguments[1] === undefined ? null : arguments[1];

		_classCallCheck(this, CachedRequest);

		this.cacheHttpErrors = opts.cacheHttpErrors !== false;
		this._request = request || _request2['default'];
		this.cacheOptions = extend({}, CACHE_DEFAULTS);
		this.enableCache(opts.cache || {});
	}

	CachedRequest.prototype.enableCache = function enableCache() {
		var options = arguments[0] === undefined ? {} : arguments[0];

		extend(this.cacheOptions, options);
		var opts = extend({}, this.cacheOptions);

		// allow fancy time strings for maxAge
		if (typeof opts.maxAge === 'string') {
			opts.maxAge = (0, _ms2['default'])(opts.maxAge);
		}

		this.cache = new _lruCache2['default'](opts);
		return this;
	};

	CachedRequest.prototype.request = function request() {
		var _this = this;

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		var url = undefined,
		    options = undefined,
		    callback = undefined;
		args.forEach(function (arg) {
			switch (typeof arg) {
				case 'string':
					url = arg;break;
				case 'object':
					options = arg;break;
				case 'function':
					callback = arg;break;
			}
		});

		url = url || options.url || options.uri;
		options = options || {};
		callback = callback || noop;

		if (!url) throw new Error('Request URL is required.');

		if (options.method && String(options.method).toUpperCase() !== 'GET') {
			return this._request.apply(this, args);
		}

		if (options.cache !== false) {
			var cached = this._getCache(url, options);
			if (cached) {
				return callback(null, cached.res, clone(cached.body));
			}
		}
		delete options.cache;

		this._request(url, options, function (err, res, body) {
			if (err) return callback(err);

			if (_this.cacheHttpErrors !== false || res.statusCode && res.statusCode < 400) {
				_this._setCache(url, options, { res: res, body: body });
			}
			callback(null, res, clone(body));
		});
	};

	CachedRequest.prototype.get = function get() {
		for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			args[_key2] = arguments[_key2];
		}

		return this.request.apply(this, args);
	};

	// for old time's sake

	CachedRequest.prototype.cached = function cached() {
		for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
			args[_key3] = arguments[_key3];
		}

		return this.get.apply(this, args);
	};

	CachedRequest.prototype.defaults = function defaults() {
		var opts = arguments[0] === undefined ? {} : arguments[0];

		this._request = this._request.defaults(opts);
		return this;
	};

	CachedRequest.prototype._setCache = function _setCache(url) {
		var options = arguments[1] === undefined ? {} : arguments[1];
		var value = arguments[2] === undefined ? null : arguments[2];

		this.cache.set(cacheKey(url, options), value);
	};

	CachedRequest.prototype._getCache = function _getCache(url) {
		var options = arguments[1] === undefined ? {} : arguments[1];

		return this.cache.get(cacheKey(url, options));
	};

	return CachedRequest;
})();

exports.CachedRequest = CachedRequest;
exports['default'] = new CachedRequest();

function extend(base) {
	for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
		args[_key4 - 1] = arguments[_key4];
	}

	for (var i = 0; i < args.length; i++) {
		var props = args[i];
		for (var p in props) {
			if (props.hasOwnProperty(p)) {
				base[p] = props[p];
			}
		}
	}
	return base;
}

function cacheKey(url, options) {
	return JSON.stringify({ url: url, options: options });
}

function clone(obj) {
	return JSON.parse(JSON.stringify(obj));
}

function noop() {}
//# sourceMappingURL=data:application/json;base64,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SSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Q0FDdkM7O0FBRUQsU0FBUyxJQUFJLEdBQUUsRUFBRSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaW50ZXJuYWxSZXF1ZXN0IGZyb20gJ3JlcXVlc3QnO1xuaW1wb3J0IGNhY2hlIGZyb20gJ2xydS1jYWNoZSc7XG5pbXBvcnQgbXMgZnJvbSAnbXMnO1xuXG5jb25zdCBDQUNIRV9ERUZBVUxUUyA9IHtcblx0bWF4OiAxMDAsXG5cdG1heEFnZTogJzFtJ1xufTtcblxuXG4vKiogQGNsYXNzIFJlcXVlc3RFYXN5Q2FjaGVcbiAqXHRAcGFyYW0ge29iamVjdH0gW29wdHM9e31dXG4gKlx0QHBhcmFtIHtib29sZWFufSBbb3B0cy5jYWNoZUh0dHBFcnJvcnM9dHJ1ZV1cdENhY2hlIDR4eCAmIDV4eCByZXNwb25zZXM/XG4gKlx0QHBhcmFtIHtvYmplY3R9IFtvcHRzLmNhY2hlPXt9XVx0XHRcdFx0XHRPcHRpb25zIGZvciBgbHJ1LWNhY2hlYFxuICpcdEBwYXJhbSB7bnVtYmVyfSBbb3B0cy5jYWNoZS5tYXg9MTAwXVx0XHRcdE1heGltdW0gbnVtYmVyIG9mIHJlc3BvbnNlcyB0byBjYWNoZVxuKlx0QHBhcmFtIHtudW1iZXJ9IFtvcHRzLmNhY2hlLm1heEFnZT0nMW0nXVx0XHRNYXhpbXVtIGxlbmd0aCBvZiB0aW1lIHRvIGNvbnNpZGVyIGEgY2FjaGVkIHJlc3VsdCB2YWxpZC5cbipcdEBwYXJhbSB7b2JqZWN0fSBbcmVxdWVzdF1cdFx0XHRcdFx0XHRPcHRpb25hbGx5IHBhc3MgYSBgcmVxdWVzdGAgaW5zdGFuY2UgZm9yIERJLlxuICovXG5leHBvcnQgY2xhc3MgQ2FjaGVkUmVxdWVzdCB7XG5cdGNvbnN0cnVjdG9yKG9wdHM9e30sIHJlcXVlc3Q9bnVsbCkge1xuXHRcdHRoaXMuY2FjaGVIdHRwRXJyb3JzID0gb3B0cy5jYWNoZUh0dHBFcnJvcnMhPT1mYWxzZTtcblx0XHR0aGlzLl9yZXF1ZXN0ID0gcmVxdWVzdCB8fCBpbnRlcm5hbFJlcXVlc3Q7XG5cdFx0dGhpcy5jYWNoZU9wdGlvbnMgPSBleHRlbmQoe30sIENBQ0hFX0RFRkFVTFRTKTtcblx0XHR0aGlzLmVuYWJsZUNhY2hlKG9wdHMuY2FjaGUgfHwge30pO1xuXHR9XG5cblx0ZW5hYmxlQ2FjaGUob3B0aW9ucz17fSkge1xuXHRcdGV4dGVuZCh0aGlzLmNhY2hlT3B0aW9ucywgb3B0aW9ucyk7XG5cdFx0bGV0IG9wdHMgPSBleHRlbmQoe30sIHRoaXMuY2FjaGVPcHRpb25zKTtcblxuXHRcdC8vIGFsbG93IGZhbmN5IHRpbWUgc3RyaW5ncyBmb3IgbWF4QWdlXG5cdFx0aWYgKHR5cGVvZiBvcHRzLm1heEFnZT09PSdzdHJpbmcnKSB7XG5cdFx0XHRvcHRzLm1heEFnZSA9IG1zKG9wdHMubWF4QWdlKTtcblx0XHR9XG5cblx0XHR0aGlzLmNhY2hlID0gbmV3IGNhY2hlKG9wdHMpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0cmVxdWVzdCguLi5hcmdzKSB7XG5cdFx0bGV0IHVybCwgb3B0aW9ucywgY2FsbGJhY2s7XG5cdFx0YXJncy5mb3JFYWNoKCBhcmcgPT4ge1xuXHRcdFx0c3dpdGNoICh0eXBlb2YgYXJnKSB7XG5cdFx0XHRcdGNhc2UgJ3N0cmluZyc6IHVybCA9IGFyZzsgYnJlYWs7XG5cdFx0XHRcdGNhc2UgJ29iamVjdCc6IG9wdGlvbnMgPSBhcmc7IGJyZWFrO1xuXHRcdFx0XHRjYXNlICdmdW5jdGlvbic6IGNhbGxiYWNrID0gYXJnOyBicmVhaztcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHVybCA9IHVybCB8fCBvcHRpb25zLnVybCB8fCBvcHRpb25zLnVyaTtcblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblx0XHRjYWxsYmFjayA9IGNhbGxiYWNrIHx8IG5vb3A7XG5cblx0XHRpZiAoIXVybCkgdGhyb3cgbmV3IEVycm9yKCdSZXF1ZXN0IFVSTCBpcyByZXF1aXJlZC4nKTtcblxuXHRcdGlmIChvcHRpb25zLm1ldGhvZCAmJiBTdHJpbmcob3B0aW9ucy5tZXRob2QpLnRvVXBwZXJDYXNlKCkhPT0nR0VUJykge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3JlcXVlc3QoLi4uYXJncyk7XG5cdFx0fVxuXG5cdFx0aWYgKG9wdGlvbnMuY2FjaGUhPT1mYWxzZSkge1xuXHRcdFx0bGV0IGNhY2hlZCA9IHRoaXMuX2dldENhY2hlKHVybCwgb3B0aW9ucyk7XG5cdFx0XHRpZiAoY2FjaGVkKSB7XG5cdFx0XHRcdHJldHVybiBjYWxsYmFjayhudWxsLCBjYWNoZWQucmVzLCBjbG9uZShjYWNoZWQuYm9keSkpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRkZWxldGUgb3B0aW9ucy5jYWNoZTtcblxuXHRcdHRoaXMuX3JlcXVlc3QodXJsLCBvcHRpb25zLCAoZXJyLCByZXMsIGJvZHkpID0+IHtcblx0XHRcdGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpO1xuXG5cdFx0XHRpZiAodGhpcy5jYWNoZUh0dHBFcnJvcnMhPT1mYWxzZSB8fCAocmVzLnN0YXR1c0NvZGUgJiYgcmVzLnN0YXR1c0NvZGU8NDAwKSkge1xuXHRcdFx0XHR0aGlzLl9zZXRDYWNoZSh1cmwsIG9wdGlvbnMsIHsgcmVzLCBib2R5IH0pO1xuXHRcdFx0fVxuXHRcdFx0Y2FsbGJhY2sobnVsbCwgcmVzLCBjbG9uZShib2R5KSk7XG5cdFx0fSk7XG5cdH1cblxuXHRnZXQoLi4uYXJncykge1xuXHRcdHJldHVybiB0aGlzLnJlcXVlc3QoLi4uYXJncyk7XG5cdH1cblxuXHQvLyBmb3Igb2xkIHRpbWUncyBzYWtlXG5cdGNhY2hlZCguLi5hcmdzKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0KC4uLmFyZ3MpO1xuXHR9XG5cblx0ZGVmYXVsdHMob3B0cz17fSkge1xuXHRcdHRoaXMuX3JlcXVlc3QgPSB0aGlzLl9yZXF1ZXN0LmRlZmF1bHRzKG9wdHMpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0X3NldENhY2hlKHVybCwgb3B0aW9ucz17fSwgdmFsdWU9bnVsbCkge1xuXHRcdHRoaXMuY2FjaGUuc2V0KFxuXHRcdFx0Y2FjaGVLZXkodXJsLCBvcHRpb25zKSxcblx0XHRcdHZhbHVlXG5cdFx0KTtcblx0fVxuXG5cdF9nZXRDYWNoZSh1cmwsIG9wdGlvbnM9e30pIHtcblx0XHRyZXR1cm4gdGhpcy5jYWNoZS5nZXQoXG5cdFx0XHRjYWNoZUtleSh1cmwsIG9wdGlvbnMpXG5cdFx0KTtcblx0fVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBDYWNoZWRSZXF1ZXN0KCk7XG5cblxuXG5mdW5jdGlvbiBleHRlbmQoYmFzZSwgLi4uYXJncykge1xuXHRmb3IgKGxldCBpPTA7IGk8YXJncy5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBwcm9wcyA9IGFyZ3NbaV07XG5cdFx0Zm9yIChsZXQgcCBpbiBwcm9wcykge1xuXHRcdFx0aWYgKHByb3BzLmhhc093blByb3BlcnR5KHApKSB7XG5cdFx0XHRcdGJhc2VbcF0gPSBwcm9wc1twXTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIGJhc2U7XG59XG5cbmZ1bmN0aW9uIGNhY2hlS2V5KHVybCwgb3B0aW9ucykge1xuXHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkoeyB1cmwsIG9wdGlvbnMgfSk7XG59XG5cbmZ1bmN0aW9uIGNsb25lKG9iaikge1xuXHRyZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKTtcbn1cblxuZnVuY3Rpb24gbm9vcCgpe31cbiJdfQ==