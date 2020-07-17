/**
 * @Description 验证相关
 * @Author tangchenxu
 * @CreateDate 2020/06/11
 */

// 判断是否是非空数组
export const noEmptyArray = (arr) => {
  if (arr === undefined || arr === null) {
    return false
  } else {
    return (Array.isArray(arr) && arr.length > 0)
  }
}

// 判断是否是对象
export const isObject = (obj) => {
  if (obj === undefined || obj === null) {
    return false
  } else {
    return (toString.call(obj) === '[object Object]')
  }
}