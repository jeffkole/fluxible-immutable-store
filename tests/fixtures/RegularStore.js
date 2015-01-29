'use strict';

var createImmutableStore = require('../../index');

var RegularStore = createImmutableStore(function () {
  return {
    storeName: 'RegularStore',

    handlers: {
      'SET_STRING': '_onSetString'
    },

    initialize: function () {
      this.string = 'Hello';
    },

    _onSetString: function (s) {
      this.string = s;
    }
  };
});

module.exports = RegularStore;
