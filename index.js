'use strict';

var extend = require('jquery-extend'),
    request = require('request'),
    Promise = require('bluebird'),
    Logger = require('logger');

module.exports = function WebAir(config, logger) {
    var log = logger || new Logger('WebAir', 'silly');

    function Client() {
        this.url = config.url;
        this.apiKey = config.apiKey;
        this.userId = config.resellerId;
        this.customerId = config.customerId;
        this.apiRate = config.apiRate || 1000;
        this.tlds = config.tlds || [];
        this.id = void 0;
    }
    ['Domain', 'Contact', 'Customer', 'DNS'].forEach(function (type) {
        Client.prototype[type] = require('./lib/'+type.toLowerCase())(Client, Promise);
    });

    Client.prototype.makeQueryString = function (args, prefix) {
        log.trace('makeQueryString', args);
        var qs = [], kn = '';
        for (var key in args) {
            
            if (prefix) { kn = prefix + '[' + encodeURIComponent(key) + ']'; }
            else { kn = key; }
            
            if (!args.hasOwnProperty(key)) continue;
            if (args[key] === void 0) continue;
            
            if (args[key].toString() === '[object Object]') {
                qs.push(this.makeQueryString(args[key], kn));
            } else if (Array.isArray(args[key])) {
                args[key].forEach(function (val) {
                    qs.push(kn + '=' + encodeURIComponent(val));
                });
            } else if (typeof args[key] === 'boolean') {
                qs.push(kn + '=' + (args[key] ? 'true' : 'false'));
            } else {
                qs.push(kn + '=' + encodeURIComponent(args[key]));
            }
            
        }
        return qs.join('&');
    };
    Client.prototype.get = function (path, args) { return this.apiRequest(path, args, 'GET'); };
    Client.prototype.post = function (path, args) { return this.apiRequest(path, args, 'POST'); };
    Client.prototype.apiRequest = function (path, args, method) {
        if (path.indexOf('?') > -1) { assert.notEqual(this.id, void 0); }
        
        var url = this.url + path.replace('?', this.id);
        var qs = this.makeQueryString(extend({ }, {
            'auth-userid': this.userId,
            'api-key': this.apiKey
        }, args));
        
        if (qs !== '') { url += '?' + qs; }

        log.silly('Request: ', { url: url, method: method });
        var promise = new Promise(function (resolve, reject) {
            request({ url: url, method: method }, function (err, res, body) {
                if (err) {
                    reject(new Error(err));
                } else {
                    try { body = JSON.parse(body); }
                    catch (e) {
                        log.warn(e, body);
                        return reject(new Error('Failed to convert JSON'));
                    }
                    
                    if (body.status && body.status.toUpperCase() === 'ERROR') { reject(new Error(body.message || body.error || body)); }
                    else { resolve(body); }
                }
            });
        });
        promise.apiRequest = this.apiRequest.bind(this);
        return promise;
    }
    
    return new Client();
};
