'use strict';

var expect = require('chai').expect;
var Dispatcher = require('dispatchr')();

var BasicStore = require('../fixtures/BasicStore');
var RegularStore = require('../fixtures/RegularStore');

Dispatcher.registerStore(BasicStore);
Dispatcher.registerStore(RegularStore);
var dispatcher = new Dispatcher({});

describe('basic immutable store', function () {
  it('should not have any accessors defined on its prototype', function () {
    expect(BasicStore.prototype.accessors).to.equal(undefined);
  });

  it('should mutate its internal state in response to a dispatch', function () {
    var store = dispatcher.getStore(BasicStore);
    expect(store.number).to.equal(50);
    dispatcher.dispatch('SET_NUMBER', 100);
    expect(store.number).to.equal(100);
  });

  it('should not allow set access to that internal state', function () {
    var store = dispatcher.getStore(BasicStore);
    var num = store.number;
    expect(
      function () {
        store.number = 250;
      }).to.throw(TypeError);
    expect(store.number).to.equal(num);
  });
});

describe('regular store', function () {
  it('should mutate its internal state in response to a dispatch', function () {
    var store = dispatcher.getStore(RegularStore);
    expect(store.string).to.equal('Hello');
    dispatcher.dispatch('SET_STRING', 'Bye');
    expect(store.string).to.equal('Bye');
  });

  it('should allow set access to that internal state', function () {
    var store = dispatcher.getStore(RegularStore);
    store.string = 250;
    expect(store.string).to.equal(250);
  });
});
