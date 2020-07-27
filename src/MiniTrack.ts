/* eslint-disable prefer-rest-params */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * @Description 全平台埋点SDK
 * @Author tangchenxu
 * @CreateDate 2020/06/09
 */
import { UUID } from './Tools'
import { noEmptyArray, isObject } from './Confirm'
import pkg from '../package.json'

export default class MiniTrack {
  private appKey: string
  private platform: string
  private currentRouter: string
  private currentData: Array<IUploadData> = []
  private identity: string
  private userId: string
  private appVerison: string
  private API: any
  private step = 0
  private serverUrl: string
  private device: IDevice
  constructor (option: { appKey: string; serverUrl: string }) {
    if (!option || !option.appKey || !option.serverUrl) {
      console.log('%cMissing required parameter', 'color:#C0392B')
      return
    }
    this.appKey = option.appKey
    this.serverUrl = option.serverUrl
    this.getPlatform(res => {
      switch (res) {
      case 'wechat_applet':
        this.refactoringPage()
        break
      case 'alipay_applet':
        this.refactoringPage()
        break
      case 'bd_applet':
        this.refactoringPage()
        break
      case 'qq_applet':
        this.refactoringPage()
        break
      case 'byte_applet':
        this.refactoringPage()
        break
      default:
        console.log('%cNo platform matching', 'color:#C0392B')
        break
      }
      res && console.log(`%c${this.platform} MiniTrack Load`, 'color:#2ECC71')
    })
  }
  public login (id: string): void {
    this.userId = id
  }
  public getIdentity (){
    return this.identity
  }
  public trackCustom (event): void {
    this.assemblyData({ event: 'CUSTOM', arg: { event_name: event } })
  }
  private getPlatform (cb): void {
    if (typeof qq !== 'undefined') {
      this.platform = 'qq_applet'
      this.API = qq
    } else if (typeof tt !== 'undefined') {
      this.platform = 'byte_applet'
      this.API = tt
    } else if (typeof wx !== 'undefined') {
      this.platform = 'wechat_applet'
      this.API = wx
    } else if (typeof my !== 'undefined') {
      this.platform = 'alipay_applet'
      this.API = my
    } else if (typeof swan !== 'undefined') {
      this.platform = 'bd_applet'
      this.API = swan
    }
    this.assembleSystemData()
    cb(this.platform)
  }
  private assembleSystemData () {
    this.API.getSystemInfo({
      success: res => {
        this.appVerison = res.version
        this.device = {
          lib: res.platform || '',
          os_version: res.system || '',
          model: res.model || '',
          screen_width: res.screenWidth || '',
          screen_height: res.screenHeight || '',
          manufacturer: res.brand || '',
        }
      },
    })
  }
  private track (event: string): void {
    this.assemblyData({ event })
  }
  private trackAppStart (event: string): void {
    this.assemblyData({
      event,
      callBack: () => {
        this.timeToUpload()
      },
    })
  }
  private trackAppHide (event: string): void {
    this.assemblyData({
      event,
      callBack: () => {
        this.sendRequest()
      },
    })
  }
  private trackError (event, error: string): void {
    let errInfo = error.split('\n')
    if (!noEmptyArray(errInfo)) return
    if (errInfo.length < 3) return
    this.assemblyData({
      event,
      arg: { event_name: errInfo[0], event_params: errInfo[0] + errInfo[1] },
    })
  }
  private trackPageShow (event): void {
    let pages = getCurrentPages()
    pages.length !== 0 && (this.platform === 'byte_applet' ? this.currentRouter = pages[pages.length - 1].__route__ : this.currentRouter = pages[pages.length - 1].route)
    this.assemblyData({ event })
  }
  private trackClick (params): void {
    this.assemblyData({
      event: 'CLICK',
      arg: { event_name: params.event_name, element: params.element },
    })
  }
  private assemblyData<T> (params: {
    event: string
    arg?: { event_name: string; event_params?: string; element?: T }
    callBack?: Function
  }) {
    const tcapData = () => {
      this.step++
      let data: IUploadData = {
        nonce_str: UUID(),
        track_id: this.step,
        time: new Date().getTime(),
        uuid: this.identity,
        ...(this.userId && { app_user_id: this.userId }),
        event_type: params.event,
        event_name: params.arg ? params.arg.event_name : params.event,
        path: this.currentRouter || '',
        sdk_version: +pkg.version.split('.')[2],
        sdk_type: this.platform,
        app_verison: this.appVerison,
        ...(params.arg &&
          params.arg.element && { element: params.arg.element }),
        ...(params.arg &&
          params.arg.event_params && { event_params: params.arg.event_params }),
        ...(this.device && { device: this.device }),
      }
      this.currentData.push(data)
      params.callBack && params.callBack()
    }
    this.identity
      ? tcapData()
      : this.setIdentity(() => {
        tcapData()
      })
  }
  private setIdentity (cb: Function): void {
    this.getCache('lq-track-identity', res => {
      const recordIdentity = () => {
        this.identity = UUID()
        this.setCache('lq-track-identity', this.identity)
      }
      res ? (this.identity = res) : recordIdentity()
      cb(res)
    })
  }
  private cleanUpCache (key): void {
    this.API.removeStorage({
      key: key,
    })
  }
  private setCache (key: string, data: any): void {
    this.API.setStorage({
      key: key,
      data: data,
    })
  }
  private getCache (key: string, callBack: Function): void {
    this.API.getStorage({
      key: key,
      success (res) {
        callBack(res.data)
      },
      fail (err) {
        callBack(null)
      },
    })
  }
  private timeToUpload (): void {
    const timetask = () => {
      if (noEmptyArray(this.currentData)) {
        this.sendRequest()
      }
      return timetask
    }
    setInterval(timetask(), 3000)
  }
  private sendRequest () {
    let data = this.currentData
    this.currentData = []
    this.API.request({
      url: `${this.serverUrl}/${this.appKey}/event/${this.platform}`,
      data: data,
      method: 'POST',
    })
  }
  private getMethods (option) {
    let mpHook = {
      data: 1,
      onLoad: 1,
      onShow: 1,
      onReady: 1,
      onPullDownRefresh: 1,
      onReachBottom: 1,
      onShareAppMessage: 1,
      onPageScroll: 1,
      onResize: 1,
      onTabItemTap: 1,
      onHide: 1,
      onUnload: 1,
    }
    let methods = []
    for (let m in option) {
      if (typeof option[m] === 'function' && !mpHook[m]) {
        methods.push(m)
      }
    }
    return methods
  }
  private click_proxy (option, method,isCom = false) {
    let oldFunc = option[method]
    let self = this
    option[method] = function (...args) {
      let prop = {},
        type = ''

      if (isObject(args[0])) {
        let target = args[0].currentTarget || {}
        let dataset = target.dataset || {}
        type = args[0]['type']
        prop['element_id'] = target.id
        prop['element_content'] = dataset['content']
      }
      if (type && self.isClick(type)) {
        let params = {
          event_name: isCom ? `c_${method}` : method,
          element: prop,
        }
        self.trackClick(params)
      }
      return oldFunc && oldFunc.apply(this, args)
    }
  }
  private isClick (type) {
    let mpTaps = {
      tap: 1,
      longpress: 1,
      longtap: 1,
      submit: 1,
    }
    return !!mpTaps[type]
  }
  private mp_proxy (option, method, event): void {
    const self = this
    let oldFunc = option[method]
    option[method] = function () {
      switch (method) {
      case 'onShow':
        self.trackPageShow(event)
        break
      case 'onError':
        self.trackError(event, arguments[0])
        break
      case 'onHide':
        self.trackAppHide(event)
        break
      case 'onLaunch':
        self.trackAppStart(event)
        break
      default:
        self.track(event)
        break
      }
      if(oldFunc){
        return oldFunc.apply(this, arguments)
      }else{
        return {}
      }
    }
  }
  private refactoringPage (): void {
    const _Page = Page
    const _App = App
    const _Component = Component
    const self = this
    let data = {}
    App = function (option) {
      self.mp_proxy(option, 'onLaunch', 'START')
      self.mp_proxy(option, 'onHide', 'CLOSE')
      self.mp_proxy(option, 'onError', 'ERROR')
      _App.apply(this, arguments)
    }
    Page = function (page) {
      let methods = self.getMethods(page)
      if (noEmptyArray(methods)) {
        for (let i = 0, len = methods.length; i < len; i++) {
          self.click_proxy(page, methods[i])
        }
      }
      self.mp_proxy(page, 'onShow', 'VIEW')
      self.mp_proxy(page, 'onShareAppMessage', 'SHARE')
      _Page.apply(this, arguments)
    }
    Component = function (option) {
      try {
        let methods = self.getMethods(option.methods)
        if (methods) {
          for (let i = 0, len = methods.length; i < len; i++) {
            self.click_proxy(option.methods, methods[i],true)
          }
        }
        _Component.apply(this, arguments)
      } catch (e) {
        _Component.apply(this, arguments)
      }
    }
  }
}
