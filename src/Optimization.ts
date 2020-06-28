/* eslint-disable prefer-rest-params */
/**
 * @Description 性能优化相关
 * @Author tangchenxu
 * @CreateDate 2020/06/22
 */

/**
 * 防抖函数
 * @param {*} fn 回调函数
 * @param {*} time 延迟执行毫秒数
 * @param {*} immediate true - 立即执行， false - 延迟执行
 */
export const debounce = (fn, time = 500, immediate = true) => {
  let timer = null
  return function () {
    const context = this
    const args = arguments
    timer && clearTimeout(timer)
    if (immediate) {
      const callNow = !timer
      timer = setTimeout(() => {
        timer = null
      }, time)
      callNow && fn.apply(context, args)
    } else {
      timer = setTimeout(() => {
        fn.apply(context, args)
      }, time)
    }
  }
}
/**
 * 节流函数
 * @param {*} fn 回调函数
 * @param {*} time 延迟执行毫秒数
 * @param {*} immediate true - 立即执行， false - 延迟执行
 */
export const throttle = (fn, time = 500, immediate = true) => {
  let previous = 0
  let canRun
  return function () {
    const context = this
    const args = arguments
    if (immediate) {
      const now = Date.now()
      if (now - previous > time) {
        fn.apply(context, args)
        previous = now
      }
    } else {
      if (!canRun) {
        canRun = setTimeout(() => {
          canRun = null
          fn.apply(context, args)
        }, time)
      }
    }
  }
}