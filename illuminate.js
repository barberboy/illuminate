/**
 * illuminate
 * ==========
 * 
 * Illuminate is a simple tool to extract Markdown-formatted comments from
 * JavaScript source code, which can then be used to build READMEs or API
 * documentation.
 * 
 * Install
 * -------
 * Install from npm:
 * 
 *     npm install -g illuminate
 * 
 * Usage Examples
 * --------------
 * The illuminate(1) cli operates over stdio, extracting Markdown comments from
 * a JavaScript source file:
 * 
 * ```sh
 * # Generate README.md from source code comments
 * illuminate < myfile.js > README.md
 * 
 * # Convert Markdown comments to HTML
 * $ illuminate --html < myfile.js > myfile.html
 * 
 * # Generate as .json to render with mustache(1)
 * $ illuminate --json --html < myfile.js | mustache - template.mustache
 * ```
 * 
 * Usage
 * -----
 * <pre>
 * $ illuminate --help
 *
 * Usage: illuminate [options]
 *
 * Options:
 *
 *   -h, --help       output usage information
 *   -V, --version    output the version number
 *   --html           Convert Markdown to HTML.
 *   --json           Output as a JSON object with a title and body.
 *   --no-gfm         Disable Github flavored markdown.
 *   --no-tables      Disable GFM tables.
 *   --breaks         Enable GFM line breaks. This option requires gfm to be enabled.
 *   --pedantic       Conform to obscure parts of markdown.pl as much as possible. Don't fix any of the original Markdown bugs or poor behavior.
 *   --sanitize       Sanitize the output. Ignore any HTML that has been input.
 *   --no-smartLists  Use original Markdown behavior for lists.
 *   --smartypants    Use “smart” typograhic punctuation for things like quotes and dashes.
 *   --syntax         Enable syntax highlighting using highlight.js.
 *   --xhtml          Render XHTML compatible output.
 * </pre>
 * 
 * Programmatic Usage
 * ------------------
 * illuminate can also be used programmatically as a node/io module. This might
 * be convenient if you want to completely control Markdown processing.
 * 
 * ## Syntax
 * 
 *     illuminate(source[, options])
 * 
 * ## Example
 * ```js
 * var readFileSync = require('fs').readFileSync;
 * var commonmark = require('commonmark');
 * var illuminate = require('illuminate');
 * 
 * var source = readFileSync(__dirname + '/myfile.js');
 * var api = illuminate(source);
 * var reader = new commonmark.Parser();
 * var writer = new commonmark.HtmlRenderer();
 * var parsed = reader.parse(api);
 * console.log(writer.render(parsed));
 * ```
 */
// dependencies

var dox = require('dox');
var markdown = require('marked');
var highlight = require('highlight.js');
var assign = require('lodash.assign');
var inherits = require('inherits');
var kebabcase = require('lodash.kebabcase');

/**
 * ### Options
 * 
 * - `html`: Convert Markdown to Use GitHub-flavored Markdown. Default is `true`.
 * - `renderer`: Use a custom renderer for HTML output.
 * - `gfm`: Use GitHub-flavored Markdown. Default is `true`.
 * - `tables`: Enable GFM tables. Default is `true`.
 * - `breaks`: Enable GFM line breaks. This option requires gfm to be enabled. Default is `true`.
 * - `pedantic`: Conform to obscure parts of markdown.pl as much as possible. Default is `false`.
 * - `sanitize`:Sanitize the output. Ignore any HTML that has been input. Default is `false`.
 * - `smartLists`: Use smarter list behavior than the original markdown. Default is `false`.
 * - `smartypants`: Use "smart" typograhic punctuation for things like quotes and dashes. Default is `false`.
 * - `syntax`: Enable syntax highlighting using highlight.js during Markdown->HTML conversion. Default is `false`.
 * - `xhtml`: Render XHTML compatible output. Default is `false`.
 * 
 * #### See Also
 * 
 * - [marked options](https://github.com/chjj/marked#options-1)
 */
var defaults = {
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    syntax: false
};

// illuminate

function illuminate(source, options) {

    // Merge defaults and passed options
    var config = assign({}, defaults, options);

    // Set up simple syntax higlighting if requested
    if (config.syntax) {
        config.highlight = function(code) {
            return highlight.highlightAuto(code).value;
        };
    }

    // Pass options along to the default render (for xtml and santize support)
    config.renderer = options.renderer || new Renderer(config);

    // Extract the first heading to use as a title.
    var title;
    var renderHeading = config.renderer.heading;
    config.renderer.heading = function(text, level) {
        if (!title) title = text;
        return renderHeading.apply(this, arguments);
    };
    markdown.options(config);

    // Use dox to extract the Markdown from comments.
    var comments = dox.parseComments(source, {
        raw: true,
        skipSingleStar: true
    });

    // Concatenate the Markdown in the comments
    var text = comments.map(function(comment) {
        return comment.description.full;
    }).join('\n\n');

    // Process it as HTML (also extract the `title` property)
    var html = markdown(text);

    // Set body to be either Markdown (default) or processed HTML.
    var body = config.html ? html : text;

    // Return body, or JSON with title, body, and comments (from dox)
    if (config.json) {
        return {
            title: title,
            body: body,
            comments: comments
        };
    }
    else {
        return body;
    }
}

/**
 * illuminate.Renderer
 * ===================
 * By default, illuminate uses a custom Renderer which inherits from
 * [markdown.Renderer] and generates unique IDs for headings.
 * 
 * You can override this renderer by setting `options.renderer`, but if you'd
 * like to maintain the unique ID behavior, you can do something like:
 * 
 *     var illuminate = require('illuminate');
 *     var myRenderer = new illuminate.Renderer();
 *     myRenderer.paragraph = function(text) {
 *       // ...your custom rendering here...
 *       return text;
 *     };
 * 
 * See Also:
 * 
 * - [markdown.Renderer]
 *   [markdown.Renderer]: https://github.com/chjj/marked#renderer
 */
function Renderer() {
    markdown.Renderer.apply(this, arguments);
    this.ids = {};
}

inherits(Renderer, markdown.Renderer);

Renderer.prototype.count = function(id) {
    return this.ids.hasOwnProperty(id) ? ++this.ids[id] : this.ids[id] = 1;
};
Renderer.prototype.uniqueId = function(text) {
    var id = kebabcase(text);
    var count = this.count(id);
    return (count === 1) ? id : id + '-' + count;
};
Renderer.prototype.heading = function(text, level) {
    var id = this.uniqueId(text);
    return '<h' + level + ' id="' + id + '">' + text + '</h' + level + '>\n';
};

// exports

module.exports = illuminate;
module.exports.Renderer = Renderer;

/**
 * License
 * -------
 * The MIT License (MIT)  
 * Copyright © 2015 Benjamin Barber
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */