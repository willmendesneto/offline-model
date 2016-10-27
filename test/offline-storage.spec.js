'use strict';

const expect = require('chai').expect;
const OfflineStorage = require('../lib/offline-storage');
const sinon = require('sinon');

describe('Service: OfflineStorage', function () {

  // instantiate service
  var secret,
    storageType,
    key,
    dataString,
    sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    secret = 'secret';
    key = 'key';
    dataString = { testValue: 'test'};
  });

  describe('using "localStorage"', function(){

    beforeEach(function () {
      storageType = 'localStorage';
    });

    describe('init', function(){
      it('service should be initialyzeds with internal variables configurateds', function () {
        OfflineStorage.init({secret: secret, storageType: storageType});

        expect(OfflineStorage.JSON !== null).to.be.equal(true);
        expect(OfflineStorage.storageType).to.be.equal(storageType);
        expect(OfflineStorage.secret !== '').to.be.equal(true);
      });
    });

    describe('encrypt', function(){
      it('should returns a string with informations', function () {
        expect(typeof OfflineStorage.encrypt(dataString) === 'string').to.be.equal(true);
      });
    });

    describe('decrypt', function(){
      it('should returns a json object decrypted', function () {
        var mockedData = Object.assign({}, { data: dataString, expiry: null});
        var decriptedData = OfflineStorage.decrypt(JSON.stringify(mockedData));
        expect(decriptedData).to.have.property('testValue');
        expect(decriptedData).to.not.have.property('expiry');
        expect(decriptedData.testValue).to.be.equal(dataString.testValue);
        expect(decriptedData.expiry).not.to.be.null;
      });

      it('should return null if data is expired', function () {
        var expiredData = { data: dataString };
        expiredData.expiry = new Date();
        expiredData.expiry -= 1000;
        expiredData.expiry = new Date(expiredData.expiry);
        var decriptedData = OfflineStorage.decrypt(JSON.stringify(expiredData));
        expect(decriptedData).to.equal(null);
      });
    });

    describe('set', function(){
      it('should returns "true" when element is setted', function () {
        expect(OfflineStorage.set(key, dataString)).to.be.equal(true);
      });

      it('should returns "false" when second param isn\'t setted', function () {
        expect(OfflineStorage.set(key)).to.be.equal(false);
      });
    });

    describe('get', function(){
      it('should returns the original json object', function () {
        OfflineStorage.set(key, dataString);
        expect(OfflineStorage.get(key)).to.deep.equal(dataString);
      });

      describe('When a data is expired', function() {
        beforeEach(function() {
          sandbox.stub(window.localStorage, 'getItem').returns(JSON.stringify({
            data: [],
            expiry: (new Date(2010, 10, 10)).getTime()
          }));
        });

        afterEach(function() {
          sandbox.restore();
        });

        it('should return null if data is expired', function () {
          expect(OfflineStorage.get(key)).to.equal(null);
        });
      });
    });

    describe('remove', function(){
      it('should returns "true" when element was removed with success', function () {
        OfflineStorage.set(key, dataString);
        expect(OfflineStorage.remove(key)).to.be.equal(true);
      });
    });
  });

  describe('using "sessionStorage"', function(){

    beforeEach(function () {
      storageType = 'sessionStorage';
    });

    describe('init', function(){
      it('service should be initialyzeds with internal variables configurateds', function () {
        OfflineStorage.init({secret: secret, storageType: storageType});

        expect(OfflineStorage.JSON !== null).to.be.equal(true);
        expect(OfflineStorage.storageType).to.be.equal(storageType);
        expect(OfflineStorage.secret !== '').to.be.equal(true);
      });
    });

    describe('encrypt', function(){
      it('should returns a string with informations', function () {
        expect(typeof OfflineStorage.encrypt(dataString) === 'string').to.be.equal(true);
      });
    });

    describe('decrypt', function(){
      it('should returns a json object decrypted', function () {
        var mockedData = Object.assign({}, { data: dataString, expiry: null});
        var decriptedData = OfflineStorage.decrypt(JSON.stringify(mockedData));
        expect(decriptedData).to.have.property('testValue');
        expect(decriptedData).to.not.have.property('expiry');
        expect(decriptedData.testValue).to.be.equal(dataString.testValue);
        expect(decriptedData.expiry).not.to.be.null;
      });

      it('should return null if data is expired', function () {
        var expiredData = { data: dataString };
        expiredData.expiry = new Date();
        expiredData.expiry -= 1000;
        expiredData.expiry = new Date(expiredData.expiry);
        var decriptedData = OfflineStorage.decrypt(JSON.stringify(expiredData));
        expect(decriptedData).to.equal(null);
      });
    });

    describe('set', function(){
      it('should returns "true" when element is setted', function () {
        expect(OfflineStorage.set(key, dataString)).to.be.equal(true);
      });

      it('should returns "false" when second param isn\'t setted', function () {
        expect(OfflineStorage.set(key)).to.be.equal(false);
      });
    });

    describe('get', function(){
      it('should returns the original json object', function () {
        OfflineStorage.set(key, dataString);
        expect(OfflineStorage.get(key)).to.deep.equal(dataString);
      });

      describe('When a data is expired', function() {
        beforeEach(function() {
          sandbox.stub(window.sessionStorage, 'getItem').returns(JSON.stringify({
            data: [],
            expiry: (new Date(2010, 10, 10)).getTime()
          }));
        });

        afterEach(function() {
          sandbox.restore();
        });

        it('should return null if data is expired', function () {
          expect(OfflineStorage.get(key)).to.equal(null);
        });
      });
    });

    describe('remove', function(){
      it('should returns "true" when element was removed with success', function () {
        OfflineStorage.set(key, dataString);
        expect(OfflineStorage.remove(key)).to.be.equal(true);
      });
    });

    describe('clearAll', function(){
      it('should remove all items with success', function () {
        OfflineStorage.set(key, dataString);
        expect(OfflineStorage.clearAll()).to.be.equal(true);
        expect(OfflineStorage.get(key)).to.be.equal(null);
      });
    });
  });
});
