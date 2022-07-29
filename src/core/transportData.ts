import { InitOptions } from '../utils/common';
import { Queue } from '../utils/queue';
export class TransportData{
  errorDsn = ''
  trackDsn = ''
  queue: Queue
  constructor() {
    this.queue = new Queue
  }
  bindOptions(options: InitOptions = {}):void {
    const { trackDsn, errorDsn } = options
    this.errorDsn = errorDsn || ''
    this.trackDsn = trackDsn || ''
  }
  isSdkTransportUrl(targetUrl: string):boolean {
    let isSdkDsn = false
    if(this.errorDsn && targetUrl.indexOf(this.errorDsn) !== - 1) {
      isSdkDsn = true
    }
    if(this.trackDsn && targetUrl.indexOf(this.trackDsn) !== - 1) {
      isSdkDsn = true
    }
    return isSdkDsn
  }
  sendBeacon(data:any, url:string):void {
    const requestFun = () => {
      navigator.sendBeacon(url,JSON.stringify(data))
    }
    this.queue.addFn(requestFun)
  }
  imgRequest(data:any, url:string):void {
    const requestFun = () => {
      let img = new Image()
      const spliceStr = url.indexOf('?') === -1 ? '?' : '&'
      img.src = `${url}${spliceStr}data=${encodeURIComponent(JSON.stringify(data))}`
    }
    this.queue.addFn(requestFun)
  }
  send(data: any):void {
    if('navigator' in window && 'sendBeacon' in navigator) {
      this.sendBeacon(data, this.errorDsn)
      return
    }
    this.imgRequest(data, this.errorDsn)
  }
}

const transportData = new TransportData()
export { transportData }