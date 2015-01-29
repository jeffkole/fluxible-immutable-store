'use strict';

var createStore = require('dispatchr/utils/createStore');

module.exports = function createImmutableStore(specFactory) {
  var spec = specFactory();
  var accessors = spec.accessors;
  // Delete the accessors definition from the spec so that they are not included
  // in the Store prototype.
  delete spec.accessors;

  var Store = createStore(spec);
  if (accessors) {
    // Define a property for each accessor based on the name.
    Object.keys(accessors).forEach(function forEachField(accessor) {
      Object.defineProperty(Store.prototype, accessor, {
        enumerable: true,
        get: accessors[accessor]
      });
    });
  }

  return Store;
};
