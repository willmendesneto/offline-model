/* globals window */
const jsdom = require('jsdom');
const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;

global.document = doc;
global.window = win;
var _keys = [];

window.localStorage = window.sessionStorage = {
  getItem: function (key) {
    _keys.push(key);
    return this[key];
  },
  setItem: function (key, value) {
    this[key] = value;
  },
  removeItem: function(key) {
    this[key] = null;
  },
  clear: function() {
    var self = this;
    _keys.forEach(function(key){
      self[key] = null;
    });
  }
};

Object.keys(window).forEach((key) => {
  if (!(key in global)) {
    global[key] = window[key];
  }
});
