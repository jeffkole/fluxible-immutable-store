# Fluxible Immutable Store

[![npm version](https://badge.fury.io/js/fluxible-immutable-store.svg)](http://badge.fury.io/js/fluxible-immutable-store)
[![Build Status](https://travis-ci.org/jeffkole/fluxible-immutable-store.svg?branch=master)](https://travis-ci.org/jeffkole/fluxible-immutable-store)
[![Coverage Status](https://coveralls.io/repos/jeffkole/fluxible-immutable-store/badge.svg)](https://coveralls.io/r/jeffkole/fluxible-immutable-store)

A helper function to create stores that protect private data from being set from
outside.  That is the one and only feature of this module.

Use whatever data structures you want inside.  You can choose to use immutable
data structures from [Immutable][immutable], [Mori][mori], or any other library,
or you can choose to return deep clones of your internal data.  All this
function does is help you keep the internals of your store internal.

The library relies on Yahoo!'s [Dispatchr][dispatchr]
[`createStore`][createStore] function.  You can use these stores with just the
dispatcher or with Yahoo!'s [Fluxible][fluxible] library.

## Installation

```
npm install --save fluxible-immutable-store
```

## Example

Here is part of a reimplementation of the [TodoStore][todostore] from the
[Fluxible examples][fexamples].  It uses Facebook's [Immutable][immutable] data
structures internally, but that is merely a design choice, not a requirement of
this module.

```javascript
var Immutable = require('immutable');
var createImmutableStore = require('fluxible-immutable-store');

var TodoStore = createImmutableStore(function () {
  // Hide any data you want in variables declared in the closure
  var todos;

  // This is the spec that is expected by createStore
  return {
    storeName: 'TodoStore',
    handlers: {
      'CREATE_TODO_START': '_createTodoStart'
    },
    initialize: function () {
      todos = Immutable.List();
    },
    _createTodoStart: function (todo) {
      todos = todos.push(Immutable.Map(todo));
      this.emitChange();
    },

    // Define the accessors to the internal state
    accessors: {
      'todos': function () {
        return todos.toJS();
      }
    }
  };
});

module.exports = TodoStore;
```

The variables that represent the store's state can be exposed as accessors.
They will have read-only properties created for them.  If you use an immutable
data structure, then there will be no way to set the property from the outside
or to mutate the structure's internal data.

In your component that needs access to the `TodoStore`, you would have code
similar to this:

```javascript
var TodoList = React.createClass({
  mixins: [ StoreMixin ],

  statics: {
    storeListeners: [ 'TodoStore' ]
  },

  // Called when TodoStore emits a change event
  onChange: function onChange() {
    var todoStore = this.getStore('TodoStore');
    this.setState({
      todos: todoStore.todos
    });
  }

  render: function render() {
    ...
  }
});
```

You won't be able to reassign a new object to the `todoStore.todos` field, thus
getting you one step closer to an immutable store.

## Alternate Accessor Definition

Alternatively, you can set the private data on the `privates` object that is
passed into your spec factory function and define the accessors as a simple
array of field names.  If you do not need to change the data structure upon
access (such as converting an `Immutable.List` to a plain Javascript array),
then this method is more succinct.

```javascript
var Immutable = require('immutable');
var createImmutableStore = require('fluxible-immutable-store');

// Set any private field data as fields on `privates`
var TodoStore = createImmutableStore(function (privates) {
  // This is the spec that is expected by createStore
  return {
    storeName: 'TodoStore',
    handlers: {
      'CREATE_TODO_START': '_createTodoStart'
    },
    initialize: function () {
      privates.todos = Immutable.List();
    },
    _createTodoStart: function (todo) {
      privates.todos = privates.todos.push(Immutable.Map(todo));
      this.emitChange();
    },

    // Define the accessors to the internal state by their names in `privates`
    accessors: [ 'todos' ]
  };
});

module.exports = TodoStore;
```

[immutable]: http://facebook.github.io/immutable-js/
[mori]: http://swannodette.github.io/mori/
[dispatchr]: https://github.com/yahoo/dispatchr
[createStore]: https://github.com/yahoo/dispatchr#createstore
[fluxible]: http://www.fluxible.io/
[todostore]: https://github.com/yahoo/flux-examples/blob/master/todo/stores/TodoStore.js
[fexamples]: https://github.com/yahoo/flux-examples
