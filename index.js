
var isJSON = require('koa-is-json');
var Stringify = require('streaming-json-stringify');
var os = require('os')

var hasOwnProperty = Object.hasOwnProperty

/**
 * Pretty JSON response middleware.
 *
 *  - `pretty` default to pretty response [true]
 *  - `param` optional query-string param for pretty responses [none]
 *
 * @param {Object} opts
 * @return {GeneratorFunction}
 * @api public
 */

module.exports = function(opts){
  var opts = opts || {};
  var param = opts.param;
  var pretty = null == opts.pretty ? true : opts.pretty;
  var spaces = opts.spaces || 2;

  return function *filter(next){
    yield *next;

    var body = this.body;
    // unsupported body type
    var stream = body
      && typeof body.pipe === 'function'
      && body._readableState
      && body._readableState.objectMode;
    var json = isJSON(body);
    if (!json && !stream) return;

    // query
    var hasParam = param && hasOwnProperty.call(this.query, param);
    var prettify = pretty || hasParam;

    // always stringify object streams
    if (stream) {
      this.response.type = 'json';
      var stringify = Stringify();
      if (prettify) stringify.space = spaces;
      this.body = body.pipe(stringify);
      return;
    }

    // prettify JSON responses
    if (json && prettify) {
      return this.body = JSON.stringify(body, null, spaces) + os.EOL;
    }
  }
};
