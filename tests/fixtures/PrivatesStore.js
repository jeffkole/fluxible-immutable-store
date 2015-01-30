'use strict';

var createImmutableStore = require('../../index');

var PrivatesStore = createImmutableStore(function (privates) {
  return {
    storeName: 'PrivatesStore',

    handlers: {
      'TRIGGER': '_trigger'
    },

    initialize: function () {
      privates.number = 50;
    },

    _trigger: function (num) {
      privates.number = num;
    },

    accessors: [ 'number' ]
  };
});

module.exports = PrivatesStore;
