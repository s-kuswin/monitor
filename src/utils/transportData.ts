export class TransportData{
  errorDsn = ''
  trackDsn = ''
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
}

const transportData = new TransportData()
export { transportData }