# Offline Model

> Your module for Offline operations with Javascript

[![Build Status](https://travis-ci.org/willmendesneto/offline-model.png?branch=master)](https://travis-ci.org/willmendesneto/offline-model)
[![Build Windows Status](https://ci.appveyor.com/api/projects/status/github/willmendesneto/offline-model?svg=true)](https://ci.appveyor.com/project/willmendesneto/offline-model/branch/master)
[![Coverage Status](https://coveralls.io/repos/willmendesneto/offline-model/badge.svg?branch=master)](https://coveralls.io/r/willmendesneto/offline-model?branch=master)

## Installation

1 - Via NPM

```bash
$ npm install offline-model
```

2 - Via bower

```bash
$ bower install offline-model
```

3 - Clone this repository and access the generated folder

```bash
$ git clone git://github.com/willmendesneto/offline-model [project-name]
$ cd [project-name]
```
Once you have OfflineModel in your project, just include as a dependency in your application and you’re good to go. It's works!

```javascript
    var myModule = OfflineModel;
```

## Methods and attributes

### attributes

- primaryKey: Primary Key that will be used for OfflineModel. This value will be unique;
- fields: Fields for mapp in OfflineModel. Only these chosen fields will be stored for the service;
- key: Key used for store locally (localStorage and sessionStorage are stored key value based);
- secret: Secret key for store;

### Methods

- init: service contructor;
- createValueObject: Create the ValueObject of item for add/edit/list, based in `fields` attribute;
- setStorageType: set/update storageType (localStorage/sessionStorage);
- setKey: Set the storageType key for store in browser, based in key => value;
- getKey: Return the key used in this moment for OfflineModel instance;
- setListItems: Add default/first list items for store in storageType selected;
- getListItems: Return list items stored locally in browser;
- setFields: Set fields that OfflineModel will be map for store;
- countTotalItems: Return the count of totalItems, based in Primary Key;
- create: Create new item in list items stored locally;
- update: Update item stored locally in list items;
- delete: Remove item stored locally;
- clearAll: Clear all items stored locally, based in storageType;

## Example

```javascript
var contactMock = [
  {_id: 1, name: 'Allan Benjamin', address: 'St. Claire Avenue, Nº 101', phone: '557188339933'},
  {_id: 2, name: 'Georgia Smith', address: 'St. Claire Avenue, Nº 102', phone: '557188339933'},
  {_id: 3, name: 'Gregory Levinsky', address: 'St. Claire Avenue, Nº 103', phone: '557188339933'},
  {_id: 4, name: 'Jackeline Macfly', address: 'St. Claire Avenue, Nº 104', phone: '557188339933'},
  {_id: 5, name: 'Joseph Climber', address: 'St. Claire Avenue, Nº 105', phone: '557188339933'},
  {_id: 6, name: 'Joshua Jackson', address: 'St. Claire Avenue, Nº 106', phone: '557188339933'}
];

var params = {
  // localStorage/sessionStorage key
  key: 'contactMock',
  // primary field. This field will be increased automatically
  primaryKey: '_id',
  // Fields mapped for store
  fields: ['_id', 'name', 'address', 'phone'],
  // you can add new methods via params too
  myMethod: function() {
    console.log('My method is working!');
  }
};

var ContactModel = OfflineModel.setStorageType('localStorage')
                                  .init(contactMock, params);

// return contactMock value;
ContactModel.getListItems();
// return 'contactMock';
ContactModel.getKey();
// === contactMock.length;
ContactModel.countTotalItems(contactMock);

// Create an item
var contact = {
  name: 'This is a test',
  address: 'Adress test',
  phone: '557188998877'
};
ContactModel.create(contact);

// Update the item
contact = {
  phone: '559554138698',
  // This field is verified based in `primaryKey` attribute value
  _id: 7
};

ContactModel.update(contact);

// Removing the item
ContactModel.delete(7);

// Removing all items of storage
ContactModel.clearAll();
```

## Author

**Wilson Mendes (willmendesneto)**
+ <https://plus.google.com/+WilsonMendes>
+ <https://twitter.com/willmendesneto>
+ <http://github.com/willmendesneto>


New features comming soon.
