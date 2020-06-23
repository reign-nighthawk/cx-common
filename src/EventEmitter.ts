/**
 * @Description 发布订阅
 * @Author tangchenxu
 * @CreateDate 2020/06/22
 */

export default class EventEmitter {
  private _eventpool:object
  constructor () {
    this._eventpool = {}
  }
  $on (event, callback) {
    this._eventpool[event]
      ? this._eventpool[event].push(callback)
      : (this._eventpool[event] = [callback])
  }
  $emit (event, ...args) {
    this._eventpool[event] && this._eventpool[event].forEach(cb => cb(...args))
  }
  $off (event) {
    if (this._eventpool[event]) {
      delete this._eventpool[event]
    }
  }
  $once (event, callback) {
    this.$on(event, (...args) => {
      callback(...args)
      this.$off(event)
    })
  }
}
