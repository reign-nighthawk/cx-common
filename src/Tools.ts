/**
 * @Description 无归类工具方法
 * @Author tangchenxu
 * @CreateDate 2020/06/10
 */

// 32位随机十六进制数
export function UUID () {
  return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function (c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}