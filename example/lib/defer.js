/**
 * defer
 * =====
 *
 * Utilities to lazily load DOM elements.
 *
 *   Version: 1.1.1  
 *   Homepage: <https://github.com/barberboy/defer>  
 *
 * Install
 * -------
 *
 *     npm install defer
 *
 * Methods
 * -------
 * - [defer.scan](#defer-scan)
 * - [defer.load](#defer-load)
 *
 * Dependencies
 * ------------
 * - [request v1.0.0](https://github.com/barberboy/request)
 *
 */
var defer = (function(request) {
    // Users can prevent initial scan by setting:
    // window.defer = {autoscan: false};
    var options = window.defer_config || {
        autoscan: false
    };

    // Cache the forEach function to improve performance.
    var forEach = Array.prototype.forEach;

    // Scan
    if (options.autoscan) {
        scan();
    }

    /**
     * defer.scan
     * ==========
     *
     * The **defer.scan()** method scans the document for deferred elements
     * and loads them automatically.
     *
     * Syntax
     * ------
     *
     *     defer.scan([element][, callback])
     *
     * Parameters
     * ----------
     *
     * - `element`: Optional. Specifies the root [Element] to scan. If not
     *    provided, the entire document will be scanned.
     *
     * - `callback(el)`: Optional. The [Function] to be called after each
     *    deferred element has been loaded.
     *
     *    When `callback` is invoked, its `this` binding is set to the
     *    [XMLHttpRequest] object that made the request, and the first argument,
     *    `el`, refers to the deferred [Element].
     *
     * Description
     * -----------
     *
     * `defer.scan(element)` checks `element` for children that have the `defer`
     * class name and a `data-src` attribute. If `element` is not provided, scan
     * the entire `document`. An example of matching HTML would be something
     * like:
     *
     * ```html
     * <div class="defer" data-src="partial.html">
     *   <!-- fallback content if request fails -->
     * </div>
     * ```
     *
     * defer.scan() is automatically called when defer.js is loaded,
     * though you can disable this by setting:
     *
     * ```js
     * window.defer_config = {autoscan: false};
     * ```
     *
     * *before* loading the defer.js library.
     *
     * `defer.scan` is called on the deferred elements after they are
     * loaded, so you can safely use use .defer inside deferred HTML.
     * 
     * See Also
     * --------
     *
     * - [XMLHttpRequest]
     *
     *   [Element]: https://developer.mozilla.org/en-US/docs/Web/API/element
     *   [Function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
     *   [XMLHttpRequest]: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
     */
    function scan(element, callback) {
        // Support calling defer.scan without a root element, but with
        // a callback, like: `defer.scan(function(el){});`
        if (typeof(element) === 'function') {
            callback = element;
            element = undefined;
        }

        // Find elements that have the "defer" classname *and* a defer-src attribute.
        var deferred = (element || document).querySelectorAll('.defer[data-src]');
        forEach.call(deferred, function(el) {
            load(el, callback);
        });
    }

    /**
     * defer.load
     * ==========
     *
     * The **defer.load(element, url)** method fetches text from the server and
     * injects it into the passed element.
     *
     * Syntax
     * ------
     *
     * ```js
     * defer.load(element[, url][, callback])
     * ```
     * 
     * Parameters
     * ----------
     * - `element`: The DOM [Element] to load the content into.
     * - `url`    : Optional. A [String] specifying the URL of the content to
     *    load. If not provided, the value of the `data-src` attribute will be
     *    used.
     * - `callback(el)`: Optional. A callback [Function] that will be called
     *    after each deferred element has been loaded.
     *
     *    When `callback` is invoked, its `this` binding is set to the
     *    [XMLHttpRequest] object that made the request, and the first argument,
     *    `el`, refers to the deferred [Element].
     *
     * Description
     * -----------
     * `defer.load(element, url)` fetches the contents of `url` and injects the
     * returned text into `element`.
     *
     * If `url` is not provided, defer will look for the `data-src` attribute
     * and use its value as the url.
     *
     * Examples
     * --------
     *
     *     // Fetch "/sidebar.html" and load its contents into
     *     // the element with the ID of "sidebar".
     *     var sidebar = document.getElementById('sidebar');
     *     defer.load(sidebar, '/sidebar.html');
     *
     * See Also
     * --------
     *
     * - [XMLHttpRequest]
     *   [String]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/prototype
     */
    function load(element, url, callback) {
        // Support calling *without* `url`, but *with* `callback`.
        if (typeof(url) === 'function') {
            callback = url;
            url = undefined;
        }

        // Use the `request` library to fetch the HTML, then load the
        // response text into `element`.
        request.html(url || element.dataset.src, function(text) {
            // Ensure a successful response
            if (this.status === 200) {
                // Prevent .scan() from fetching the html multiple times
                element.classList.remove('defer');
                element.innerHTML = text;
                // Recurse!
                scan(element, callback);
                if (callback) {
                    callback.call(this, element);
                }
            }
        });
    }

    // Return public API
    return {
        load: load,
        scan: scan
    };
})(window.request);