'use strict';

const OfflineStorage = require('./offline-storage');

const maxListItems = function (input, elementKey) {
  return input.map(function(item) {
    return item[elementKey];
  }).reduce(function(previous, current) {
    return Math.max( previous, current );
  }, 0);
};

var _items = null;
var _storageType = 'localStorage';

module.exports = {

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
