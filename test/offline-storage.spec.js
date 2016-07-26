'use strict';

const expect = require('chai').expect;
const OfflineStorage = require('../lib/offline-storage');

describe('Service: OfflineStorage', function () {

  // instantiate service
  var secret,
    storageType,
    key,
    dataString;

  beforeEach(function () {
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
        expect(OfflineStorage.decrypt(JSON.stringify(dataString))).to.deep.equal(dataString);
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
        expect(OfflineStorage.decrypt(JSON.stringify(dataString))).to.deep.equal(dataString);
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
