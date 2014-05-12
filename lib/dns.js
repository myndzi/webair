'use strict';

var util = require('util');

module.exports = function (parent, Promise) {
    function DNS(obj) {
        parent.call(this);
        
        if (typeof obj === 'number') { obj = { id: number }; }
        this.id = obj.id || this.id;
        
    }
    util.inherits(DNS, parent);
    
    parent.prototype.enableDns = function (orderId) {
        return this.post('dns/activate.json', {
            'order-id': orderId
        });
    };
    parent.prototype.getDnsRecords = function (args) {
        return this.get('dns/manage/search-records.json', {
            'domain-name': args.domain,
            'type': args.type,
            'no-of-records': args.records,
            'page-no': args.page
        });
    };
    parent.prototype.updateIpv4Record = function (args) {
        return this.post('dns/manage/update-ipv4-record.json', {
            'domain-name': args.domain,
            'current-value': args.currentValue,
            'new-value': args.newValue
        });
    };
    parent.prototype.addIpv4Record = function (args) {
        return this.post('dns/manage/add-ipv4-record.json', {
            'domain-name': args.domain,
            'host': args.host,
            'value': args.value
        });
    };
    
    return DNS;
};
