'use strict';

var util = require('util');

module.exports = function (parent, Promise) {
    function Domain(obj) {
        parent.call(this);
        
        if (typeof obj === 'number') { obj = { id: number }; }
        this.id = obj.id || this.id;
        
    }
    util.inherits(Domain, parent);
    
    parent.prototype.checkAvailability = function (args) {
        return this.get('domains/available.json', {
            'domain-name': args.domains || [args.domain],
            'tlds': args.tlds || this.tlds
        });
    };
    parent.prototype.getSuggestions = function (args) {
        return this.get('domains/suggest-names.json', {
            'keyword': args.keyword || args.keywords.join(' '),
            'tlds': args.tlds || this.tlds,
            'no-of-results': args.results || 5,
            'hyphen-allowed': args.allowHyphen !== void 0 ? args.allowHyphen : true,
            'add-related': args.addRelated !== void 0 ? args.addRelated : true
        });
    };
    parent.prototype.registerDomain = function (args) {
        return this.post('domains/register.json', {
            'domain-name': args.domain,
            'years': args.years,
            'ns': args.nameServers,
            'customer-id': args.customerId,
            'reg-contact-id': args.regContactId,
            'admin-contact-id': args.adminContactId,
            'tech-contact-id': args.techContactId,
            'billing-contact-id': args.billingContactId,
            'invoice-option': 'NoInvoice',
            'protect-privacy': 'true'
        });
    };
    parent.prototype.skipVerification = function (orderId) {
        return this.post('domains/raa/skip-verification.json', {
            'order-id': orderId
        });
    };
    parent.prototype.getAllOrderInfo = function (orderId) {
        return this.get('domains/details.json', {
            'order-id': orderId,
            'options': 'All'
        });
    };
    parent.prototype.getOrderStatus = function (orderId) {
        return this.get('domains/details.json', {
            'order-id': orderId,
            'options': 'OrderDetails'
        });
    };
    parent.prototype.getDomainStatus = function (orderId) {
        return this.get('domains/details.json', {
            'order-id': orderId,
            'options': 'DomainStatus'
        });
    };
    parent.prototype.getDomainStatusByDomain = function (domain) {
        return this.get('domains/details-by-name.json', {
            'domain-name': domain,
            'options': 'DomainStatus'
        });
    };
    
    return Domain;
};

/*
{ actiontypedesc: 'Registration of bitchez.net for 1 year',
  entityid: '54223925',
  actionstatus: 'InvoicePaid',
  status: 'InvoicePaid',
  eaqid: '244790550',
  error: 'Order Locked for Processing, Please contact Support',
  description: 'bitchez.net',
  actiontype: 'AddNewDomain',
  actionstatusdesc: 'Order Locked In Processing.' }
*/
