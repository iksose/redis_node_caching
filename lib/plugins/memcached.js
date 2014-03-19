
var cache_manager = require('cache-manager', {retries:10,retry:10000});
// var redis_store = require('./redis_store');


var Memcached = require('memcached');
var memcached = new Memcached('localhost:11211');


module.exports = {
    init: function() {
        this.cache = cache_manager.caching({
            store: memjs_cache, max: 100, ttl: 60/*seconds*/
        });
    },

    beforePhantomRequest: function(req, res, next) {
        console.log("Phantom?", req.prerender.url)
        this.cache.get(req.prerender.url, function (err, result) {
            if (!err && result) {
                res.send(200, result);
                console.log("Result? ", err, result)
            } else {
                next();
            }
        });
    },

    afterPhantomRequest: function(phantom, context, next) {
        this.cache.set(context.request.url, context.response.documentHTML, 100);
        next();
    }
}

var memjs_cache = {
    get: function(key, callback) {
      memcached.get(key, function(err, value) {
        var stringValue = value ? value.toString() : null;
        callback(err, stringValue);
      });
    },
    set: function(key, value, lifetime, callback) {
      memcached.set(key, value, lifetime, callback);
    }
};