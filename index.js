
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

  return function *filter(next){
    yield *next;

    var body = this.body;

    // non-json
    if (!body || 'object' != typeof body) return;

    // query
    var hasParam = param && this.query[param];

    // pretty
    if (pretty || hasParam) {
      this.body = JSON.stringify(body, null, 2);
    }
  }
};
