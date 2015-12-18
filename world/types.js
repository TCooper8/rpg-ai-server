'use strict'

let _ = require('lodash')

function TerrainType (props) {
  this.label = props.label
}

let terrainTypes = { }

function Cell (props) {
  this.id = props.id
  this.pos = props.pos
  this.terrain = props.terrain
}

function World (props) {
  this.width = props.width
  this.height = props.height
  this.cells = [ ]
}

World.prototype.setCell = function (pos, cell) {
  pos || (pos = cell.pos)
  this.cells[pos.y][pos.x] = cell
}

World.prototype.getCell = function(y, x) {
  return this.cells[y][x]
}

function Player (props) {
  this.name = props.name
  this.id = props.id
}
