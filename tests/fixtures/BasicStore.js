'use strict';

var createImmutableStore = require('../../index');

var BasicStore = createImmutableStore(function () {
  var number = 0;

  return {
    storeName: 'BasicStore',

    handlers: {
      'TRIGGER': '_trigger'
    },

    initialize: function () {
      number = 50;
    },

    _trigger: function (num) {
      number = num;
    },

    accessors: {
      'number': function () { return number; }
    }
  };
});

module.exports = BasicStore;
