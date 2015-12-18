'use strict'

let assert = require('assert')
let match = require('../../commons/match')

describe('Testing match expressions', () => {
  it('should match if expression', () => {
    let f = match
      .when(String, Object)( (s, o) => 'done' )
      .when(String)( s => 'str' )
      .when(Object)( o => 'obj' )
      .binder

    assert.equal(
      f('bob', { name: 'bob' }),
      'done'
    )
    assert.equal(
      f('bob'),
      'str'
    )
    assert.equal(
      f({}),
      'obj'
    )
  })

  //it('should match object correctly', () => {
  //  let f = match
  //    .lens({ title: String })( title => title )
  //    .lens({ name: String, age: Number })( (name, age) => age )
  //    .lens({ name: String })( name => name )
  //    .lens({ age: 7 })( age => age * age )
  //    .lens({ code: 7, date: 'now', reason: String })( (code, date, reason) => {
  //      return reason
  //    })
  //    .binder

  //  assert.equal(
  //    f({ name: 'bob', age: 10 }),
  //    10
  //  )
  //  assert.equal(
  //    f({ title: 'sir' }),
  //    'sir'
  //  )
  //  assert.equal(
  //    f({ name: 'bob' }),
  //    'bob'
  //  )
  //  assert.equal(
  //    f({ age: 7 }),
  //    7 * 7
  //  )
  //  assert.equal(
  //    f({ code: 7, date: 'now', reason: 'failure' }),
  //    'failure'
  //  )
  //})
})
