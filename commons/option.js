'use strict'

let none = undefined
let somef = undefined
let optionf = undefined

class Option {
  constructor () {
  }

  map (mapping) {
    if (this.isSome()) {
      return somef(mapping(this.get()))
    }
    return none
  }

  isSome() {
    throw new Error('Not implemented')
  }

  isNone() {
    throw new Error('Not implemented')
  }
}

class Some extends Option {
  constructor (val) {
    super()
    this.get = () => val
  }

  isSome () {
    return true
  }

  isNone () {
    return false
  }
}

class None extends Option {
  constructor () {
    super()
  }

  get get() {
    throw new Error('Cannot call get from None instance')
  }

  isSome() {
    return false
  }

  isNone() {
    return true
  }
}

somef = val => new Some(val)

optionf = val =>
  val === undefined
  ? none :
    somef(val)

none = new None()

module.exports = optionf

optionf.get = option =>
  option.get()

optionf.map = mapping => option =>
  option.isNone()
  ? option :
    somef(mapping(option.get()))

optionf.iter = action => option => {
  if (option.isSome()) {
    action(option.get())
  }
}

optionf.none = () => none

optionf.some = somef

optionf.toArray = option =>
  option.isNone()
  ? [] :
    [ option.get() ]
