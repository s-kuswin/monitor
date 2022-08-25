import { transportData } from "../core/transportData";
import { httpTransform } from "../core/transformData";
import { BREADCRUMBTYPES, MITOHttp, HTTP_CODE, ResourceErrorTarget, ERRORTYPES, TriggerConsole} from "../utils/common";
import { ERROR_TYPE_RE, getLocationHref, HTMLElementAsString } from "../utils/helpers";

export const handleEvents = {
  handleHttp(data: MITOHttp, type: BREADCRUMBTYPES): void{
    const isError = data.status === 0 || data.status === HTTP_CODE.BAD_REQUEST || data.status  && data.status > HTTP_CODE.UNAUTHORIZED
    const result = httpTransform(data)
    console.log('navigator' in window, 'sendBeacon' in navigator);

    // 如果是错误选择立即上报
    if(isError) {
      transportData.send(result)
    }
  },
  handleError (ErrorEvent: ErrorEvent):void{
    console.log(ErrorEvent, 'handleError');
    const target = ErrorEvent.target as ResourceErrorTarget
    if(target?.localName) {

      return
    }
    const { message, filename, lineno, colno, error } = ErrorEvent

    let result:any = handleEvents.handleNoErrorInstance(message, filename, lineno, colno)

    result.type = ERRORTYPES.JAVASCRIPT_ERROR
    transportData.send(result)
  },
  handleNoErrorInstance(message: string, filename: string, lineno: number, colno: number) {
    const url = filename || getLocationHref()
    return {
      url,
      message: message,
      level: 1,
      lineno: lineno,
      colno: colno
    }
  },
  handleConsoleError(data: TriggerConsole):void {
    const result = {
      type: ERRORTYPES.LOG_ERROR,
      data: data,
      level: data.level
    }
  
    transportData.send(result)
  },
  // handleHistory(): void
  // handleHashchange(): void
  handleUnhandleRejection(ev: PromiseRejectionEvent): void {
    console.log(ev.reason, 'handleUnhandleRejection');
    
    let data = {
      type: ERRORTYPES.PROMISE_ERROR,
      message: ev.reason.toString(),
      url: getLocationHref(),
      level: 1
    }
    transportData.send(data)
  },
  handleDom(e: any) {
    console.log('handleDom============',e.data.target as HTMLElement);
    const htmlString = HTMLElementAsString(e.data.target as HTMLElement)
    const data = {
      type: BREADCRUMBTYPES.CLICK,
      data: htmlString,
      level: 0
    }
    transportData.send(data)
  }
}