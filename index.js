
const Stringify = require('streaming-json-stringify')
const isJSON = require('koa-is-json')

const hasOwnProperty = Object.hasOwnProperty

const defaultOptions = {
  pretty: true,
  spaces: 2
}

/** @typedef {import("koa").Middleware} Middleware */

/**
 * Pretty JSON response middleware.
 * @param {Object} options
 * @param {boolean=} options.pretty
 *   Whether to format the json with newlines and spaces. Default `true`
 * @param {number=} options.spaces number of spaces to use as tab
 * @param {string=} options.param
 *   query-string param that will bypass pretty config if present
 * @return {Middleware}
 * @api public
 */

module.exports = function (options = defaultOptions) {
  const pretty = options.pretty == null ? true : options.pretty
  const spaces = options.spaces || 2
  const param = options.param

  return function filter (ctx, next) {
    return next().then(() => {
      const body = ctx.body
      // unsupported body type
      const stream = body &&
        typeof body.pipe === 'function' &&
        body._readableState &&
        body._readableState.objectMode
      const json = isJSON(body)
      if (!json && !stream) return

      // query
      const hasParam = param && hasOwnProperty.call(ctx.query, param)
      const prettify = pretty || hasParam

      // always stringify object streams
      if (stream) {
        ctx.response.type = 'json'
        const stringify = Stringify()
        if (prettify) stringify.space = spaces
        ctx.body = body.pipe(stringify)
        return
      }

      // prettify JSON responses
      if (json && prettify) {
        ctx.body = JSON.stringify(body, null, spaces)
      }
    })
  }
}
