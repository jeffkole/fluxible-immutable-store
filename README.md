# Fluxible Immutable Store

[![npm version](https://badge.fury.io/js/fluxible-immutable-store.svg)](http://badge.fury.io/js/fluxible-immutable-store)
[![Build Status](https://travis-ci.org/jeffkole/fluxible-immutable-store.svg?branch=master)](https://travis-ci.org/jeffkole/fluxible-immutable-store)
[![Coverage Status](https://coveralls.io/repos/jeffkole/fluxible-immutable-store/badge.svg)](https://coveralls.io/r/jeffkole/fluxible-immutable-store)

A helper function to create stores that hide private data.  That is the one and
only feature of this module.

Use whatever data structures you want inside.  You can choose to use immutable
data structures from [Immutable][immutable], [Mori][mori], or any other, or you
can choose to return deep clones of your internal data.  All this function does
is help you keep the internals of your store internal.

The library relies on Yahoo!'s [Dispatchr][dispatchr]
[`createStore`][createStore] function.  You can use these stores with just the
dispatcher or with Yahoo!'s [Fluxible][fluxible] library.

## Usage

```
npm install --save fluxible-immutable-store
```

## Example

Here is a piece of a reimplementation of the [TodoStore][todostore] from the
[Fluxible examples][fexamples].  It uses Facebook's [Immutable][immutable] data
structures internally, but that is merely a design choice.

```javascript
var Immutable = require('immutable');
var createImmutableStore = require('fluxible-immutable-store');

var TodoStore = createImmutableStore(function () {
  // Hide any data you want in variables declared in the closure
  var todos;

  // This is the spec that is expected by createStore
  return {
    storeName: 'TodoStore',
    handers: {
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
        return todos;
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

[immutable]: http://facebook.github.io/immutable-js/
[mori]: http://swannodette.github.io/mori/
[dispatchr]: https://github.com/yahoo/dispatchr
[createStore]: https://github.com/yahoo/dispatchr#createstore
[fluxible]: http://www.fluxible.io/
[todostore]: https://github.com/yahoo/flux-examples/blob/master/todo/stores/TodoStore.js
[fexamples]: https://github.com/yahoo/flux-examples
