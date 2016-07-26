'use strict';

const expect = require('chai').expect;
const OfflineModel = require('../lib/offline-model');

const resetMock = function() {
  return [
    {_id: 1, name: 'Allan Benjamin', address: 'St. Claire Avenue, Nº 101', phone: '557188339933'},
    {_id: 2, name: 'Georgia Smith', address: 'St. Claire Avenue, Nº 102', phone: '557188339933'},
    {_id: 3, name: 'Gregory Levinsky', address: 'St. Claire Avenue, Nº 103', phone: '557188339933'},
    {_id: 4, name: 'Jackeline Macfly', address: 'St. Claire Avenue, Nº 104', phone: '557188339933'},
    {_id: 5, name: 'Joseph Climber', address: 'St. Claire Avenue, Nº 105', phone: '557188339933'},
    {_id: 6, name: 'Joshua Jackson', address: 'St. Claire Avenue, Nº 106', phone: '557188339933'}
  ];
};

describe('Service: OfflineModel', function () {

  // instantiate service
  var myMock;

  var params = {
    key: 'myMock',
    primaryKey: '_id',
    fields: ['_id', 'name', 'address', 'phone']
  };

  describe('OfflineModel: localStorage', function () {

    var MyOfflineModel;

    beforeEach(function () {
      myMock = resetMock();
      MyOfflineModel = OfflineModel.setStorageType('localStorage')
                                        .init(myMock, params);
    });

    afterEach(function () {
      MyOfflineModel.clearAll();
    });

    it('#init', function () {
      expect(MyOfflineModel.getListItems().length).to.be.equal(6);
      expect(MyOfflineModel.getKey()).to.be.equal('myMock');
      expect(MyOfflineModel.getListItems()).to.deep.equal(myMock);
    });

    it('#countTotalItems', function(){
      expect(MyOfflineModel.countTotalItems(myMock)).to.be.equal(7);
    });

    it('#create', function(){
      var contact = {
        name: 'This is a test',
        address: 'Adress test',
        phone: '557188998877'
      };
      expect(MyOfflineModel.create(contact).length).to.be.equal(7);
    });

    it('#update', function(){
      var contact = {
        name: 'This is a test',
        address: 'Adress test',
        phone: '557188998877',
        _id: 1
      };

      expect(MyOfflineModel.update(contact).length).to.be.equal(6);

      expect(myMock[0].name).to.be.equal('Allan Benjamin');
      expect(myMock[0].address).to.be.equal('St. Claire Avenue, Nº 101');
      expect(myMock[0]._id).to.be.equal(1);
      expect(myMock[0].phone).to.be.equal('557188339933');

      var item = MyOfflineModel.getListItems()[0];

      expect(item.name).to.be.equal(contact.name);
      expect(item.address).to.be.equal(contact.address);
      expect(item._id).to.be.equal(contact._id);
      expect(item.phone).to.be.equal(contact.phone);

      expect(item.name !== myMock[0].name).to.be.equal(true);
      expect(item.address !== myMock[0].address).to.be.equal(true);
      expect(item.phone !==myMock[0].phone).to.be.equal(true);
      expect(item._id === myMock[0]._id).to.be.equal(true);
    });

    it('#delete', function(){
      expect(typeof MyOfflineModel.delete(1) === 'object').to.be.equal(true);
      expect(MyOfflineModel.delete(5000)).to.be.equal(false);
    });

    it('_key params validation', function () {
      var key = 'key-verification';
      expect(typeof MyOfflineModel.setKey(key) === 'object').to.be.equal(true);
      expect(MyOfflineModel.getKey()).to.be.equal(key);
    });

    it('_items params validation', function () {
      var listItems = [
        {_id: 6, name: 'Joshua Jackson', address: 'St. Claire Avenue, Nº 106', phone: '557188339933'}
      ];
      expect(typeof MyOfflineModel.setListItems(listItems) === 'object').to.be.equal(true);
      expect(MyOfflineModel.getListItems()).to.be.equal(listItems);
      expect(MyOfflineModel.getListItems().length).to.be.equal(1);
    });

    it('#setFields', function () {
      MyOfflineModel.setFields(['_id', 'name', 'address']);

      var contact = {
        _id: '098340984093',
        name: 'This is a test',
        address: 'Adress test',
        phone: '557188998877',
        country: 'Brazil'
      };
      var listItems = MyOfflineModel.getListItems();
      var listItemsLength = listItems.length;
      var i = 0;

      for ( ; listItemsLength > i; i++) {
        listItems[i] = MyOfflineModel.createValueObject(listItems[i]);
      }

      for ( ; listItemsLength > i; i++) {
        expect(typeof listItems[i].phone === 'undefined').to.be.equal(true);
      }

      MyOfflineModel.setListItems(myMock)
                    .setFields(['_id', 'name', 'address', 'phone']);

      i = 0;
      for ( ; listItemsLength > i; i++) {
        listItems[i] = MyOfflineModel.createValueObject(listItems[i]);
      }

      listItems = MyOfflineModel.create(contact);
      listItemsLength = listItems.length;
      i = 0;
      for ( ; listItemsLength > i; i++) {
        expect(typeof listItems[i].phone !== 'undefined').to.be.equal(true);
      }

    });

    it('#clearAll', function () {
      MyOfflineModel = OfflineModel.setStorageType('localStorage')
                                        .init(myMock, params);

      expect(MyOfflineModel.getListItems().length).to.be.equal(6);

      MyOfflineModel.clearAll();
      expect(MyOfflineModel.getListItems().length).to.be.equal(0);
    });

  });


  describe('OfflineModel: sessionStorage', function () {

    var MyOfflineModel;

    beforeEach(function () {
      myMock = resetMock();
      MyOfflineModel = OfflineModel.setStorageType('sessionStorage')
                                        .init(myMock, params);
    });

    afterEach(function () {
      MyOfflineModel.clearAll();
    });

    it('#init', function () {

      expect(MyOfflineModel.getListItems().length).to.be.equal(6);
      expect(MyOfflineModel.getKey()).to.be.equal('myMock');
      expect(MyOfflineModel.getListItems()).to.deep.equal(myMock);
    });

    it('#countTotalItems', function(){
      expect(MyOfflineModel.countTotalItems(myMock)).to.be.equal(7);
    });

    it('#create', function(){
      var contact = {
        name: 'This is a test',
        address: 'Adress test',
        phone: '557188998877'
      };
      expect(MyOfflineModel.create(contact).length).to.be.equal(7);
    });

    it('#update', function(){
      var contact = {
        name: 'This is a test',
        address: 'Adress test',
        phone: '557188998877',
        _id: 1
      };

      expect(MyOfflineModel.update(contact).length).to.be.equal(6);

      expect(myMock[0].name).to.be.equal('Allan Benjamin');
      expect(myMock[0].address).to.be.equal('St. Claire Avenue, Nº 101');
      expect(myMock[0]._id).to.be.equal(1);
      expect(myMock[0].phone).to.be.equal('557188339933');

      var item = MyOfflineModel.getListItems()[0];

      expect(item.name).to.be.equal(contact.name);
      expect(item.address).to.be.equal(contact.address);
      expect(item._id).to.be.equal(contact._id);
      expect(item.phone).to.be.equal(contact.phone);

      expect(item.name !== myMock[0].name).to.be.equal(true);
      expect(item.address !== myMock[0].address).to.be.equal(true);
      expect(item.phone !==myMock[0].phone).to.be.equal(true);
      expect(item._id === myMock[0]._id).to.be.equal(true);
    });

    it('#delete', function(){
      expect(typeof MyOfflineModel.delete(1) === 'object').to.be.equal(true);
      expect(MyOfflineModel.delete(5000)).to.be.equal(false);
    });

    it('_key params validation', function () {
      var key = 'key-verification';
      expect(typeof MyOfflineModel.setKey(key) === 'object').to.be.equal(true);
      expect(MyOfflineModel.getKey()).to.be.equal(key);
    });

    it('_items params validation', function () {
      var listItems = [
        {_id: 6, name: 'Joshua Jackson', address: 'St. Claire Avenue, Nº 106', phone: '557188339933'}
      ];
      expect(typeof MyOfflineModel.setListItems(listItems) === 'object').to.be.equal(true);
      expect(MyOfflineModel.getListItems()).to.be.equal(listItems);
      expect(MyOfflineModel.getListItems().length).to.be.equal(1);
    });

    it('#setFields', function () {
      MyOfflineModel.setFields(['_id', 'name', 'address']);

      var contact = {
        _id: '098340984093',
        name: 'This is a test',
        address: 'Adress test',
        phone: '557188998877',
        country: 'Brazil'
      };
      var listItems = MyOfflineModel.getListItems();
      var listItemsLength = listItems.length;
      var i = 0;

      for ( ; listItemsLength > i; i++) {
        listItems[i] = MyOfflineModel.createValueObject(listItems[i]);
      }

      for ( ; listItemsLength > i; i++) {
        expect(typeof listItems[i].phone === 'undefined').to.be.equal(true);
      }

      MyOfflineModel.setListItems(myMock)
                    .setFields(['_id', 'name', 'address', 'phone']);

      i = 0;
      for ( ; listItemsLength > i; i++) {
        listItems[i] = MyOfflineModel.createValueObject(listItems[i]);
      }

      listItems = MyOfflineModel.create(contact);
      listItemsLength = listItems.length;
      i = 0;
      for ( ; listItemsLength > i; i++) {
        expect(typeof listItems[i].phone !== 'undefined').to.be.equal(true);
      }

    });

    it('#clearAll', function () {
      expect(MyOfflineModel.getListItems().length).to.be.equal(6);

      MyOfflineModel.clearAll();
      expect(MyOfflineModel.getListItems().length).to.be.equal(0);
    });

  });

});
