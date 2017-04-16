
const Stringify = require('streaming-json-stringify');
const isJSON = require('koa-is-json');

const hasOwnProperty = Object.hasOwnProperty

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

module.exports = function(opts = {}){
  const param = opts.param;
  const pretty = null == opts.pretty ? true : opts.pretty;
  const spaces = opts.spaces || 2;

  return function filter(ctx, next){
    return next().then(() => {
      const body = ctx.body;
      // unsupported body type
      const stream = body
        && typeof body.pipe === 'function'
        && body._readableState
        && body._readableState.objectMode;
      const json = isJSON(body);
      if (!json && !stream) return;

      // query
      const hasParam = param && hasOwnProperty.call(ctx.query, param);
      const prettify = pretty || hasParam;

      // always stringify object streams
      if (stream) {
        ctx.response.type = 'json';
        const stringify = Stringify();
        if (prettify) stringify.space = spaces;
        ctx.body = body.pipe(stringify);
        return;
      }

      // prettify JSON responses
      if (json && prettify) {
        return ctx.body = JSON.stringify(body, null, spaces);
      }
    });
  }
};
