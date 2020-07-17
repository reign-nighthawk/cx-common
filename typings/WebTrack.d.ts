interface IWebInit{
  Router?:any,
  Vue?:any,
  appKey:string,
  serverUrl:string
  ReactRouter?:any
}
interface Window {
  addHistoryListener: (T,U)=>{};
}