import MiniTrack from './MiniTrack'
import WebTrack from './WebTrack'
import EventEmitter from './EventEmitter'
import * as Tools from './Tools'
import * as Confirm from './Confirm'
import * as Optimization from './Optimization'
import * as Calculate from './Calculate'
const exports = {
  MiniTrack:MiniTrack,
  EventEmitter:EventEmitter,
  WebTrack:WebTrack,
  ...Tools,
  ...Confirm,
  ...Optimization,
  ...Calculate,
}
if(typeof module !== 'undefined') {
  module.exports = exports
}
else {
  window['lq-common'] = exports
}
