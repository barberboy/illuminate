defer
=====

Utilities to lazily load DOM elements.

  Version: 1.1.1  
  Homepage: <https://github.com/barberboy/defer>  

Install
-------

    npm install defer

Methods
-------
- [defer.scan](#defer-scan)
- [defer.load](#defer-load)

Dependencies
------------
- [request v1.0.0](https://github.com/barberboy/request)

defer.scan
==========

The **defer.scan()** method scans the document for deferred elements
and loads them automatically.

Syntax
------

    defer.scan([element][, callback])

Parameters
----------

- `element`: Optional. Specifies the root [Element] to scan. If not
   provided, the entire document will be scanned.

- `callback(el)`: Optional. The [Function] to be called after each
   deferred element has been loaded.

   When `callback` is invoked, its `this` binding is set to the
   [XMLHttpRequest] object that made the request, and the first argument,
   `el`, refers to the deferred [Element].

Description
-----------

`defer.scan(element)` checks `element` for children that have the `defer`
class name and a `data-src` attribute. If `element` is not provided, scan
the entire `document`. An example of matching HTML would be something
like:

```html
<div class="defer" data-src="partial.html">
  <!-- fallback content if request fails -->
</div>
```

defer.scan() is automatically called when defer.js is loaded,
though you can disable this by setting:

```js
window.defer_config = {autoscan: false};
```

*before* loading the defer.js library.

`defer.scan` is called on the deferred elements after they are
loaded, so you can safely use use .defer inside deferred HTML.

See Also
--------

- [XMLHttpRequest]

  [Element]: https://developer.mozilla.org/en-US/docs/Web/API/element
  [Function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
  [XMLHttpRequest]: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest

defer.load
==========

The **defer.load(element, url)** method fetches text from the server and
injects it into the passed element.

Syntax
------

```js
defer.load(element[, url][, callback])
```

Parameters
----------
- `element`: The DOM [Element] to load the content into.
- `url`    : Optional. A [String] specifying the URL of the content to
   load. If not provided, the value of the `data-src` attribute will be
   used.
- `callback(el)`: Optional. A callback [Function] that will be called
   after each deferred element has been loaded.

   When `callback` is invoked, its `this` binding is set to the
   [XMLHttpRequest] object that made the request, and the first argument,
   `el`, refers to the deferred [Element].

Description
-----------
`defer.load(element, url)` fetches the contents of `url` and injects the
returned text into `element`.

If `url` is not provided, defer will look for the `data-src` attribute
and use its value as the url.

Examples
--------

    // Fetch "/sidebar.html" and load its contents into
    // the element with the ID of "sidebar".
    var sidebar = document.getElementById('sidebar');
    defer.load(sidebar, '/sidebar.html');

See Also
--------

- [XMLHttpRequest]
  [String]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/prototype