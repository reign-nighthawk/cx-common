declare let Page:any
declare let App:any
declare let Component:any
declare function getCurrentPages():Array<any>
declare const wx:any
declare const my:any
declare const swan:any
declare const qq:any
declare const tt:any
declare interface IUploadData{
  nonce_str:string
  track_id:number,
  time:number,
  uuid:string,
  path:string,
  event_type:string,
  event_name:string,
  app_user_id?:string,
  sdk_version:number,
  sdk_type:string,
  app_version:string,
  event_params?:Object
  device?:IDevice
}
declare interface IDevice{
  lib:string,
  os_version:string,
  model:string,
  screen_width:string,
  screen_height:string,
  manufacturer:string,
}