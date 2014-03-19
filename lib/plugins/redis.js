// Setup:
// npm install redis
// npm install sol-redis-pool
// node examples/redis_example/example.js

var cache_manager = require('cache-manager');
// var redis_store = require('./redis_store');
// var redis_cache = cache_manager.caching({store: redis_store, db: 0, ttl: 100/*seconds*/});


var dem = require('redis').createClient();



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
        this.cache.set(context.request.url, context.response.documentHTML);
        next();
        console.log("lol")
    }
}

var memjs_cache = {
    get: function(key, callback) {
      dem.get(key, function(err, value) {
        var stringValue = value ? value.toString() : null;
        callback(err, stringValue);
      });
    },
    set: function(key, value, callback) {
      dem.set(key, value, callback);
    }
};