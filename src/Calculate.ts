/* eslint-disable no-empty */
/**
 * 加法运算
 * 
 * @param {Number} a
 * @param {Number} b
 */

/* 提示：因为原生js会出现类似：
0.1+0.2=0.30000000000000004 
1.3+1.1=2.4000000000000004
的情况。所以共同乘以10的n次方，n为a、b两个数小数部分的最大长度值，这样就能一起化为整数运算
*/
export const add = (a, b) => {
  if (!a || !b) {
    console.log('Error: 加法需要传入2个数字')
    return '加法需要传入2个数字'
  }
  let c = 0 // a的小数部分长度
  let d = 0 // b的小数部分长度
  try {
    c = a.toString().split('.')[1].length
  } catch (f) { }
  try {
    d = b.toString().split('.')[1].length
  } catch (f) { }
  
  const e = 10 ** Math.max(c, d) //保证a、b为整数的最小10次幂
  return (a * e + b * e) / e
}

/**
 * 减法运算
 * 
 * @param {Number} a
 * @param {Number} b
 */

/* 提示：因为原生js会出现类似：
0.3-0.1=0.19999999999999998
1.3-1=0.30000000000000004
的情况。所以共同乘以10的n次方，n为a、b两个数小数部分的最大长度值，这样就能一起化为整数运算
*/
export const sub = (a, b) => {
  if (!a || !b) {
    console.log('Error: 减法运算需要传入2个数字')
    return '减法运算需要传入2个数字'
  }
  let c = 0 // a的小数部分长度
  let d = 0 // b的小数部分长度
  try {
    c = a.toString().split('.')[1].length
  } catch (f) { }
  try {
    d = b.toString().split('.')[1].length
  } catch (f) { }

  const e = 10 ** Math.max(c, d) //保证a、b为整数的最小10次幂
  return (a * e - b * e) / e
}

/**
 * 乘法运算
 * 
 * @param {Number} a
 * @param {Number} b
 */

/* 提示：因为原生js会出现类似：
1.3*3=3.9000000000000004
5.3*9=47.699999999999996
的情况。所以共同乘以10的n次方，n为a、b两个数小数部分的最大长度值，这样就能一起化为整数运算
*/
export const mul = (a, b) => {
  if (!a || !b) {
    console.log('Error: 乘法运算需要传入2个数字')
    return '乘法运算需要传入2个数字'
  }
  let c = 0 // a的小数部分长度
  let d = 0 // b的小数部分长度
  try {
    c = a.toString().split('.')[1].length
  } catch (f) { }
  try {
    d = b.toString().split('.')[1].length
  } catch (f) { }

  return (Number(a.toString().replace('.', '')) * Number(b.toString().replace('.', ''))) / (10 ** (c + d))
}

/**
 * 除法运算
 * 
 * @param {Number} a
 * @param {Number} b
 */

/* 提示：因为原生js会出现类似：
0.3/0.1=2.9999999999999996
0.6/3=0.19999999999999998
的情况。所以共同乘以10的n次方，n为a、b两个数小数部分的最大长度值，这样就能一起化为整数运算
*/
export const div = (a, b) => {
  if (!a || !b) {
    console.log('Error: 减法运算需要传入2个数字')
    return '减法运算需要传入2个数字'
  }
  let c = 0 // a的小数部分长度
  let d = 0 // b的小数部分长度
  try {
    c = a.toString().split('.')[1].length
  } catch (f) { }
  try {
    d = b.toString().split('.')[1].length
  } catch (f) { }

  const fenzi = Number(a.toString().replace('.', '')) * (10 ** (c + d))
  const fenmu = Number(b.toString().replace('.', '')) * (10 ** (c + d))
  return fenzi / fenmu / (10 ** (c - d))
}