import assert from 'assert'
import * as confirm from '../src/confirm'

describe('confirm validate:', () => {
  // noEmptyArray函数测试
  describe('noEmptyArray', () => {
    test(' empty array test ', () => {
      assert.strictEqual(confirm.noEmptyArray([]), false)
    })
    test(' object test ', () => {
      assert.strictEqual(confirm.noEmptyArray({}), false)
    })
    test(' null test ', () => {
      assert.strictEqual(confirm.noEmptyArray(null), false)
    })
    test(' true array test ', () => {
      assert.strictEqual(confirm.noEmptyArray([1]), true)
    })
  })
  describe('isObject', () => {
    test(' empty object test ', () => {
      assert.strictEqual(confirm.isObject({}), true)
    })
  })
})