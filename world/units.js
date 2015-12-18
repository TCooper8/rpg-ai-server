'use strict'

let commons = require('../commons')

function Unit (props) {
  this.pos = props.pos
  this.maxHealth = props.maxHealth
  this.health = commons.defaultArg(props.health, props.maxHealth)
}
