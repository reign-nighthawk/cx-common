interface IWebInit{
  Router?:any,
  Vue?:any,
  appKey:string,
  serverUrl:string,
  undoStart?:boolean
  udfIdentity?:string
  platform?:string
}
interface Window {
  addHistoryListener: (T,U)=>{};
}