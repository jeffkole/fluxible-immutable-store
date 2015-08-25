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

  it('should not conflict with other instances of itself', function () {
    var dispatcherA = dispatcher.createDispatcher({ stores: stores });
    var dispatcherContextA = dispatcherA.createContext({});
    var dispatcherB = dispatcher.createDispatcher({ stores: stores });
    var dispatcherContextB = dispatcherB.createContext({});

    var storeA = dispatcherContextA.getStore(BasicStore);
    var storeB = dispatcherContextB.getStore(BasicStore);

    expect(storeA.number).to.equal(50);
    expect(storeB.number).to.equal(50);
    dispatcherContextA.dispatch('TRIGGER', 100);
    expect(storeA.number).to.equal(100);
    expect(storeB.number).to.equal(50);
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

  it('should not conflict with other instances of itself', function () {
    var dispatcherA = dispatcher.createDispatcher({ stores: stores });
    var dispatcherContextA = dispatcherA.createContext({});
    var dispatcherB = dispatcher.createDispatcher({ stores: stores });
    var dispatcherContextB = dispatcherB.createContext({});

    var storeA = dispatcherContextA.getStore(RegularStore);
    var storeB = dispatcherContextB.getStore(RegularStore);

    expect(storeA.number).to.equal(50);
    expect(storeB.number).to.equal(50);
    dispatcherContextA.dispatch('TRIGGER', 100);
    expect(storeA.number).to.equal(100);
    expect(storeB.number).to.equal(50);
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

  it('should not conflict with other instances of itself', function () {
    var dispatcherA = dispatcher.createDispatcher({ stores: stores });
    var dispatcherContextA = dispatcherA.createContext({});
    var dispatcherB = dispatcher.createDispatcher({ stores: stores });
    var dispatcherContextB = dispatcherB.createContext({});

    var storeA = dispatcherContextA.getStore(PrivatesStore);
    var storeB = dispatcherContextB.getStore(PrivatesStore);

    expect(storeA.number).to.equal(50);
    expect(storeB.number).to.equal(50);
    dispatcherContextA.dispatch('TRIGGER', 100);
    expect(storeA.number).to.equal(100);
    expect(storeB.number).to.equal(50);
  });
});
