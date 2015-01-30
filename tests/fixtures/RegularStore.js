'use strict';

var createImmutableStore = require('../../index');

var RegularStore = createImmutableStore(function () {
  return {
    storeName: 'RegularStore',

    handlers: {
      'TRIGGER': '_trigger'
    },

    initialize: function () {
      this.number = 50;
    },

    _trigger: function (num) {
      this.number = num;
    }
  };
});

module.exports = RegularStore;
