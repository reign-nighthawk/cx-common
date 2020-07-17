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

// H5获取系统信息
export function getSystemInfo (params){
  const u = navigator.userAgent
  const lu = u.toLowerCase()
  const res:any = {}
  // 判断浏览器类型和版本
  if (lu.indexOf('msie') >= 0) {
    //ie
    const ver = lu.match(/msie ([\d.]+)/)[1]
    res.version = `IE${ver}`
  }
  else if (lu.indexOf('firefox') >= 0) {
    //firefox
    const ver = lu.match(/firefox\/([\d.]+)/)[1]
    res.version = `Firefox${ver}`
  }
  else if (lu.indexOf('chrome') >= 0) {
    //Chrome
    const ver = lu.match(/chrome\/([\d.]+)/)[1]
    res.version = `Chrome${ver}`
  }
  else if (lu.indexOf('opera') >= 0) {
    //Opera
    const ver = lu.match(/opera.([\d.]+)/)[1]
    res.version = `Opera${ver}`
  }
  else if (lu.indexOf('safari') >= 0) {
    //Safari
    const ver = lu.match(/version\/([\d.]+)/)[1]
    res.version = `Safari${ver}`
  } else{
    // 未知浏览器
    res.version = 'unknow0.0.0'
  }
  //  设备类型,Android,IOS,PC
  if(u.indexOf('Android') > -1 || u.indexOf('Adr') > -1){
    // andriod终端
    res.platform = 'android'
  }else if(u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
    res.platform = 'ios'
  }else{
    res.platform = 'pc'
  }
  // 屏幕宽高
  res.screenWidth = window.screen.width
  res.screenHeight = window.screen.height
  params.success(res)
}