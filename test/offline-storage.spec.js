'use strict';

const expect = require('chai').expect;
const OfflineStorage = require('../lib/offline-storage');
const sinon = require('sinon');

['localStorage', 'sessionStorage'].forEach(function(webStorage) {
  describe('Service: OfflineStorage', function () {

    beforeEach(function () {
      this.sandbox = sinon.sandbox.create();
      this.secret = 'secret';
      this.key = 'key';
      this.dataString = { testValue: 'test' };
    });

    describe('using "' + webStorage + '"', function(){

      beforeEach(function () {
        this.storageType = webStorage;
      });

      describe('When the service is initialised', function(){
        beforeEach(function() {
          OfflineStorage.init({secret: this.secret, storageType: this.storageType});
        });

        it('should be configured with internal information', function () {
          expect(OfflineStorage.storageType).to.be.equal(this.storageType);
          expect(OfflineStorage.secret).to.be.equal(this.secret);
        });
      });

      describe('When the data is encrypted', function(){
        it('should returns a string with informations', function () {
          expect(typeof OfflineStorage.encrypt(this.dataString)).to.be.equal('string');
        });
      });

      describe('When the data is decrypted', function(){
        beforeEach(function() {
          const mockedData = Object.assign({}, { data: this.dataString, expiry: null});
          this.decriptedData = OfflineStorage.decrypt(JSON.stringify(mockedData));
        });

        it('should returns a json object decrypted', function () {
          expect(this.decriptedData).to.have.property('testValue');
          expect(this.decriptedData).to.not.have.property('expiry');
          expect(this.decriptedData.testValue).to.be.equal(this.dataString.testValue);
          expect(this.decriptedData.expiry).not.to.be.null;
        });

        describe('When the data is expired', function() {
          beforeEach(function() {
            let expiredData = { data: this.dataString };
            expiredData.expiry = new Date();
            expiredData.expiry -= 1000;
            expiredData.expiry = new Date(expiredData.expiry);
            this.decriptedData = OfflineStorage.decrypt(JSON.stringify(expiredData));
          });

          it('should return null if data is expired', function () {
            expect(this.decriptedData).to.equal(null);
          });
        });
      });

      describe('When a data is added', function(){
        it('should returns "true" when element is setted', function () {
          expect(OfflineStorage.set(this.key, this.dataString)).to.be.equal(true);
        });

        it('should returns "false" when second param isn\'t setted', function () {
          expect(OfflineStorage.set(this.key)).to.be.equal(false);
        });

        describe('When a data is expired', function() {
          beforeEach(function() {
            this.webStorageSpy = this.sandbox.spy(window[webStorage], 'setItem');
            this.encriptedDataMock = JSON.stringify({
              data: this.dataString,
              expiry: 10
            });
            this.sandbox.stub(OfflineStorage, 'encrypt').returns(this.encriptedDataMock);
            OfflineStorage.set(this.key, this.dataString, 10);
          });

          afterEach(function() {
            this.sandbox.restore();
          });

          it('should add expiry information in ' + webStorage, function() {
            expect(this.webStorageSpy.calledWith(this.key, this.encriptedDataMock)).to.equal(true);
          });
        });
      });

      describe('When an added data is required', function(){
        beforeEach(function() {
          OfflineStorage.set(this.key, this.dataString);
        });

        it('should returns the original json object', function () {
          expect(OfflineStorage.get(this.key)).to.deep.equal(this.dataString);
        });

        describe('When a data is expired', function() {
          beforeEach(function() {
            this.sandbox.stub(window[webStorage], 'getItem').returns(JSON.stringify({
              data: [],
              expiry: (new Date(2010, 10, 10)).getTime()
            }));
          });

          afterEach(function() {
            this.sandbox.restore();
          });

          it('should return null', function () {
            expect(OfflineStorage.get(this.key)).to.equal(null);
          });
        });
      });

      describe('When a data is removed', function(){
        it('should returns "true" if the element was removed with success', function () {
          OfflineStorage.set(this.key, this.dataString);
          expect(OfflineStorage.remove(this.key)).to.be.equal(true);
        });
      });
    });
  });
});
