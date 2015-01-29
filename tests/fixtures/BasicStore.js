'use strict';

var createImmutableStore = require('../../index');

var BasicStore = createImmutableStore(function () {
  var number = 0;

  return {
    storeName: 'BasicStore',

    handlers: {
      'SET_NUMBER': '_onSetNumber'
    },

    initialize: function () {
      number = 50;
    },

    _onSetNumber: function (num) {
      number = num;
    },

    accessors: {
      'number': function () { return number; }
    }
  };
});

module.exports = BasicStore;
