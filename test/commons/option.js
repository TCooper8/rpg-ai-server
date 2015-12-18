'use strict'

let assert = require('assert')
let option = require('../../commons/option')

describe('Testing option methods', () => {
  it('should get correctly', () => {
    assert.equal(
      option(5).get(),
      5
    )
  })

  it('should map some correctly', () => {
    assert.equal(
      option(5).map( i => i * i ).get(),
      25
    )
  })

  it('should map none correctly', () => {
    assert.equal(
      option(undefined).map( i => i * i ),
      option.none()
    )
  })
})
