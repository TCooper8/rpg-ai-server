'use strict'

let _       = require('lodash')
let amqp    = require('amqplib')
let commons = require('../commons')

let match   = commons.match
let option  = commons.option
let sprintf = commons.sprintf

let amqpUrlSchema = {
  host: String,
  port: Number,
  uname: String,
  pass: String,
  vhost: String
}

let mkAmqpUrl = match
  .obj(amqpUrlSchema)( (host, port, uname, pass, vhost) => {
    return option(sprintf(
      'amqp://%s:%s@%s:%s/%s',
      uname,
      pass,
      host,
      port,
      vhost
    ))
  })
  .lens(amqpUrlSchema)( () => {
    let msg = sprintf(
      'Extra keys found in amqp config,',
      _.difference(_.keys(obj), _.keys(amqpUrlSchema))
    )
    throw Error(msg)
  })
  .any( value => {
    let msg = sprintf(
      'Expected valid structure of %j, but got %j',
      _.mapValues(amqpUrlSchema, f => f.name),
      value
    )
    throw Error(msg)
  })
  .binder

let EventBus = name => {
  let self = { }
  let connInfos = { }

  self.connect = match
    .when(String, mkAmqpUrl)( (eventType, url) => {
      console.log('Connecting to %s', url)

      return amqp.connect(url)
      .then( conn => conn.createChannel()
        .then( chan => {
          let info = {
            conn: conn,
            chan: chan
          }
          connInfos[eventType] = info
        })
      )
    })
    .binder

  return self

  //self.connect = (props) => {
  //  // Create the url.
  //  let url = mkAmqpUrl(props)

  //  // Connect to amqp.
  //  return amqp.connect(url)
  //  .then( conn => conn.createChannel()
  //    .then( chan => {
  //    })
  //  )
  //}
}

let bus = EventBus('bob')
bus.connect('auth.login', {
  host: 'localhost',
  port: 5672,
  uname: 'guest',
  pass: 'guest',
  vhost: ''
})
.then( () => console.log('connected!') )
