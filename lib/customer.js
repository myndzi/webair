'use strict';

var util = require('util');

module.exports = function (parent, Promise) {
    function Customer(obj) {
        parent.call(this);
        
        if (typeof obj === 'number') { obj = { id: number }; }
        this.id = obj.id || this.id;
    }
    util.inherits(Customer, parent);
    
    parent.prototype.getCustomerById = function (customerId) {
        return this.get('customers/details-by-id.json', {
            'customer-id': customerId
        });
    };
    parent.prototype.getCustomerByUsername = function (username) {
        return this.get('customers/details.json', {
            'username': username
        });
    };
    
    parent.prototype.deleteCustomer = function (customerId) {
        return this.get('customers/delete.json', {
            'customer-id': customerId
        });
    };
    parent.prototype.createCustomer = function (args) {
        return this.post('customers/signup.json', {
            'username': args.username,
            'passwd': args.password,
            'name': args.name,
            'company': args.company,
            'address-line-1': args.address,
            'city': args.city,
            'state': args.state,
            'country': args.country,
            'zipcode': args.zipcode,
            'phone-cc': args.phoneCc,
            'phone': args.phone,
            'lang-pref': args.langPref
        });
    };
    
    return Customer;
};
