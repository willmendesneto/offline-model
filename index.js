(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module !== "undefined" && module.exports) {
    // CommonJS/Node module
    module.exports = factory();
  } else {
    // Browser globals
    root.OfflineModel = factory();
  }
}(this, function () {
"use strict";/* globals JSON, window */

/**
 * Provide a service for Crypt/Decrypt offline storage (localStorage/sessionStorage) data in application
 * @class OfflineStorage
 * @module services
 * @main OfflineStorage
 * @class OfflineStorage
 * @static
 */
var OfflineStorage = {
  /**
   * Application secret key string
   * @property secret
   * @type {String}
   */
  secret : '',

  /**
   * Type of offline storage (localStorage/sessionStorage)
   * @type {String}
   */
  storageType : 'localStorage',

  /**
   * Initialyze service
   * @param  {String} secret Application secret key value
   * @method init
   */
  init: function(opts){
    Object.assign(this, opts);
  },

  /**
   * Encrypt object values
   * @param  {Object} object Object for encrypt
   * @param  {String} secret Secret key for encrypt
   * @return {String}        String with encrypted values
   * @method encrypt
   */
  encrypt: function(object) {
    var message = JSON.stringify(object);
    return message;
  },

  /**
   * Decrypt object values
   * @param  {Object} object Object for decrypt
   * @param  {String} secret Secret key for encrypt
   * @return {String}           Decrypted string
   * @method decrypt
   */
  decrypt: function(encrypted) {
    var decrypted = JSON.parse(encrypted);
    var expiredDate = new Date(decrypted.expiry);
    return !decrypted.expiry || expiredDate.getTime() >= Date.now() ? decrypted.data : null;
  },

  /**
   * Get element values in offline storage (localStorage/sessionStorage)
   * @param  {String} secret Secret key for encrypt
   * @return {String}           Decrypted string
   * @method get
   */
  get: function(key) {
    var encrypted = window[this.storageType].getItem(key);
    return encrypted && this.decrypt(encrypted);
  },

  /**
   * Set element values in offline storage (localStorage/sessionStorage)
   * @param  {String} secret Secret key for encrypt
   * @param  {Object} object Object for encrypt
   * @return {Boolean}
   * @method set
   */
  set: function(key, object, expiryInMiliseconds) {
    if (!object) {
      this.remove(key);
      return false;
    }
    var expiry = null;

    if (expiryInMiliseconds) {
      var dateObj = Date.now();
      dateObj += expiryInMiliseconds;
      expiry = (new Date(dateObj)).getTime();
    }

    var storedData = {
      data: object,
      expiry: expiry
    };

    var encrypted = this.encrypt(storedData);
    window[this.storageType].setItem(key, encrypted);
    return true;
  },

  /**
   * Remove element of offline storage (localStorage/sessionStorage)
   * @param  {String} secret Secret key for element
   * @return {Boolean}
   * @method remove
   */
  remove: function(key) {
    window[this.storageType].removeItem(key);
    return true;
  },

  /**
   * Remove all elements element of offline storage (localStorage/sessionStorage)
   * @return {Boolean}
   * @method clearAll
   */
  clearAll: function() {
    window[this.storageType].clear();
    return true;
  }
};



const maxListItems = function (input, elementKey) {
  return input.map(function(item) {
    return item[elementKey];
  }).reduce(function(previous, current) {
    return Math.max( previous, current );
  }, 0);
};

var _items = null;
var _storageType = 'localStorage';

var OfflineModel = {

  primaryKey: '_id',
  fields: null,
  key: null,
  secret: 'my-awesome-key',
  expiry: null,
  init: function init(_items, params) {
    params = params || {};
    Object.assign(this, params);

    OfflineStorage.storageType = _storageType;
    OfflineStorage.init({secret: this.secret});
    var _itemsCached = OfflineStorage.get(this.key);

    if(Array.isArray(_itemsCached)) {
      _items = _itemsCached;
    }

    if (Array.isArray(this.fields)){
      _items = this.createValueObjects(_items);
    }

    OfflineStorage.set(this.key, _items, this.expiry);

    this.setListItems(_items);

    //  Extend params for create a factory in service
    return this;
  },
  createValueObjects: function(items) {
    var self = this;
    items = items.map(function(item) {
      return self.createValueObject(item);
    });
    return items;
  },
  createValueObject: function(item) {
    var obj = {};
    this.fields.forEach(function( field ) {
      obj[field] = item[field] || '';
    });
    return obj;
  },
  setStorageType: function(storageType) {
    _storageType = storageType;
    return this;
  },
  setKey: function(key){
    this.key = key;
    return this;
  },
  getKey: function(){
    return this.key;
  },
  setListItems: function(items){
    _items = items;
    return this;
  },
  getListItems: function(){
    var listItems = _items;

    if (this.expiry) {
      listItems = OfflineStorage.get(this.key);
    }

    if (!listItems) {
      OfflineStorage.remove(this.key);
    }

    return listItems;
  },
  setFields: function(fields){
    this.fields = fields;
    return this;
  },
  countTotalItems: function(items) {
    return (maxListItems(items, this.primaryKey)) + 1;
  },
  create: function (item) {
    item = this.createValueObject(item);
    item[this.primaryKey] = this.countTotalItems(_items);
    _items.push(item);
    OfflineStorage.set(this.key, _items, this.expiry);
    return _items;
  },
  update: function (item) {
    var self = this;
    _items = _items.map( function (element) {
      if ( element[self.primaryKey] === item[self.primaryKey]){
        element = self.createValueObject(item);
      }
      return element;
    });
    OfflineStorage.set(this.key, _items, this.expiry);
    return _items;
  },
  delete: function(index) {
    var db = this.getListItems();
    var self = this;
    var firstItem = db.filter( function (element) {
      return element[self.primaryKey] === index;
    })[0];

    if (!firstItem) {
      return !!firstItem;
    }

    db = db.filter( function (element) {
      return element[self.primaryKey] !== firstItem[self.primaryKey];
    });

    this.setListItems(db);
    OfflineStorage.set(this.key, db, this.expiry);
    return firstItem;
  },
  clearAll: function() {
    _items = [];
    return OfflineStorage.clearAll();
  }
};
return OfflineModel;
}));