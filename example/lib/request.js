/**
 * request
 * =======
 *
 * A simpler XHR API. The `request` library provides a simple API for fetching
 * content using XMLHttpRequest.
 * 
 * Version: 1.0.0  
 * Homepage: <https://github.com/barberboy/request>  
 * 
 * Install
 * -------
 * 
 *     npm install request
 *
 * Methods
 * -------
 * 
 * - [request.json](#request-json)
 * - [request.jsonp](#request-jsonp)
 * - [request.text](#request-text)
 * - [request.html](#request-html)
 * 
 * See Also
 * --------
 *
 * - [JSON]
 * - [JSONP]
 * - [XMLHttpRequest]
 * 
 *   [JSONP]: http://en.wikipedia.org/wiki/JSONP
 *   [JSON]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
 *   [XMLHttpRequest]: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
 *   [String]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
 *   [Function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
 *   [Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
 */
var request = (function() {
    //#private function
    function get(outputType, path, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', path, true);
        xhr.responseType = outputType;
        xhr.onload = function() {
            callback.call(this, this.response);
        };
        xhr.send();
        return xhr;
    }

    function getJSONP(path) {
        var body = document.body;
        var script = document.createElement('script');
        script.src = path;
        body.appendChild(script);
        script.onload = function() {
            body.removeChild(script);
        };
    }

    var getJSON = get.bind(undefined, 'json');
    var getText = get.bind(undefined, 'text');

    return {
        /**
         * request.json
         * ============
         *
         * The **request.json()** method fetches a JSON files and returns the
         * parsed JSON object.
         *
         * Syntax
         * ------
         *
         *     request.json(path, callback)
         *
         * Parameters
         * ----------
         * - `path`:  A [String] containing a URL to the JSON file.
         *
         * - `callback(obj)`: A callback [Function] to be called when the request
         *    completes.
         *
         *    When `callback` is invoked, its `this` binding is set to the
         *    [XMLHttpRequest] object that made the request, and the first argument,
         *    `obj`, is a JavaScript [Object] built from the parsed JSON.
         *
         * Description
         * -----------
         *
         * `request.json(path, callback)` fetches a .json file, parses it, and
         * passes the resulting JavaScript object to `callback`.
         *
         * When `callback` is invoked, its `this` binding is set to the
         * [XMLHttpRequest] object that made the request, allowing you to check
         * the status of the XHR request.
         *
         * Examples
         * --------
         *
         *     request.json('/data.json', function(data) {
         *       // Ensure a successful response
         *       if (this.status === 200) {
         *         // Do something with `data`
         *       }
         *     });
         *
         * See Also
         * --------
         *
         * - [JSON]
         * - [XMLHttpRequest]
         */
        json: getJSON,
        /**
         * request.jsonp
         * =============
         *
         * The **request.jsonp()** method loads a [JSONP] script.
         *
         * Syntax
         * ------
         *
         *     request.jsonp(path)
         *
         * Parameters
         * ----------
         *
         * - `path`:  A [String] containing a URL to the JSONP script.
         *
         * Description
         * -----------
         *
         * `request.jsonp(path)` fetches loads a JSONP script into the document.
         *
         * Examples
         * --------
         *
         *     request.jsonp('/data.js');
         * 
         * See Also
         * --------
         *
         * - [JSONP]
         */
        jsonp: getJSONP,
        /**
         * request.text
         * ============
         *
         * The **request.text()** method fetches text from the server and passes
         * it to the callback function.
         *
         * Syntax
         * ------
         *
         *     request.text(path, callback)
         *
         * Parameters
         * ----------
         *
         * - `path`:  A [String] containing a URL to the HTML file.
         *
         * - `callback(response)`: A callback [Function] to be called when the request
         *   completes.
         *
         *   When `callback` is invoked, its `this` binding is set to the
         *   [XMLHttpRequest] object that made the request, and the first
         *   argument, `response`, is a [String] containing the response text.
         *
         * Description
         * -----------
         *
         * `request.text(path, callback)` makes an XMLHttpRequest for data on
         * the server, and passes the resonse to `callback`.
         *
         * When `callback` is invoked, its `this` binding is set to the
         * [XMLHttpRequest] object that made the request, allowing you to check
         * the status of the XHR request.
         *
         * Examples
         * --------
         *
         *     request.html('/footer.html', function(html) {
         *       // Ensure a successful response
         *       if (this.status === 200) {
         *         document.getElementById('footer').innerHTML = html;
         *       }
         *     });
         * 
         * See Also
         * --------
         *
         * - [XMLHttpRequest]
         */
        text: getText,
        /**
         * request.html
         * ============
         *
         * The **request.html()** method fetches HTML content and passes it to
         * the callback function.
         *
         * Syntax
         * ------
         *
         *     request.html(path, callback)
         *
         * Parameters
         * ----------
         * - `path`:  A [String] containing a URL to the HTML file.
         *
         * - `callback(html)`: A callback [Function] to be called when the request
         *    completes.
         *
         *    When `callback` is invoked, its `this` binding is set to the
         *    [XMLHttpRequest] object that made the request, and the first argument,
         *    `html`, is a String containing the returned HTML.
         *
         * Description
         * -----------
         * `request.html(path, callback)` fetches HTML content and
         * passes it to `callback`. (Truthfully, it's just an alias to
         * response.text().)
         *
         * When `callback` is invoked, its `this` binding is set to the
         * [XMLHttpRequest] object that made the request, allowing you to check
         * the status of the XHR request.
         *
         * Examples
         * --------
         *
         *     request.html('/footer.html', function(html) {
         *       // Ensure a successful response
         *       if (this.status === 200) {
         *         document.getElementById('footer').innerHTML = html;
         *       }
         *     });
         * 
         * See Also
         * --------
         *
         * - [XMLHttpRequest]
         */
        html: getText
    };
}());