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

	CachedRequest.prototype.get = function get() {
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
//# sourceMappingURL=data:application/json;base64,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YSxXQTRFekIsU0FBUyxHQUFBLG1CQUFDLEdBQUcsRUFBYztNQUFaLE9BQU8seURBQUMsRUFBRTs7QUFDeEIsU0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FDcEIsUUFBUSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FDdEIsQ0FBQztFQUNGOztRQWhGVyxhQUFhOzs7O3FCQW9GWCxJQUFJLGFBQWEsRUFBRTs7QUFJbEMsU0FBUyxNQUFNLENBQUMsSUFBSSxFQUFXO29DQUFOLElBQUk7QUFBSixNQUFJOzs7QUFDNUIsTUFBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDakMsTUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLE9BQUssSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFO0FBQ3BCLE9BQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUM1QixRQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25CO0dBQ0Q7RUFDRDtBQUNELFFBQU8sSUFBSSxDQUFDO0NBQ1o7O0FBRUQsU0FBUyxRQUFRLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRTtBQUMvQixRQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLEVBQUgsR0FBRyxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsQ0FBQyxDQUFDO0NBQ3hDOztBQUVELFNBQVMsS0FBSyxDQUFDLEdBQUcsRUFBRTtBQUNuQixRQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0NBQ3ZDOztBQUVELFNBQVMsSUFBSSxHQUFFLEVBQUUiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaW50ZXJuYWxSZXF1ZXN0IGZyb20gJ3JlcXVlc3QnO1xuaW1wb3J0IGNhY2hlIGZyb20gJ2xydS1jYWNoZSc7XG5pbXBvcnQgbXMgZnJvbSAnbXMnO1xuXG5jb25zdCBDQUNIRV9ERUZBVUxUUyA9IHtcblx0bWF4OiAxMDAsXG5cdG1heEFnZTogJzFtJ1xufTtcblxuXG4vKiogQGNsYXNzIFJlcXVlc3RFYXN5Q2FjaGVcbiAqXHRAcGFyYW0ge29iamVjdH0gW29wdHM9e31dXG4gKlx0QHBhcmFtIHtib29sZWFufSBbb3B0cy5jYWNoZUh0dHBFcnJvcnM9dHJ1ZV1cdENhY2hlIDR4eCAmIDV4eCByZXNwb25zZXM/XG4gKlx0QHBhcmFtIHtvYmplY3R9IFtvcHRzLmNhY2hlPXt9XVx0XHRcdFx0XHRPcHRpb25zIGZvciBgbHJ1LWNhY2hlYFxuICpcdEBwYXJhbSB7bnVtYmVyfSBbb3B0cy5jYWNoZS5tYXg9MTAwXVx0XHRcdE1heGltdW0gbnVtYmVyIG9mIHJlc3BvbnNlcyB0byBjYWNoZVxuKlx0QHBhcmFtIHtudW1iZXJ9IFtvcHRzLmNhY2hlLm1heEFnZT0nMW0nXVx0XHRNYXhpbXVtIGxlbmd0aCBvZiB0aW1lIHRvIGNvbnNpZGVyIGEgY2FjaGVkIHJlc3VsdCB2YWxpZC5cbipcdEBwYXJhbSB7b2JqZWN0fSBbcmVxdWVzdF1cdFx0XHRcdFx0XHRPcHRpb25hbGx5IHBhc3MgYSBgcmVxdWVzdGAgaW5zdGFuY2UgZm9yIERJLlxuICovXG5leHBvcnQgY2xhc3MgQ2FjaGVkUmVxdWVzdCB7XG5cdGNvbnN0cnVjdG9yKG9wdHM9e30sIHJlcXVlc3Q9bnVsbCkge1xuXHRcdHRoaXMuY2FjaGVIdHRwRXJyb3JzID0gb3B0cy5jYWNoZUh0dHBFcnJvcnMhPT1mYWxzZTtcblx0XHR0aGlzLl9yZXF1ZXN0ID0gcmVxdWVzdCB8fCBpbnRlcm5hbFJlcXVlc3Q7XG5cdFx0dGhpcy5jYWNoZU9wdGlvbnMgPSBleHRlbmQoe30sIENBQ0hFX0RFRkFVTFRTKTtcblx0XHR0aGlzLmVuYWJsZUNhY2hlKG9wdHMuY2FjaGUgfHwge30pO1xuXHR9XG5cblx0ZW5hYmxlQ2FjaGUob3B0aW9ucz17fSkge1xuXHRcdGV4dGVuZCh0aGlzLmNhY2hlT3B0aW9ucywgb3B0aW9ucyk7XG5cdFx0bGV0IG9wdHMgPSBleHRlbmQoe30sIHRoaXMuY2FjaGVPcHRpb25zKTtcblxuXHRcdC8vIGFsbG93IGZhbmN5IHRpbWUgc3RyaW5ncyBmb3IgbWF4QWdlXG5cdFx0aWYgKHR5cGVvZiBvcHRzLm1heEFnZT09PSdzdHJpbmcnKSB7XG5cdFx0XHRvcHRzLm1heEFnZSA9IG1zKG9wdHMubWF4QWdlKTtcblx0XHR9XG5cblx0XHR0aGlzLmNhY2hlID0gbmV3IGNhY2hlKG9wdHMpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0Z2V0KC4uLmFyZ3MpIHtcblx0XHRsZXQgdXJsLCBvcHRpb25zLCBjYWxsYmFjaztcblx0XHRhcmdzLmZvckVhY2goIGFyZyA9PiB7XG5cdFx0XHRzd2l0Y2ggKHR5cGVvZiBhcmcpIHtcblx0XHRcdFx0Y2FzZSAnc3RyaW5nJzogdXJsID0gYXJnOyBicmVhaztcblx0XHRcdFx0Y2FzZSAnb2JqZWN0Jzogb3B0aW9ucyA9IGFyZzsgYnJlYWs7XG5cdFx0XHRcdGNhc2UgJ2Z1bmN0aW9uJzogY2FsbGJhY2sgPSBhcmc7IGJyZWFrO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dXJsID0gdXJsIHx8IG9wdGlvbnMudXJsIHx8IG9wdGlvbnMudXJpO1xuXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHRcdGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgbm9vcDtcblxuXHRcdGlmICghdXJsKSB0aHJvdyBuZXcgRXJyb3IoJ1JlcXVlc3QgVVJMIGlzIHJlcXVpcmVkLicpO1xuXG5cdFx0aWYgKG9wdGlvbnMubWV0aG9kICYmIFN0cmluZyhvcHRpb25zLm1ldGhvZCkudG9VcHBlckNhc2UoKSE9PSdHRVQnKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fcmVxdWVzdCguLi5hcmdzKTtcblx0XHR9XG5cblx0XHRpZiAob3B0aW9ucy5jYWNoZSE9PWZhbHNlKSB7XG5cdFx0XHRsZXQgY2FjaGVkID0gdGhpcy5fZ2V0Q2FjaGUodXJsLCBvcHRpb25zKTtcblx0XHRcdGlmIChjYWNoZWQpIHtcblx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKG51bGwsIGNhY2hlZC5yZXMsIGNsb25lKGNhY2hlZC5ib2R5KSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGRlbGV0ZSBvcHRpb25zLmNhY2hlO1xuXG5cdFx0dGhpcy5fcmVxdWVzdCh1cmwsIG9wdGlvbnMsIChlcnIsIHJlcywgYm9keSkgPT4ge1xuXHRcdFx0aWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycik7XG5cblx0XHRcdGlmICh0aGlzLmNhY2hlSHR0cEVycm9ycyE9PWZhbHNlIHx8IChyZXMuc3RhdHVzICYmIHJlcy5zdGF0dXM8NDAwKSkge1xuXHRcdFx0XHR0aGlzLl9zZXRDYWNoZSh1cmwsIG9wdGlvbnMsIHsgcmVzLCBib2R5IH0pO1xuXHRcdFx0fVxuXHRcdFx0Y2FsbGJhY2sobnVsbCwgcmVzLCBjbG9uZShib2R5KSk7XG5cdFx0fSk7XG5cdH1cblxuXHQvLyBmb3Igb2xkIHRpbWUncyBzYWtlXG5cdGNhY2hlZCguLi5hcmdzKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0KC4uLmFyZ3MpO1xuXHR9XG5cblx0ZGVmYXVsdHMob3B0cz17fSkge1xuXHRcdHRoaXMuX3JlcXVlc3QgPSB0aGlzLl9yZXF1ZXN0LmRlZmF1bHRzKG9wdHMpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0X3NldENhY2hlKHVybCwgb3B0aW9ucz17fSwgdmFsdWU9bnVsbCkge1xuXHRcdHRoaXMuY2FjaGUuc2V0KFxuXHRcdFx0Y2FjaGVLZXkodXJsLCBvcHRpb25zKSxcblx0XHRcdHZhbHVlXG5cdFx0KTtcblx0fVxuXG5cdF9nZXRDYWNoZSh1cmwsIG9wdGlvbnM9e30pIHtcblx0XHRyZXR1cm4gdGhpcy5jYWNoZS5nZXQoXG5cdFx0XHRjYWNoZUtleSh1cmwsIG9wdGlvbnMpXG5cdFx0KTtcblx0fVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBDYWNoZWRSZXF1ZXN0KCk7XG5cblxuXG5mdW5jdGlvbiBleHRlbmQoYmFzZSwgLi4uYXJncykge1xuXHRmb3IgKGxldCBpPTA7IGk8YXJncy5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBwcm9wcyA9IGFyZ3NbaV07XG5cdFx0Zm9yIChsZXQgcCBpbiBwcm9wcykge1xuXHRcdFx0aWYgKHByb3BzLmhhc093blByb3BlcnR5KHApKSB7XG5cdFx0XHRcdGJhc2VbcF0gPSBwcm9wc1twXTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIGJhc2U7XG59XG5cbmZ1bmN0aW9uIGNhY2hlS2V5KHVybCwgb3B0aW9ucykge1xuXHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkoeyB1cmwsIG9wdGlvbnMgfSk7XG59XG5cbmZ1bmN0aW9uIGNsb25lKG9iaikge1xuXHRyZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKTtcbn1cblxuZnVuY3Rpb24gbm9vcCgpe31cbiJdfQ==