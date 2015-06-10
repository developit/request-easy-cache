'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _lruCache = require('lru-cache');

var _lruCache2 = _interopRequireDefault(_lruCache);

var CACHE_DEFAULTS = {
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

var CachedRequest = (function () {
  function CachedRequest() {
    var opts = arguments[0] === undefined ? {} : arguments[0];
    var request = arguments[1] === undefined ? global.request : arguments[1];

    _classCallCheck(this, CachedRequest);

    this.cacheHttpErrors = opts.cacheHttpErrors !== false;
    this._request = request;
    this.cacheOptions = extend({}, CACHE_DEFAULTS, opts.cache || {});
    this.cache = new _lruCache2['default'](this.cacheOptions);
  }

  CachedRequest.prototype.enableCache = function enableCache() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    extend(this.cacheOptions, options);
    this.cache = new _lruCache2['default'](this.cacheOptions);
    return this;
  };

  CachedRequest.prototype.get = function get() {
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
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return this.get.apply(this, args);
  };

  CachedRequest.prototype.defaults = function defaults() {
    var opts = arguments[0] === undefined ? {} : arguments[0];

    this._request = _request2['default'].defaults(opts);
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
  for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
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
//# sourceMappingURL=data:application/json;base64,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QUMsR0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3BDLFFBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLFNBQUssSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFO0FBQzFCLFVBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUM1QixZQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ25CO0tBQ0Q7R0FDRDtBQUNFLFNBQU8sSUFBSSxDQUFDO0NBQ2Y7O0FBRUQsU0FBUyxRQUFRLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRTtBQUMvQixTQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLEVBQUgsR0FBRyxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsQ0FBQyxDQUFDO0NBQ3hDOztBQUVELFNBQVMsS0FBSyxDQUFDLEdBQUcsRUFBRTtBQUNoQixTQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0NBQzFDOztBQUVELFNBQVMsSUFBSSxHQUFFLEVBQUUiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcmVxdWVzdCBmcm9tICdyZXF1ZXN0JztcbmltcG9ydCBjYWNoZSBmcm9tICdscnUtY2FjaGUnO1xuXG5jb25zdCBDQUNIRV9ERUZBVUxUUyA9IHtcblx0bWF4OiAxMDAsXG5cdG1heEFnZTogNjAwMDBcbn07XG5cblxuLyoqIEBjbGFzcyBSZXF1ZXN0RWFzeUNhY2hlXG4gKlx0QHBhcmFtIHtvYmplY3R9IFtvcHRzPXt9XVxuICpcdEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMuY2FjaGVIdHRwRXJyb3JzPXRydWVdXHRDYWNoZSA0eHggJiA1eHggcmVzcG9uc2VzP1xuICpcdEBwYXJhbSB7b2JqZWN0fSBbb3B0cy5jYWNoZT17fV1cdFx0XHRcdFx0T3B0aW9ucyBmb3IgYGxydS1jYWNoZWBcbiAqXHRAcGFyYW0ge251bWJlcn0gW29wdHMuY2FjaGUubWF4PTEwMF1cdFx0XHRNYXhpbXVtIG51bWJlciBvZiByZXNwb25zZXMgdG8gY2FjaGVcbipcdEBwYXJhbSB7bnVtYmVyfSBbb3B0cy5jYWNoZS5tYXhBZ2U9NjAwMDBdXHRcdE1heGltdW0gbGVuZ3RoIG9mIHRpbWUgdG8gY29uc2lkZXIgYSBjYWNoZWQgcmVzdWx0IHZhbGlkIChkZWZhdWx0OiA2MHMpXG4qXHRAcGFyYW0ge29iamVjdH0gW3JlcXVlc3Q9Z2xvYmFsLnJlcXVlc3RdXHRcdE9wdGlvbmFsbHkgcGFzcyBhIGByZXF1ZXN0YCBpbnN0YW5jZSBmb3IgREkuXG4gKi9cbmV4cG9ydCBjbGFzcyBDYWNoZWRSZXF1ZXN0IHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzPXt9LCByZXF1ZXN0PWdsb2JhbC5yZXF1ZXN0KSB7XG5cdFx0dGhpcy5jYWNoZUh0dHBFcnJvcnMgPSBvcHRzLmNhY2hlSHR0cEVycm9ycyE9PWZhbHNlO1xuICAgICAgICB0aGlzLl9yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgICAgICAgdGhpcy5jYWNoZU9wdGlvbnMgPSBleHRlbmQoe30sIENBQ0hFX0RFRkFVTFRTLCBvcHRzLmNhY2hlIHx8IHt9KTtcbiAgICBcdHRoaXMuY2FjaGUgPSBuZXcgY2FjaGUodGhpcy5jYWNoZU9wdGlvbnMpO1xuICAgIH1cblxuICAgIGVuYWJsZUNhY2hlKG9wdGlvbnM9e30pIHtcbiAgICAgICAgZXh0ZW5kKHRoaXMuY2FjaGVPcHRpb25zLCBvcHRpb25zKTtcbiAgICBcdHRoaXMuY2FjaGUgPSBuZXcgY2FjaGUodGhpcy5jYWNoZU9wdGlvbnMpO1xuICAgIFx0cmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0KC4uLmFyZ3MpIHtcbiAgICBcdGxldCB1cmwsIG9wdGlvbnMsIGNhbGxiYWNrO1xuICAgICAgICBhcmdzLmZvckVhY2goIGFyZyA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGVvZiBhcmcpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdzdHJpbmcnOiB1cmwgPSBhcmc7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ29iamVjdCc6IG9wdGlvbnMgPSBhcmc7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2Z1bmN0aW9uJzogY2FsbGJhY2sgPSBhcmc7IGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB1cmwgPSB1cmwgfHwgb3B0aW9ucy51cmwgfHwgb3B0aW9ucy51cmk7XG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgbm9vcDtcblxuICAgIFx0aWYgKCF1cmwpIHRocm93IG5ldyBFcnJvcignUmVxdWVzdCBVUkwgaXMgcmVxdWlyZWQuJyk7XG5cblx0XHRpZiAob3B0aW9ucy5jYWNoZSE9PWZhbHNlKSB7XG5cdCAgICBcdGxldCBjYWNoZWQgPSB0aGlzLl9nZXRDYWNoZSh1cmwsIG9wdGlvbnMpO1xuXHQgICAgXHRpZiAoY2FjaGVkKSB7XG5cdFx0XHRcdHJldHVybiBjYWxsYmFjayhudWxsLCBjYWNoZWQucmVzLCBjbG9uZShjYWNoZWQuYm9keSkpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRkZWxldGUgb3B0aW9ucy5jYWNoZTtcblxuICAgIFx0dGhpcy5fcmVxdWVzdCh1cmwsIG9wdGlvbnMsIChlcnIsIHJlcywgYm9keSkgPT4ge1xuICAgIFx0XHRpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKTtcblxuXHRcdFx0aWYgKHRoaXMuY2FjaGVIdHRwRXJyb3JzIT09ZmFsc2UgfHwgKHJlcy5zdGF0dXMgJiYgcmVzLnN0YXR1czw0MDApKSB7XG5cdCAgICBcdFx0dGhpcy5fc2V0Q2FjaGUodXJsLCBvcHRpb25zLCB7IHJlcywgYm9keSB9KTtcblx0XHRcdH1cbiAgICBcdFx0Y2FsbGJhY2sobnVsbCwgcmVzLCBjbG9uZShib2R5KSk7XG4gICAgXHR9KTtcbiAgICB9XG5cblx0Ly8gZm9yIG9sZCB0aW1lJ3Mgc2FrZVxuXHRjYWNoZWQoLi4uYXJncykge1xuXHRcdHJldHVybiB0aGlzLmdldCguLi5hcmdzKTtcblx0fVxuXG4gICAgZGVmYXVsdHMob3B0cz17fSkge1xuICAgIFx0dGhpcy5fcmVxdWVzdCA9IHJlcXVlc3QuZGVmYXVsdHMob3B0cyk7XG4gICAgXHRyZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBfc2V0Q2FjaGUodXJsLCBvcHRpb25zPXt9LCB2YWx1ZT1udWxsKSB7XG4gICAgXHR0aGlzLmNhY2hlLnNldChcbiAgICAgICAgICAgIGNhY2hlS2V5KHVybCwgb3B0aW9ucyksXG4gICAgICAgICAgICB2YWx1ZVxuICAgICAgICApO1xuICAgIH1cblxuICAgIF9nZXRDYWNoZSh1cmwsIG9wdGlvbnM9e30pIHtcbiAgICBcdHJldHVybiB0aGlzLmNhY2hlLmdldChcbiAgICAgICAgICAgIGNhY2hlS2V5KHVybCwgb3B0aW9ucylcbiAgICAgICAgKTtcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgbmV3IENhY2hlZFJlcXVlc3QoKTtcblxuXG5cbmZ1bmN0aW9uIGV4dGVuZChiYXNlLCAuLi5hcmdzKSB7XG4gICAgZm9yIChsZXQgaT0wOyBpPGFyZ3MubGVuZ3RoOyBpKyspIHtcblx0XHRsZXQgcHJvcHMgPSBhcmdzW2ldO1xuICAgICAgICBmb3IgKGxldCBwIGluIHByb3BzKSB7XG5cdFx0XHRpZiAocHJvcHMuaGFzT3duUHJvcGVydHkocCkpIHtcblx0XHRcdFx0YmFzZVtwXSA9IHByb3BzW3BdO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuICAgIHJldHVybiBiYXNlO1xufVxuXG5mdW5jdGlvbiBjYWNoZUtleSh1cmwsIG9wdGlvbnMpIHtcblx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KHsgdXJsLCBvcHRpb25zIH0pO1xufVxuXG5mdW5jdGlvbiBjbG9uZShvYmopIHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKTtcbn1cblxuZnVuY3Rpb24gbm9vcCgpe31cbiJdfQ==