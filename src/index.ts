import { replaceOld, on, getFunctionName, getLocationHref } from "./utils/helpers";
import { MITOXMLHttpRequest, EVENTTYPES, BREADCRUMBTYPES, MITOHttp, ReplaceHandler, ReplaceFlag, Handlers, HTTP_CODE, ERRORTYPES } from "./utils/common";
import { variableTypeDetection } from "./utils/is";
import { transportData } from "./utils/transportData";
import { fromHttpStatus, SpanStatus } from "./utils/httpStatus";

const handleEvents = {
  handleHttp(data: MITOHttp, type: BREADCRUMBTYPES): void{
    const isError = data.status === 0 || data.status === HTTP_CODE.BAD_REQUEST || data.status  && data.status > HTTP_CODE.UNAUTHORIZED
    const result = httpTransform(data)

  }
  // handleError(): void
  // handleConsole(): void
  // handleHistory(): void
  // handleHashchange(): void
  // handleUnhandleRejection(): void
}

const replaceFlag: ReplaceFlag= {}
const handlers: Handlers = {}

console.log(window, 'XMLHttpRequest' in window);
function xhrReplace(): void {
  if(!('XMLHttpRequest' in window)) return;

  const originalXhrProto = XMLHttpRequest.prototype
  replaceOld(originalXhrProto, 'open',(originOpen: Function): VoidFunction => {
    return function (this:MITOXMLHttpRequest, ...args: any[]):void {
      // console.log(args,this);
      const url = args[1]

      this.mito_xhr = {
        method: variableTypeDetection.isString(args[0]) ? args[0].toUpperCase() : args[0],
        url: args[1],
      }

      if(this.mito_xhr.method === 'POST' && transportData.isSdkTransportUrl(url)) {
        this.mito_xhr.isSdkUrl = true
      }
      
      originOpen.apply(this, args)
    }
  })
  replaceOld(originalXhrProto, 'send',(originSend: Function): VoidFunction => {
    return function (this:MITOXMLHttpRequest, ...args: any[]):void {
      console.log('loadend' in this,'addEventListener' in this, this);
      on(this, 'loadend', function(this: MITOXMLHttpRequest) {
        this.mito_xhr = this.mito_xhr || {}
        if(this.mito_xhr?.isSdkUrl) return
        this.mito_xhr.reqData = args[0]
        //  请求结束后触发
        triggerHandlers(EVENTTYPES.XHR, this.mito_xhr)
      })
      
      originSend.apply(this, args)
    }
  })
}
// 触发回调
export function triggerHandlers(type: EVENTTYPES, data: any):void {
  if(!type || !handlers[type]) return
  handlers[type]?.forEach(callback => {
    try{
      callback(data)
    }catch (e) {
      console.error(`重写事件triggerHandlers的回调函数发生错误\nType:${type}\nName: ${getFunctionName(callback)}\nError: ${e}`);
    }
  })
}


export function replace(type: EVENTTYPES) {
  switch (type) {
    case EVENTTYPES.XHR:
      xhrReplace()
      break;
    default:
      break;
  }
}

export function addRaplaceHandler(handle: ReplaceHandler) {
  if(!subscribeEvent(handle)) return
  replace(handle.type as EVENTTYPES)
}

export function subscribeEvent(handler: ReplaceHandler): boolean {
  if(!handler || getFlag(handler.type)) return false
  setFlag(handler.type, true)
  handlers[handler.type] = handlers[handler.type] || []
  handlers[handler.type]?.push(handler.callback)
  return true
}

export function getFlag(replaceType: EVENTTYPES):boolean {
  return replaceFlag[replaceType] ? true : false
}
export function setFlag(replaceType: EVENTTYPES, isSet:boolean):void {
  if(replaceFlag[replaceType]) return

  replaceFlag[replaceType] = isSet
}

export function httpTransform(data: MITOHttp){
  let message = ''
  const { method, traceId, type, status } = data
  const name = `${type}--${method}`
  if(status === 0) {
    message = 'http请求失败，失败原因:超时'
  } else {
    message = fromHttpStatus(status)
  }

  return {
    type: ERRORTYPES.HTTP_ERROR,
    url: getLocationHref(),
    message,
    name,
    request: {
      httpType: type,
      traceId,
      method,
      url: data.url,
      data: data.reqData || ''
    },
    response: {
      status,
      data: data.responseText
    }
  }
}


function setupReplace():void {
  addRaplaceHandler({
    callback: (data) => {
      handleEvents.handleHttp(data, BREADCRUMBTYPES.XHR)
    },
    type: EVENTTYPES.XHR
  })
}

setupReplace()
