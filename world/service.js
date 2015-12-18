'use strict'

let libuuid = require('node-uuid')
let types = require('./types')

let Player = types.Player
let World = types.World

let world = new World({
  width: 50,
  height: 50
})

let players = { }
let units = { }

let onPlayerJoin = playerProps => {
  // Generate an id for the player.
  playerProps.id = libuuid()
  let player = new Player(playerProps)

  // Add the player to the players
  players[player.id] = player
}

let handleMoveUnit = action => {
  let unitId = action.unitId
  let src = action.srcPos
  let dst = action.dstPos

  let unit = units[unitId]
  let _src = unit.pos

  // Make sure the positions match up.
  if (_src.y !== src.y || _src.x !== src.x) {
    return {
      error: Error(sprintf(
        'InvalidSrcPos: Unit %s src %j does not match %j',
        unitId,
        src,
        _src
      ))
    }
  }

  // Move the unit.

  let srcCell = world.getCell(pos.y, pos.x)
  let dstCell = world.getCell(dst.y, dst.x)

  let dx = dst.x - src.x
  let dy = dst.y - src.y
  let dz = dst.z - src.z

  if (dx !== 1 || dx !== 1) {
    return {
      error: Error(
        'InvalidMove: Cannot move more than 1 space at a time'
      )
    }
  }
}

let onUpdate = (playerId, actions) => {
  _.each(actions, action => {
    let res = undefined

    switch (action.type) {
    case 'moveUnit':
      res = handleMoveUnit(action)
      if (!res.success) {
        return res
      }

    default:
      // Reject this action to the player.
      return {
        success: false,
        error: 'Unmapped action type ' + action.type
      }
    }
  })
}
