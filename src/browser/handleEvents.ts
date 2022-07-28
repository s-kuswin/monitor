import { transportData } from "../core/transportData";
import { httpTransform } from "../core/transformData";
import { BREADCRUMBTYPES, MITOHttp, HTTP_CODE, ResourceErrorTarget, ERRORTYPES} from "../utils/common";
import { ERROR_TYPE_RE, getLocationHref } from "../utils/helpers";

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
    let name: string | ERRORTYPES = ERRORTYPES.UNKNOWN
    const url = filename || getLocationHref()
    let msg = message
    const matches = message.match(ERROR_TYPE_RE)
    console.log(matches,'matches');
    if(matches && matches[1]) {
      name = matches[1]
      msg = matches[2]
    }

    const element = {
      url,
      line: lineno,
      col: colno
    }
    
    return {
      url,
      name,
      message: msg,
      level: 1,
      stack: [element]
    }
  }
  // handleConsole(): void
  // handleHistory(): void
  // handleHashchange(): void
  // handleUnhandleRejection(): void
}