'use strict';

var util = require('util');

module.exports = function (parent, Promise) {
    function Contact(obj) {
        parent.call(this);
        
        if (typeof obj === 'number') { obj = { id: number }; }
        this.id = obj.id || this.id;
        
    }
    util.inherits(Contact, parent);
    
    parent.prototype.createContact = function (args) {
        return this.post('contacts/add.json', {
            'name': args.name,
            'company': args.company,
            'email': args.email,
            'address-line-1': args.address,
            'city': args.city,
            'country': args.country,
            'zipcode': args.zipcode,
            'phone-cc': args.phoneCc,
            'phone': args.phone,
            'customer-id': args.customerId,
            'type': 'Contact'
        });
    };
    
    return Contact;
};
