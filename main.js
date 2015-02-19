var redis = require('redis'),
    workerFarm = require('worker-farm'),
    _ = require('lodash'),
    events = require('events'),
    http = require('http'),
    listener = redis.createClient(),
    broadcaster = redis.createClient(),
    initialized = false,
    workers = {}, callbacks = {};

var beygir = {
    start: function(config) {
        if(initialized) {
            throw new Error();
        }
        _.forEach(config, function(item, name){
            if(item.pattern) {
                listener.psubscribe(name);
            }
            else {
                listener.subscribe(name);
            }
            workers[name] = workerFarm(item.options, item.worker);
            callbacks[name] = _.isFunction(item.callback) ? item.callback : function(err){if(err) console.log(err.message);};
        });

        listener.on('message', function(channel, message){
            if(_.isFunction(workers[channel])) {
                workers[channel](JSON.parse(message), channel, callbacks[channel]);
            }
        });
        listener.on('pmessage', function(pattern, channel, message){
            if(_.isFunction(workers[pattern])) {
                workers[pattern](JSON.parse(message), channel, callbacks[pattern]);
            }
        });

        initialized = true;
        return initialized;
    },
    end: function(name){
        if(name && workers.hasOwnProperty(name)) {
            workerFarm.end(workers[name]);
            return;
        }
        else {
            _.forOwn(workers, function(worker) {
                workerFarm.end(worker);
            });
            workers = {}; callbacks = {};
            listener.removeAllListeners('message');
            listener.removeAllListeners('pmessage');
            initialized = false;
        }
    },
    createServer: function(config) {
        if(initialized === false)
            beygir.start(config);
        setInterval(function() {}, 3000);
    },
    enqueue: function(name, message) {
        broadcaster.publish(name, JSON.stringify(message));
    },
    trigger: function(name, message) {
        if(name && workers.hasOwnProperty(name)) {
            workers[name](message, name, callbacks[name]);
        }
    }
};

module.exports = beygir;