'use strict'

let _ = require('lodash')
let option = require('./option')

let cons = ls => f => f(_.first(ls), _.rest(ls))

class Match {
  constructor(patterns) {
    this.patterns = patterns || []
  }

  get binder () {
    let patterns = this.patterns

    return function () {
      let values = arguments
      let loop = acc =>
        acc.length === 0 ?
          option.none() : cons(acc)( (h, t) => {
            let res = h.apply(null, values)
            return res.isSome() ?
              res : loop(t)
          })

      let res = loop(patterns)
      if (res.isSome()) {
        return res.get()
      }

      throw new Error('Value could not be matched by expression')
    }
  }

  addPattern (pattern) {
    return new Match(this.patterns.concat(pattern))
  }

  when () {
    let rules = _.map(arguments, rule => {
      if (_.isFunction(rule)) {
        if (_.has(rule, 'prototype')) {
          // This could be a type check.
          return value => {
            if (value === undefined) {
              return value === rule ?
                option.some(value) :
                option.none()
            }
            else if (value.constructor === rule || (value instanceof rule)) {
              return option.some(value)
            }

            let res = rule(value)
            if (res === true) {
              return option.some(value)
            }
            if (res.isSome()) {
              return res
            }
            return option.none()
          }
        }
        else {
          return value => rule(value) === true
          ? option.some(value) :
            option.none()
        }
      }

      return value => value === rule
      ? option.some(value) :
        option.none()

      //  return value => value === rule
      //  ? option.some(mapping(value)) :
      //    option.none
      //return mapping => {
      //  if (_.isFunction(rule)) {
      //    if (_.has(rule, 'prototype')) {
      //      // This could be a type check.
      //      return value => {
      //        if (value === undefined) {
      //          return value === rule ?
      //            option.some(mapping(value)) :
      //            option.none()
      //        }
      //        else if (value.constructor === rule || rule(value) === true) {
      //          return option.some(mapping(value))
      //        }
      //        return option.none()
      //      }
      //    }
      //    else {
      //      return value => rule(value) === true
      //      ? option.some(mapping(value)) :
      //        option.none()
      //    }
      //  }

      //  return value => value === rule
      //  ? option.some(mapping(value)) :
      //    option.none
      //}
    })

    return mapping => {
      let f = _.spread(mapping)
      return this.addPattern(function () {
        let values = arguments
        var i = -1,
            length = rules.length

        var acc = Array(length),
            res = undefined

        while (++i < length) {
          res = rules[i](values[i])
          if (res.isNone()) {
            return option.none()
          }
          acc[i] = res.get()
        }

        return option.some(f(acc))
      })
    }
  }

  any (mapping) {
    return this.addPattern(function () {
      return option.some(_.spread(mapping)(arguments))
    })
  }

  lens (schema) {
    let keys = _.keys(schema)
    let rules = _.map(keys, key => {
      return new Match()
        .when(schema[key])( option.some )
        .any( option.none )
        .binder
    })

    return mapping => {
      let f = _.spread(mapping)

      // Create the actual pattern.
      let pattern = obj => {
        if (obj === undefined) {
          if (schema === undefined) {
            return option.some(obj)
          }
          return option.none()
        }

        var i       = -1,
            length  = rules.length,
            acc     = Array(length),
            rule    = undefined,
            res     = undefined,
            key     = undefined

        while (++i < length) {
          rule = rules[i]
          key = keys[i]

          res = rule(obj[key])
          if (res.isNone()) {
            return option.none()
          }
          acc[i] = res.get()
        }

        // Results of all the rules.
        return option.some(f(acc))
      }

      return this.addPattern( pattern )
    }
  }

  obj (schema) {
    let keys = _.keys(schema)
    let rules = _.map(keys, key => {
      return new Match()
        .when(schema[key])( option.some )
        .any( option.none )
        .binder
    })

    return mapping => {
      let f = _.spread(mapping)

      // Create the actual pattern.
      let pattern = obj => {
        if (obj === undefined) {
          if (schema === undefined) {
            return option.some(obj)
          }
          return option.none()
        }

        let _keys = _.keys(obj)
        if (_.difference(_keys, keys).length !== 0) {
          return option.none()
        }

        var i       = -1,
            length  = rules.length,
            acc     = Array(length),
            rule    = undefined,
            res     = undefined,
            key     = undefined

        while (++i < length) {
          rule = rules[i]
          key = keys[i]

          res = rule(obj[key])
          if (res.isNone()) {
            return option.none()
          }
          acc[i] = res.get()
        }

        // Results of all the rules.
        return option.some(f(acc))
      }

      return this.addPattern( pattern )
    }
  }
}

module.exports = new Match([])
