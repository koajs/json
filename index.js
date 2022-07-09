/*!
 * koa-json
 *
 * Copyright (c) 2014-2022  jongleberry (me@jongleberry.com)      <https://jongleberry.com/>
 * Copyright (c) 2022       imed jaberi (imed-jaberi@outlook.com) <https://www.3imed-jaberi.com>
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 */

const StreamStringify = require('streaming-json-stringify')
const isJSON = require('koa-is-json')

/**
 * Temp assigned for override later
 */

const hasOwnProperty = Object.hasOwnProperty

const defaultOptions = {
  pretty: true,
  spaces: 2
}

/**
 * Check if the passed value is stream or not!
 *
 * @param {unkown} maybeStream value to check
 * @return {boolean}
 */
const isStream = (maybeStream) => maybeStream &&
  typeof maybeStream.pipe === 'function' &&
  maybeStream._readableState &&
  maybeStream._readableState.objectMode

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
module.exports = function (options) {
  const { pretty, spaces, param } = Object.assign({}, defaultOptions, options)

  return async (ctx, next) => {
    await next()
    const body = ctx.body

    // unsupported body type
    const stream = isStream(body)
    const json = isJSON(body)

    if (!json && !stream) return

    // query
    const hasParam = param && hasOwnProperty.call(ctx.query, param)
    const prettify = pretty || hasParam

    // always stringify object streams
    if (stream) {
      ctx.response.type = 'json'
      const stringify = StreamStringify()
      if (prettify) stringify.space = spaces
      ctx.body = body.pipe(stringify)
      return
    }

    // prettify JSON responses
    if (prettify) ctx.body = JSON.stringify(body, null, spaces)
  }
}
