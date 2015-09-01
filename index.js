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
		var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
		var request = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

		_classCallCheck(this, CachedRequest);

		this.cacheHttpErrors = opts.cacheHttpErrors !== false;
		this._request = request || _request2['default'];
		this.cacheOptions = extend({}, CACHE_DEFAULTS);
		this.enableCache(opts.cache || {});
	}

	CachedRequest.prototype.enableCache = function enableCache() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		extend(this.cacheOptions, options);
		var opts = extend({}, this.cacheOptions);

		// allow fancy time strings for maxAge
		if (typeof opts.maxAge === 'string') {
			opts.maxAge = _ms2['default'](opts.maxAge);
		}

		this.cache = new _lruCache2['default'](opts);
		return this;
	};

	CachedRequest.prototype.request = function request() {
		var _this = this;

		var url = undefined,
		    options = undefined,
		    callback = undefined;

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

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

			if (_this.cacheHttpErrors !== false || res.status && res.status < 400) {
				_this._setCache(url, options, { res: res, body: body });
			}
			callback(null, res, clone(body));
		});
	};

	CachedRequest.prototype.get = function get() {
		return this.request.apply(this, arguments);
	};

	// for old time's sake

	CachedRequest.prototype.cached = function cached() {
		return this.get.apply(this, arguments);
	};

	CachedRequest.prototype.defaults = function defaults() {
		var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		this._request = this._request.defaults(opts);
		return this;
	};

	CachedRequest.prototype._setCache = function _setCache(url) {
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
		var value = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

		this.cache.set(cacheKey(url, options), value);
	};

	CachedRequest.prototype._getCache = function _getCache(url) {
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		return this.cache.get(cacheKey(url, options));
	};

	return CachedRequest;
})();

exports.CachedRequest = CachedRequest;
exports['default'] = new CachedRequest();

