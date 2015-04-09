'use strict';

var createStore = require('dispatchr/addons/createStore');

/**
 * Creates a store based on the spec returned by `specFactory`.  See Dispatchr's
 * `createStore` function for its requirements.  The only additional spec field
 * is `accessors`.  It can be an array of strings, in which case the field data
 * must be set on the `privates` object passed into the `specFactory`.  If it is
 * an object, the keys must be strings, and the values must be functions to
 * retrieve the data.
 */
module.exports = function createImmutableStore(specFactory) {
  var privates = {};
  var spec = specFactory(privates);
  var accessors = spec.accessors;
  // Delete the accessors definition from the spec so that they are not included
  // in the Store prototype.
  delete spec.accessors;

  var Store = createStore(spec);
  if (accessors) {
    if (accessors instanceof Array) {
      // Each element of the array is the name of the accessor as well as the
      // name of the field that should be set in the `privates` variable.
      accessors.forEach(function forEachField(accessor) {
        Object.defineProperty(Store.prototype, accessor, {
          enumberable: true,
          get: function () { return privates[accessor]; }
        });
      });
    }
    else {
      // Each key/value accessor pair defines the name of the accessor and the
      // function that accesses the field.
      Object.keys(accessors).forEach(function forEachField(accessor) {
        Object.defineProperty(Store.prototype, accessor, {
          enumerable: true,
          get: accessors[accessor]
        });
      });
    }
  }

  return Store;
};
