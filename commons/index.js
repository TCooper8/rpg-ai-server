'use strict'

let Util = require('util')

let _ = require('lodash')
let match = require('./match')
let option = require('./option')

exports.defaultArg = (value, defaultValue) => {
  if (value === undefined) {
    if (_.isFunction(defaultValue)) {
      return defaultValue()
    }
    return defaultValue
  }

  return value
}

exports.match = match
exports.option = option
exports.sprintf = Util.format
