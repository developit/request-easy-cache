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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmVzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O3VCQUE0QixTQUFTOzs7O3dCQUNuQixXQUFXOzs7O2tCQUNkLElBQUk7Ozs7QUFFbkIsSUFBTSxjQUFjLEdBQUc7QUFDdEIsS0FBRyxFQUFFLEdBQUc7QUFDUixRQUFNLEVBQUUsSUFBSTtDQUNaLENBQUM7Ozs7Ozs7Ozs7O0lBV1csYUFBYTtBQUNYLFdBREYsYUFBYSxHQUNhO1FBQXZCLElBQUksZ0NBQUMsRUFBRTtRQUFFLE9BQU8sZ0NBQUMsSUFBSTs7MEJBRHhCLGFBQWE7O0FBRXhCLFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsS0FBRyxLQUFLLENBQUM7QUFDOUMsUUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLHdCQUFtQixDQUFDO0FBQzNDLFFBQUksQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLEVBQUUsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUNyRCxRQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLENBQUM7R0FDaEM7O0FBTlEsZUFBYSxXQVF0QixXQUFXLEdBQUEsdUJBQWE7UUFBWixPQUFPLGdDQUFDLEVBQUU7O0FBQ2xCLFVBQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3pDLFFBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDOzs7QUFHekMsUUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUcsUUFBUSxFQUFFO0FBQ2xDLFVBQUksQ0FBQyxNQUFNLEdBQUcscUJBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzlCOztBQUVFLFFBQUksQ0FBQyxLQUFLLEdBQUcsMEJBQVUsSUFBSSxDQUFDLENBQUM7QUFDN0IsV0FBTyxJQUFJLENBQUM7R0FDWjs7QUFuQlEsZUFBYSxXQXFCdEIsR0FBRyxHQUFBLGVBQVU7OztzQ0FBTixJQUFJO0FBQUosVUFBSTs7O0FBQ1YsUUFBSSxHQUFHLFlBQUE7UUFBRSxPQUFPLFlBQUE7UUFBRSxRQUFRLFlBQUEsQ0FBQztBQUN4QixRQUFJLENBQUMsT0FBTyxDQUFFLFVBQUEsR0FBRyxFQUFJO0FBQ2pCLGNBQVEsT0FBTyxHQUFHO0FBQ2QsYUFBSyxRQUFRO0FBQUUsYUFBRyxHQUFHLEdBQUcsQ0FBQyxBQUFDLE1BQU07QUFBQSxBQUNoQyxhQUFLLFFBQVE7QUFBRSxpQkFBTyxHQUFHLEdBQUcsQ0FBQyxBQUFDLE1BQU07QUFBQSxBQUNwQyxhQUFLLFVBQVU7QUFBRSxrQkFBUSxHQUFHLEdBQUcsQ0FBQyxBQUFDLE1BQU07QUFBQSxPQUMxQztLQUNKLENBQUMsQ0FBQzs7QUFFSCxPQUFHLEdBQUcsR0FBRyxJQUFJLE9BQU8sQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUM5QyxXQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztBQUNsQixZQUFRLEdBQUcsUUFBUSxJQUFJLElBQUksQ0FBQzs7QUFFL0IsUUFBSSxDQUFDLEdBQUcsRUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7O0FBRXpELFFBQUksT0FBTyxDQUFDLEtBQUssS0FBRyxLQUFLLEVBQUU7QUFDdkIsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDMUMsVUFBSSxNQUFNLEVBQUU7QUFDZCxlQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7T0FDdEQ7S0FDRDtBQUNELFdBQU8sT0FBTyxDQUFDLEtBQUssQ0FBQzs7QUFFbEIsUUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLFVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUs7QUFDL0MsVUFBSSxHQUFHLEVBQUUsT0FBTyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRWpDLFVBQUksTUFBSyxlQUFlLEtBQUcsS0FBSyxJQUFLLEdBQUcsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBQyxHQUFHLEFBQUMsRUFBRTtBQUNoRSxjQUFLLFNBQVMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRyxFQUFILEdBQUcsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLENBQUMsQ0FBQztPQUMvQztBQUNFLGNBQVEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQ2pDLENBQUMsQ0FBQztHQUNIOzs7O0FBckRRLGVBQWEsV0F3RHpCLE1BQU0sR0FBQSxrQkFBVTt1Q0FBTixJQUFJO0FBQUosVUFBSTs7O0FBQ2IsV0FBTyxJQUFJLENBQUMsR0FBRyxNQUFBLENBQVIsSUFBSSxFQUFRLElBQUksQ0FBQyxDQUFDO0dBQ3pCOztBQTFEVyxlQUFhLFdBNER0QixRQUFRLEdBQUEsb0JBQVU7UUFBVCxJQUFJLGdDQUFDLEVBQUU7O0FBQ2YsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QyxXQUFPLElBQUksQ0FBQztHQUNaOztBQS9EUSxlQUFhLFdBaUV0QixTQUFTLEdBQUEsbUJBQUMsR0FBRyxFQUEwQjtRQUF4QixPQUFPLGdDQUFDLEVBQUU7UUFBRSxLQUFLLGdDQUFDLElBQUk7O0FBQ3BDLFFBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUNQLFFBQVEsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEVBQ3RCLEtBQUssQ0FDUixDQUFDO0dBQ0w7O0FBdEVRLGVBQWEsV0F3RXRCLFNBQVMsR0FBQSxtQkFBQyxHQUFHLEVBQWM7UUFBWixPQUFPLGdDQUFDLEVBQUU7O0FBQ3hCLFdBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQ2QsUUFBUSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FDekIsQ0FBQztHQUNMOztTQTVFUSxhQUFhOzs7UUFBYixhQUFhLEdBQWIsYUFBYTtxQkFnRlgsSUFBSSxhQUFhLEVBQUU7O0FBSWxDLFNBQVMsTUFBTSxDQUFDLElBQUksRUFBVztxQ0FBTixJQUFJO0FBQUosUUFBSTs7O0FBQ3pCLE9BQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3BDLFFBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLFNBQUssSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFO0FBQzFCLFVBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUM1QixZQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ25CO0tBQ0Q7R0FDRDtBQUNFLFNBQU8sSUFBSSxDQUFDO0NBQ2Y7O0FBRUQsU0FBUyxRQUFRLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRTtBQUMvQixTQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLEVBQUgsR0FBRyxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsQ0FBQyxDQUFDO0NBQ3hDOztBQUVELFNBQVMsS0FBSyxDQUFDLEdBQUcsRUFBRTtBQUNoQixTQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0NBQzFDOztBQUVELFNBQVMsSUFBSSxHQUFFLEVBQUUiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaW50ZXJuYWxSZXF1ZXN0IGZyb20gJ3JlcXVlc3QnO1xuaW1wb3J0IGNhY2hlIGZyb20gJ2xydS1jYWNoZSc7XG5pbXBvcnQgbXMgZnJvbSAnbXMnO1xuXG5jb25zdCBDQUNIRV9ERUZBVUxUUyA9IHtcblx0bWF4OiAxMDAsXG5cdG1heEFnZTogJzFtJ1xufTtcblxuXG4vKiogQGNsYXNzIFJlcXVlc3RFYXN5Q2FjaGVcbiAqXHRAcGFyYW0ge29iamVjdH0gW29wdHM9e31dXG4gKlx0QHBhcmFtIHtib29sZWFufSBbb3B0cy5jYWNoZUh0dHBFcnJvcnM9dHJ1ZV1cdENhY2hlIDR4eCAmIDV4eCByZXNwb25zZXM/XG4gKlx0QHBhcmFtIHtvYmplY3R9IFtvcHRzLmNhY2hlPXt9XVx0XHRcdFx0XHRPcHRpb25zIGZvciBgbHJ1LWNhY2hlYFxuICpcdEBwYXJhbSB7bnVtYmVyfSBbb3B0cy5jYWNoZS5tYXg9MTAwXVx0XHRcdE1heGltdW0gbnVtYmVyIG9mIHJlc3BvbnNlcyB0byBjYWNoZVxuKlx0QHBhcmFtIHtudW1iZXJ9IFtvcHRzLmNhY2hlLm1heEFnZT0nMW0nXVx0XHRNYXhpbXVtIGxlbmd0aCBvZiB0aW1lIHRvIGNvbnNpZGVyIGEgY2FjaGVkIHJlc3VsdCB2YWxpZC5cbipcdEBwYXJhbSB7b2JqZWN0fSBbcmVxdWVzdF1cdFx0XHRcdFx0XHRPcHRpb25hbGx5IHBhc3MgYSBgcmVxdWVzdGAgaW5zdGFuY2UgZm9yIERJLlxuICovXG5leHBvcnQgY2xhc3MgQ2FjaGVkUmVxdWVzdCB7XG4gICAgY29uc3RydWN0b3Iob3B0cz17fSwgcmVxdWVzdD1udWxsKSB7XG5cdFx0dGhpcy5jYWNoZUh0dHBFcnJvcnMgPSBvcHRzLmNhY2hlSHR0cEVycm9ycyE9PWZhbHNlO1xuICAgICAgICB0aGlzLl9yZXF1ZXN0ID0gcmVxdWVzdCB8fCBpbnRlcm5hbFJlcXVlc3Q7XG4gICAgICAgIHRoaXMuY2FjaGVPcHRpb25zID0gZXh0ZW5kKHt9LCBDQUNIRV9ERUZBVUxUUyk7XG5cdFx0dGhpcy5lbmFibGVDYWNoZShvcHRzLmNhY2hlIHx8IHt9KTtcbiAgICB9XG5cbiAgICBlbmFibGVDYWNoZShvcHRpb25zPXt9KSB7XG4gICAgICAgIGV4dGVuZCh0aGlzLmNhY2hlT3B0aW9ucywgb3B0aW9ucyk7XG5cdFx0bGV0IG9wdHMgPSBleHRlbmQoe30sIHRoaXMuY2FjaGVPcHRpb25zKTtcblxuXHRcdC8vIGFsbG93IGZhbmN5IHRpbWUgc3RyaW5ncyBmb3IgbWF4QWdlXG5cdFx0aWYgKHR5cGVvZiBvcHRzLm1heEFnZT09PSdzdHJpbmcnKSB7XG5cdFx0XHRvcHRzLm1heEFnZSA9IG1zKG9wdHMubWF4QWdlKTtcblx0XHR9XG5cbiAgICBcdHRoaXMuY2FjaGUgPSBuZXcgY2FjaGUob3B0cyk7XG4gICAgXHRyZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBnZXQoLi4uYXJncykge1xuICAgIFx0bGV0IHVybCwgb3B0aW9ucywgY2FsbGJhY2s7XG4gICAgICAgIGFyZ3MuZm9yRWFjaCggYXJnID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAodHlwZW9mIGFyZykge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3N0cmluZyc6IHVybCA9IGFyZzsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnb2JqZWN0Jzogb3B0aW9ucyA9IGFyZzsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnZnVuY3Rpb24nOiBjYWxsYmFjayA9IGFyZzsgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHVybCA9IHVybCB8fCBvcHRpb25zLnVybCB8fCBvcHRpb25zLnVyaTtcblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBub29wO1xuXG4gICAgXHRpZiAoIXVybCkgdGhyb3cgbmV3IEVycm9yKCdSZXF1ZXN0IFVSTCBpcyByZXF1aXJlZC4nKTtcblxuXHRcdGlmIChvcHRpb25zLmNhY2hlIT09ZmFsc2UpIHtcblx0ICAgIFx0bGV0IGNhY2hlZCA9IHRoaXMuX2dldENhY2hlKHVybCwgb3B0aW9ucyk7XG5cdCAgICBcdGlmIChjYWNoZWQpIHtcblx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKG51bGwsIGNhY2hlZC5yZXMsIGNsb25lKGNhY2hlZC5ib2R5KSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGRlbGV0ZSBvcHRpb25zLmNhY2hlO1xuXG4gICAgXHR0aGlzLl9yZXF1ZXN0KHVybCwgb3B0aW9ucywgKGVyciwgcmVzLCBib2R5KSA9PiB7XG4gICAgXHRcdGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpO1xuXG5cdFx0XHRpZiAodGhpcy5jYWNoZUh0dHBFcnJvcnMhPT1mYWxzZSB8fCAocmVzLnN0YXR1cyAmJiByZXMuc3RhdHVzPDQwMCkpIHtcblx0ICAgIFx0XHR0aGlzLl9zZXRDYWNoZSh1cmwsIG9wdGlvbnMsIHsgcmVzLCBib2R5IH0pO1xuXHRcdFx0fVxuICAgIFx0XHRjYWxsYmFjayhudWxsLCByZXMsIGNsb25lKGJvZHkpKTtcbiAgICBcdH0pO1xuICAgIH1cblxuXHQvLyBmb3Igb2xkIHRpbWUncyBzYWtlXG5cdGNhY2hlZCguLi5hcmdzKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0KC4uLmFyZ3MpO1xuXHR9XG5cbiAgICBkZWZhdWx0cyhvcHRzPXt9KSB7XG4gICAgXHR0aGlzLl9yZXF1ZXN0ID0gdGhpcy5fcmVxdWVzdC5kZWZhdWx0cyhvcHRzKTtcbiAgICBcdHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIF9zZXRDYWNoZSh1cmwsIG9wdGlvbnM9e30sIHZhbHVlPW51bGwpIHtcbiAgICBcdHRoaXMuY2FjaGUuc2V0KFxuICAgICAgICAgICAgY2FjaGVLZXkodXJsLCBvcHRpb25zKSxcbiAgICAgICAgICAgIHZhbHVlXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgX2dldENhY2hlKHVybCwgb3B0aW9ucz17fSkge1xuICAgIFx0cmV0dXJuIHRoaXMuY2FjaGUuZ2V0KFxuICAgICAgICAgICAgY2FjaGVLZXkodXJsLCBvcHRpb25zKVxuICAgICAgICApO1xuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBuZXcgQ2FjaGVkUmVxdWVzdCgpO1xuXG5cblxuZnVuY3Rpb24gZXh0ZW5kKGJhc2UsIC4uLmFyZ3MpIHtcbiAgICBmb3IgKGxldCBpPTA7IGk8YXJncy5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBwcm9wcyA9IGFyZ3NbaV07XG4gICAgICAgIGZvciAobGV0IHAgaW4gcHJvcHMpIHtcblx0XHRcdGlmIChwcm9wcy5oYXNPd25Qcm9wZXJ0eShwKSkge1xuXHRcdFx0XHRiYXNlW3BdID0gcHJvcHNbcF07XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG4gICAgcmV0dXJuIGJhc2U7XG59XG5cbmZ1bmN0aW9uIGNhY2hlS2V5KHVybCwgb3B0aW9ucykge1xuXHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkoeyB1cmwsIG9wdGlvbnMgfSk7XG59XG5cbmZ1bmN0aW9uIGNsb25lKG9iaikge1xuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpO1xufVxuXG5mdW5jdGlvbiBub29wKCl7fVxuIl19