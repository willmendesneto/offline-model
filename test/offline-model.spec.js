'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const OfflineModel = require('../lib/offline-model');

var resetMock = function() {
  return [
    {_id: 1, name: 'Allan Benjamin', address: 'St. Claire Avenue, Nº 101', phone: '557188339933'},
    {_id: 2, name: 'Georgia Smith', address: 'St. Claire Avenue, Nº 102', phone: '557188339933'},
    {_id: 3, name: 'Gregory Levinsky', address: 'St. Claire Avenue, Nº 103', phone: '557188339933'},
    {_id: 4, name: 'Jackeline Macfly', address: 'St. Claire Avenue, Nº 104', phone: '557188339933'},
    {_id: 5, name: 'Joseph Climber', address: 'St. Claire Avenue, Nº 105', phone: '557188339933'},
    {_id: 6, name: 'Joshua Jackson', address: 'St. Claire Avenue, Nº 106', phone: '557188339933'}
  ];
};

['localStorage', 'sessionStorage'].forEach(function(webStorage) {

  describe('Service: OfflineModel', function () {

    // instantiate service
    var myMock = [];
    var params = {};
    var MyOfflineModel;
    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
      params = {
        key: 'myMock',
        primaryKey: '_id',
        expiry: null,
        fields: ['_id', 'name', 'address', 'phone']
      };
      myMock = resetMock();
    });

    describe('OfflineModel: ' + webStorage, function () {
      describe('When the component is initializes', function() {
        beforeEach(function () {
          MyOfflineModel = OfflineModel.setStorageType(webStorage)
                                            .init(myMock, params);
        });

        afterEach(function () {
          MyOfflineModel.clearAll();
        });

        it('should add all default items in the list', function() {
          expect(MyOfflineModel.getListItems().length).to.be.equal(6);
        });

        it('should store data based in the given key', function() {
          expect(MyOfflineModel.getKey()).to.be.equal('myMock');
        });

        it('should return the default data', function() {
          expect(MyOfflineModel.getListItems()).to.deep.equal(myMock);
        });

        it('should return the total number of items', function(){
          expect(MyOfflineModel.countTotalItems(myMock)).to.be.equal(7);
        });

        describe('When the default key is changed', function() {
          beforeEach(function() {
            MyOfflineModel.setKey('another-key');
          });

          it('should return the new key added', function() {
            expect(MyOfflineModel.getKey()).to.be.equal('another-key');
          });
        });

        describe('When a new data is created', function(){
          beforeEach(function() {
            this.contact = {
              name: 'This is a test',
              address: 'Adress test',
              phone: '557188998877'
            };
          });

          it('should return the total numbers of items in the list', function() {
            expect(MyOfflineModel.create(this.contact).length).to.be.equal(7);
          });
        });

        describe('When a old data is updated', function(){
          beforeEach(function() {
            this.contact = {
              name: 'This is a test',
              address: 'Adress test',
              phone: '557188998877',
              _id: 1
            };
            MyOfflineModel.update(this.contact);
          });

          it('should return the same quantity of items in the list', function() {
            expect(MyOfflineModel.countTotalItems(myMock)).to.be.equal(7);
          });

          describe('When the updated data is requested', function() {
            beforeEach(function() {
              this.item = MyOfflineModel.getListItems()[0];
            });

            it('should return the updated information', function() {
              expect(this.item.name).to.be.equal(this.contact.name);
              expect(this.item.address).to.be.equal(this.contact.address);
              expect(this.item._id).to.be.equal(this.contact._id);
              expect(this.item.phone).to.be.equal(this.contact.phone);
            });
          });
        });

        describe('When a data is removed', function() {
          it('should return the removed information', function() {
            expect(typeof MyOfflineModel.delete(1) === 'object').to.be.equal(true);
          });

          it('should return false if index does NOT exist', function() {
            expect(MyOfflineModel.delete(5000)).to.be.equal(false);
          });
        });

        it('When a new `key` value is setted', function () {
          beforeEach(function() {
            this.key = 'key-verification';
          });

          it('should return the new key information', function() {
            expect(MyOfflineModel.getKey()).to.be.equal(this.key);
          });
        });

        describe('When the required fields for create a value object are setted', function () {
          beforeEach(function() {
            MyOfflineModel.setFields(['_id', 'name', 'address']);
            this.contact = {
              _id: '098340984093',
              name: 'This is a test',
              address: 'Adress test',
              phone: '557188998877',
              country: 'Brazil'
            };
            this.valueObject = MyOfflineModel.createValueObject(this.contact);
          });

          it('should restore ONLY the required fields', function() {
            expect(this.valueObject).to.have.keys('_id', 'name', 'address');
          });
        });

        it('When clear store is required', function () {
          beforeEach(function() {
            MyOfflineModel.clearAll();
          });

          it('should return an empty list of items', function() {
            expect(MyOfflineModel.getListItems().length).to.be.equal(0);
          });
        });

        describe('When an expired data is requested', function() {
          beforeEach(function() {
            MyOfflineModel.expiry = 10;
            sandbox.stub(window[webStorage], 'getItem').returns(JSON.stringify({
              data: [],
              expiry: (new Date(2010, 10, 10)).getTime()
            }));
          });

          afterEach(function() {
            sandbox.restore();
          });

          it('should return null', function() {
            expect(MyOfflineModel.getListItems()).to.be.null;
          });
        });
      });
    });
  });
});
