'use strict';

var expect = require('chai').expect;
var dispatcher = require('dispatchr');

var BasicStore = require('../fixtures/BasicStore');
var RegularStore = require('../fixtures/RegularStore');
var PrivatesStore = require('../fixtures/PrivatesStore');

var stores = [
  BasicStore,
  RegularStore,
  PrivatesStore
];

beforeEach(function () {
  this.dispatcher = dispatcher.createDispatcher({ stores: stores });
  this.dispatcherContext = this.dispatcher.createContext({});
});

describe('A store defining its own accessor functions', function () {
  it('should not have any accessors defined on its prototype', function () {
    expect(BasicStore.prototype.accessors).to.equal(undefined);
  });

  it('should mutate its internal state in response to a dispatch', function () {
    var store = this.dispatcherContext.getStore(BasicStore);
    expect(store.number).to.equal(50);
    this.dispatcherContext.dispatch('TRIGGER', 100);
    expect(store.number).to.equal(100);
  });

  it('should not allow set access to that internal state', function () {
    var store = this.dispatcherContext.getStore(BasicStore);
    var num = store.number;
    expect(
      function () {
        store.number = 250;
      }).to.throw(TypeError);
    expect(store.number).to.equal(num);
  });
});

describe('A store not using accessors', function () {
  it('should not have any accessors defined on its prototype', function () {
    expect(RegularStore.prototype.accessors).to.equal(undefined);
  });

  it('should mutate its internal state in response to a dispatch', function () {
    var store = this.dispatcherContext.getStore(RegularStore);
    expect(store.number).to.equal(50);
    this.dispatcherContext.dispatch('TRIGGER', 100);
    expect(store.number).to.equal(100);
  });

  it('should allow set access to that internal state', function () {
    var store = this.dispatcherContext.getStore(RegularStore);
    store.number = 250;
    expect(store.number).to.equal(250);
  });
});

describe('A store using the `privates` feature', function () {
  it('should not have any accessors defined on its prototype', function () {
    expect(PrivatesStore.prototype.accessors).to.equal(undefined);
  });

  it('should mutate its internal state in response to a dispatch', function () {
    var store = this.dispatcherContext.getStore(PrivatesStore);
    expect(store.number).to.equal(50);
    this.dispatcherContext.dispatch('TRIGGER', 100);
    expect(store.number).to.equal(100);
  });

  it('should not allow set access to that internal state', function () {
    var store = this.dispatcherContext.getStore(PrivatesStore);
    var num = store.number;
    expect(
      function () {
        store.number = 250;
      }).to.throw(TypeError);
    expect(store.number).to.equal(num);
  });
});
