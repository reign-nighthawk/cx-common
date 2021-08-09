/* eslint-disable no-unexpected-multiline */
/* eslint-disable prefer-rest-params */
/**
 * @Description 网页埋点SDK
 * @Author tangchenxu
 * @CreateDate 2020/06/23
 */
import { UUID,getSystemInfo } from './Tools'
import { noEmptyArray } from './Confirm'
import EventEmitter from './EventEmitter'
import pkg from '../package.json'
const emit = new EventEmitter()
const WebTrack = {
  currentRouter: '',
  currentData: [],
  identity: '',
  userId: '',
  step: 0,
  platform:'web',
  appVerison:'',
  device:{},
  serverUrl:'',
  appKey:'',
  init: function (params:IWebInit) {
    if(!params || !params.appKey || !params.serverUrl){
      console.log('%cMissing required parameter', 'color:#C0392B')
      return
    }
    console.log('%cWebTrack Load', 'color:#2ECC71')
    this.appKey = params.appKey
    this.serverUrl = params.serverUrl
    params.platform && (this.platform = params.platform)
    if(params.Vue){
      this.vueTcap(params)
    }else{
      this.reactTcap(params)
    }
  },
  login (userId){
    this.userId = userId
  },
  reactTcap:function (params){
    this.router_proxy()
    this.prepareData(()=>{
      this.trackAppStart(params)
    })
    window.onerror = (message, file, line, column, errorObject) => {
      this.trackError(errorObject)
    }
  },
  vueTcap:function (params){
    // this.deepWatch(params.App)
    this.router_proxy()
    this.prepareData(()=>{
      this.trackAppStart(params)
    })
    params.Router.beforeEach((to, from, next) => {
      if( typeof to.matched[0].components.default === 'function'){
        if(to.matched[0].components.default.toString().indexOf('Promise.all') > -1){
          to.matched[0].components.default().then((res)=>{
            this.method_proxy(res.default)
          })
        }else{
          to.matched[0].components.default(res=>{
            this.method_proxy(res.default)
          })
        }
      }else{
        this.method_proxy(to.matched[0].components.default)
      }
      next()
    })
    params.Vue.config.errorHandler = err => {
      console.error(err)
      this.trackError(err)
    }
  },
  router_proxy: function (){
    const self = this
    window.addHistoryListener = this.addHistoryMethod('historychange')
    window.history.pushState = this.addHistoryMethod('pushState')
    window.history.replaceState = this.addHistoryMethod('replaceState')
    window.addHistoryListener('history', function () {
      self.currentRouter = window.location.href
      self.trackPageShow()
    })
    window.addEventListener('popstate', function () {
      self.currentRouter = window.location.href
      self.trackPageShow()
    })
  },
  addHistoryMethod:function (name){
    if (name === 'historychange') {
      return function (name, fn) {
        emit.$on('LQ_HISTORYCHANGE',fn)
      }
    } else if (name === 'pushState' || name === 'replaceState') {
      const method = window.history[name]
      return function () {
        method.apply(this, arguments)
        emit.$emit('LQ_HISTORYCHANGE')
      }
    }
  },
  method_proxy:function (com){
    const self = this
    this.getVueMethods(com)
    if(com.components){
      // 该页面有组件
      for (const key in com.components) {
        // eslint-disable-next-line no-prototype-builtins
        const element = com.components[key]
        if(element.methods){
          // 该组件有方法
          for (const k in element.methods) {
            const oldFunc = element.methods[k]
            element.methods[k] = function () {
              if (arguments && arguments[0] && arguments[0].type === 'click') {
                const prop = {}
                prop['element_id'] = arguments[0].srcElement.id
                prop['element_content'] = arguments[0].srcElement.innerText
                const params = {
                  event_name: `c_${k}`,
                  element: prop,
                }
                self.trackClick(params)
              }
              return oldFunc && oldFunc.apply(this,arguments)
            }
          }
        }
      }
    }
  },
  prepareData:function (cb){
    this.currentRouter = window.location.href
    getSystemInfo({
      success:(res)=>{
        this.appVerison = res.version
        this.device = {
          lib: res.platform || '',
          screen_width: res.screenWidth || '',
          screen_height: res.screenHeight || '',
        }
        cb()
      },
    })
  },
  deepWatch:function (app){
    const self = this
    if(app.watch){
      if(app.watch.$route){
        const oldHandler = app.watch.$route.handler
        app.watch.$route.deep = true
        app.watch.$route.handler = function (){
          self.currentRouter = window.location.href
          self.trackPageShow()
          return oldHandler && oldHandler.applay(this,arguments)
        }
      }else{
        app.watch.$route = {
          handler:function (){
            self.currentRouter = window.location.href
            self.trackPageShow()
          },
          deep:true,
        }
      }
    }else{
      app.watch = {
        $route:{
          handler:function (){
            self.currentRouter = window.location.href
            self.trackPageShow()
          },
          deep:true,
        },
      }
    }
  },
  getVueMethods:function (component) {
    const methods = component.methods
    const self = this
    for (const key in methods) {
      // eslint-disable-next-line no-prototype-builtins
      if (methods.hasOwnProperty(key)) {
        const oldFunc = methods[key]
        methods[key] = function () {
          if (arguments && arguments[0] && arguments[0].type === 'click') {
            const prop = {}
            prop['element_id'] = arguments[0].srcElement.id
            prop['element_content'] = arguments[0].srcElement.innerText
            const params = {
              event_name: key,
              element: prop,
            }
            self.trackClick(params)
          }
          return oldFunc && oldFunc.apply(this, arguments)
        }
      }
    }
  },
  setIdentity: function (cb) {
    const recordIdentity = () => {
      this.identity = UUID()
      window.localStorage.setItem('lq-track-web-identity', this.identity)
    }
    const identity = window.localStorage.getItem('lq-track-web-identity')
    identity ? (this.identity = identity) : recordIdentity()
    cb(identity)
  },     
  trackAppStart: function (params) {
    if(params.undoStart){
      params.udfIdentity && (this.identity = params.udfIdentity)
      this.currentRouter = window.location.href
      this.trackPageShow(()=>{
        this.timeToUpload()
      })
    }else{
      this.assemblyData({
        event: 'START',
        callBack: () => {
          this.currentRouter = window.location.href
          this.trackPageShow(()=>{
            this.timeToUpload()
          })
        },
      })
    }
  },
  trackCustom (eventName,eventParams): void {
    this.assemblyData({ event: 'CUSTOM', arg: { event_name: eventName ,...(eventParams && {event_params:eventParams}) } })
  },
  trackPageShow: function (callBack) {
    this.assemblyData({ event:'VIEW' })
    callBack && callBack()
  },
  trackClick: function (params) {
    this.assemblyData({
      event: 'CLICK',
      arg: { event_name: params.event_name, element: params.element },
    })
  },
  trackError: function (error) {
    const errInfo = error.stack.split('\n')
    if (!noEmptyArray(errInfo)) return
    if (errInfo.length < 2) return
    this.assemblyData({
      event:'ERROR',
      arg: { event_name: errInfo[0], event_params: errInfo[0] + errInfo[1] },
    })
  },
  assemblyData: function (params) {
    const tcapData = () => {
      this.step++
      const data = {
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
  },
  timeToUpload: function () {
    const timetask = () => {
      if (noEmptyArray(this.currentData)) {
        this.sendRequest()
      }
      return timetask
    }
    setInterval(timetask(), 3000)
  },
  sendRequest: function () {
    const data = this.currentData
    this.currentData = []
    const httpRequest = new XMLHttpRequest()
    httpRequest.open('POST', this.serverUrl, true)
    httpRequest.setRequestHeader('Content-type', 'application/json')
    httpRequest.send(JSON.stringify(data))
  },
}
export default WebTrack