function extend(base) {
	for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
		args[_key2 - 1] = arguments[_key2];
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
//# sourceMappingURL=data:application/json;base64,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RSxFQUFFIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBpbnRlcm5hbFJlcXVlc3QgZnJvbSAncmVxdWVzdCc7XG5pbXBvcnQgY2FjaGUgZnJvbSAnbHJ1LWNhY2hlJztcbmltcG9ydCBtcyBmcm9tICdtcyc7XG5cbmNvbnN0IENBQ0hFX0RFRkFVTFRTID0ge1xuXHRtYXg6IDEwMCxcblx0bWF4QWdlOiAnMW0nXG59O1xuXG5cbi8qKiBAY2xhc3MgUmVxdWVzdEVhc3lDYWNoZVxuICpcdEBwYXJhbSB7b2JqZWN0fSBbb3B0cz17fV1cbiAqXHRAcGFyYW0ge2Jvb2xlYW59IFtvcHRzLmNhY2hlSHR0cEVycm9ycz10cnVlXVx0Q2FjaGUgNHh4ICYgNXh4IHJlc3BvbnNlcz9cbiAqXHRAcGFyYW0ge29iamVjdH0gW29wdHMuY2FjaGU9e31dXHRcdFx0XHRcdE9wdGlvbnMgZm9yIGBscnUtY2FjaGVgXG4gKlx0QHBhcmFtIHtudW1iZXJ9IFtvcHRzLmNhY2hlLm1heD0xMDBdXHRcdFx0TWF4aW11bSBudW1iZXIgb2YgcmVzcG9uc2VzIHRvIGNhY2hlXG4qXHRAcGFyYW0ge251bWJlcn0gW29wdHMuY2FjaGUubWF4QWdlPScxbSddXHRcdE1heGltdW0gbGVuZ3RoIG9mIHRpbWUgdG8gY29uc2lkZXIgYSBjYWNoZWQgcmVzdWx0IHZhbGlkLlxuKlx0QHBhcmFtIHtvYmplY3R9IFtyZXF1ZXN0XVx0XHRcdFx0XHRcdE9wdGlvbmFsbHkgcGFzcyBhIGByZXF1ZXN0YCBpbnN0YW5jZSBmb3IgREkuXG4gKi9cbmV4cG9ydCBjbGFzcyBDYWNoZWRSZXF1ZXN0IHtcblx0Y29uc3RydWN0b3Iob3B0cz17fSwgcmVxdWVzdD1udWxsKSB7XG5cdFx0dGhpcy5jYWNoZUh0dHBFcnJvcnMgPSBvcHRzLmNhY2hlSHR0cEVycm9ycyE9PWZhbHNlO1xuXHRcdHRoaXMuX3JlcXVlc3QgPSByZXF1ZXN0IHx8IGludGVybmFsUmVxdWVzdDtcblx0XHR0aGlzLmNhY2hlT3B0aW9ucyA9IGV4dGVuZCh7fSwgQ0FDSEVfREVGQVVMVFMpO1xuXHRcdHRoaXMuZW5hYmxlQ2FjaGUob3B0cy5jYWNoZSB8fCB7fSk7XG5cdH1cblxuXHRlbmFibGVDYWNoZShvcHRpb25zPXt9KSB7XG5cdFx0ZXh0ZW5kKHRoaXMuY2FjaGVPcHRpb25zLCBvcHRpb25zKTtcblx0XHRsZXQgb3B0cyA9IGV4dGVuZCh7fSwgdGhpcy5jYWNoZU9wdGlvbnMpO1xuXG5cdFx0Ly8gYWxsb3cgZmFuY3kgdGltZSBzdHJpbmdzIGZvciBtYXhBZ2Vcblx0XHRpZiAodHlwZW9mIG9wdHMubWF4QWdlPT09J3N0cmluZycpIHtcblx0XHRcdG9wdHMubWF4QWdlID0gbXMob3B0cy5tYXhBZ2UpO1xuXHRcdH1cblxuXHRcdHRoaXMuY2FjaGUgPSBuZXcgY2FjaGUob3B0cyk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRyZXF1ZXN0KC4uLmFyZ3MpIHtcblx0XHRsZXQgdXJsLCBvcHRpb25zLCBjYWxsYmFjaztcblx0XHRhcmdzLmZvckVhY2goIGFyZyA9PiB7XG5cdFx0XHRzd2l0Y2ggKHR5cGVvZiBhcmcpIHtcblx0XHRcdFx0Y2FzZSAnc3RyaW5nJzogdXJsID0gYXJnOyBicmVhaztcblx0XHRcdFx0Y2FzZSAnb2JqZWN0Jzogb3B0aW9ucyA9IGFyZzsgYnJlYWs7XG5cdFx0XHRcdGNhc2UgJ2Z1bmN0aW9uJzogY2FsbGJhY2sgPSBhcmc7IGJyZWFrO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dXJsID0gdXJsIHx8IG9wdGlvbnMudXJsIHx8IG9wdGlvbnMudXJpO1xuXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHRcdGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgbm9vcDtcblxuXHRcdGlmICghdXJsKSB0aHJvdyBuZXcgRXJyb3IoJ1JlcXVlc3QgVVJMIGlzIHJlcXVpcmVkLicpO1xuXG5cdFx0aWYgKG9wdGlvbnMubWV0aG9kICYmIFN0cmluZyhvcHRpb25zLm1ldGhvZCkudG9VcHBlckNhc2UoKSE9PSdHRVQnKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fcmVxdWVzdCguLi5hcmdzKTtcblx0XHR9XG5cblx0XHRpZiAob3B0aW9ucy5jYWNoZSE9PWZhbHNlKSB7XG5cdFx0XHRsZXQgY2FjaGVkID0gdGhpcy5fZ2V0Q2FjaGUodXJsLCBvcHRpb25zKTtcblx0XHRcdGlmIChjYWNoZWQpIHtcblx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKG51bGwsIGNhY2hlZC5yZXMsIGNsb25lKGNhY2hlZC5ib2R5KSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGRlbGV0ZSBvcHRpb25zLmNhY2hlO1xuXG5cdFx0dGhpcy5fcmVxdWVzdCh1cmwsIG9wdGlvbnMsIChlcnIsIHJlcywgYm9keSkgPT4ge1xuXHRcdFx0aWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycik7XG5cblx0XHRcdGlmICh0aGlzLmNhY2hlSHR0cEVycm9ycyE9PWZhbHNlIHx8IChyZXMuc3RhdHVzICYmIHJlcy5zdGF0dXM8NDAwKSkge1xuXHRcdFx0XHR0aGlzLl9zZXRDYWNoZSh1cmwsIG9wdGlvbnMsIHsgcmVzLCBib2R5IH0pO1xuXHRcdFx0fVxuXHRcdFx0Y2FsbGJhY2sobnVsbCwgcmVzLCBjbG9uZShib2R5KSk7XG5cdFx0fSk7XG5cdH1cblxuXHRnZXQoLi4uYXJncykge1xuXHRcdHJldHVybiB0aGlzLnJlcXVlc3QoLi4uYXJncyk7XG5cdH1cblxuXHQvLyBmb3Igb2xkIHRpbWUncyBzYWtlXG5cdGNhY2hlZCguLi5hcmdzKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0KC4uLmFyZ3MpO1xuXHR9XG5cblx0ZGVmYXVsdHMob3B0cz17fSkge1xuXHRcdHRoaXMuX3JlcXVlc3QgPSB0aGlzLl9yZXF1ZXN0LmRlZmF1bHRzKG9wdHMpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0X3NldENhY2hlKHVybCwgb3B0aW9ucz17fSwgdmFsdWU9bnVsbCkge1xuXHRcdHRoaXMuY2FjaGUuc2V0KFxuXHRcdFx0Y2FjaGVLZXkodXJsLCBvcHRpb25zKSxcblx0XHRcdHZhbHVlXG5cdFx0KTtcblx0fVxuXG5cdF9nZXRDYWNoZSh1cmwsIG9wdGlvbnM9e30pIHtcblx0XHRyZXR1cm4gdGhpcy5jYWNoZS5nZXQoXG5cdFx0XHRjYWNoZUtleSh1cmwsIG9wdGlvbnMpXG5cdFx0KTtcblx0fVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBDYWNoZWRSZXF1ZXN0KCk7XG5cblxuXG5mdW5jdGlvbiBleHRlbmQoYmFzZSwgLi4uYXJncykge1xuXHRmb3IgKGxldCBpPTA7IGk8YXJncy5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBwcm9wcyA9IGFyZ3NbaV07XG5cdFx0Zm9yIChsZXQgcCBpbiBwcm9wcykge1xuXHRcdFx0aWYgKHByb3BzLmhhc093blByb3BlcnR5KHApKSB7XG5cdFx0XHRcdGJhc2VbcF0gPSBwcm9wc1twXTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIGJhc2U7XG59XG5cbmZ1bmN0aW9uIGNhY2hlS2V5KHVybCwgb3B0aW9ucykge1xuXHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkoeyB1cmwsIG9wdGlvbnMgfSk7XG59XG5cbmZ1bmN0aW9uIGNsb25lKG9iaikge1xuXHRyZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKTtcbn1cblxuZnVuY3Rpb24gbm9vcCgpe31cbiJdfQ==