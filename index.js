'use strict';

var BaseStore = require('dispatchr/addons/BaseStore');
var inherits = require('inherits');

// IGNORE_ON_PROTOTYPE, createChainedFunction, and mixInto are copied verbatim
// from dispatchr/addons/createStore.

var IGNORE_ON_PROTOTYPE = ['statics', 'storeName', 'handlers', 'mixins'];

function createChainedFunction(one, two) {
  return function chainedFunction() {
    one.apply(this, arguments);
    two.apply(this, arguments);
  };
}

function mixInto(dest, src) {
  Object.keys(src).forEach(function (prop) {
    if (-1 !== IGNORE_ON_PROTOTYPE.indexOf(prop)) {
      return;
    }
    if ('initialize' === prop) {
      if (!dest[prop]) {
        dest[prop] = src[prop];
      } else {
        dest[prop] = createChainedFunction(dest[prop], src[prop]);
      }
    } else {
      if (dest.hasOwnProperty(prop)) {
        throw new Error('Mixin property collision for property "' + prop + '"');
      }
      dest[prop] = src[prop];
    }
  });
}

/**
 * Creates a store based on the spec returned by `specFactory`.  See Dispatchr's
 * `createStore` function for its requirements.  The only additional spec field
 * is `accessors`.  It can be an array of strings, in which case the field data
 * must be set on the `privates` object passed into the `specFactory`.  If it is
 * an object, the keys must be strings, and the values must be functions to
 * retrieve the data.
 */
module.exports = function createImmutableStore(specFactory) {
  // To make this closure that is included in the specFactory function work
  // correctly, the function must be invoked when the store instance is created.
  // If it is not done that way, but is instead invoked when creating the store
  // class, then the instances of this store class will share data.  That is bad
  // when these stores are used in server-side rendering and expect to work in
  // a multi-threaded environment.
  // Most of the code below is adapted from createStore, but instead of applying
  // the accessors and other functions of the spec to the prototype of
  // ImmutableStore, they are applied to the instance itself.  This lets us
  // invoke the specFactory for each instance so that its closed over data is
  // kept isolated.
  var ImmutableStore = function (dispatcher) {
    var self = this;

    var privates = {};
    var spec = specFactory(privates);
    var accessors = spec.accessors;
    // Delete the accessors definition from the spec so that they are not
    // included in the Store prototype.
    delete spec.accessors;

    if (accessors) {
      if (accessors instanceof Array) {
        // Each element of the array is the name of the accessor as well as the
        // name of the field that should be set in the `privates` variable.
        accessors.forEach(function forEachField(accessor) {
          Object.defineProperty(self, accessor, {
            enumberable: true,
            get: function () { return privates[accessor]; }
          });
        });
      }
      else {
        // Each key/value accessor pair defines the name of the accessor and the
        // function that accesses the field.
        Object.keys(accessors).forEach(function forEachField(accessor) {
          Object.defineProperty(self, accessor, {
            enumerable: true,
            get: accessors[accessor]
          });
        });
      }
    }

    if (ImmutableStore.mixins) {
      ImmutableStore.mixins.forEach(function forEachMixin(mixin) {
        mixInto(self, mixin);
      });
    }
    mixInto(self, spec);

    BaseStore.call(self, dispatcher);
  };

  inherits(ImmutableStore, BaseStore);

  var spec = specFactory({});
  spec.statics = spec.statics || {};
  if (!spec.storeName && !spec.statics.storeName) {
    throw new Error('createStore called without a storeName');
  }

  Object.keys(spec.statics).forEach(function forEachStatic(prop) {
    ImmutableStore[prop] = spec.statics[prop];
  });

  ImmutableStore.storeName = spec.storeName || ImmutableStore.storeName;
  ImmutableStore.handlers = spec.handlers || ImmutableStore.handlers;
  ImmutableStore.mixins = spec.mixins || ImmutableStore.mixins;

  return ImmutableStore;
};
