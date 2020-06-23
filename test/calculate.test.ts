import assert from 'assert'
import * as Calculate from '../src/Calculate'

describe('Calculate validate:', () => {
  // noEmptyArray函数测试
  describe('add', () => {
    test(' add test ', () => {
      assert.strictEqual(Calculate.add(0.1,0.2), 0.3)
    })
  })
  describe('sub', () => {
    test(' sub test ', () => {
      assert.strictEqual(Calculate.sub(0.3,0.1), 0.2)
    })
  })
  describe('mul', () => {
    test(' mul test ', () => {
      assert.strictEqual(Calculate.mul(1.3,3), 3.9)
    })
  })
  describe('div', () => {
    test(' div test ', () => {
      assert.strictEqual(Calculate.div(0.6,3), 0.2)
    })
  })
})