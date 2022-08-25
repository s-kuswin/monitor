import { 
  MITOXMLHttpRequest, 
  EVENTTYPES, 
  ReplaceHandler, 
  ReplaceFlag, 
  Handlers, 
  HTTPTYPE } from "../utils/common";
  import { replaceOld, on, getFunctionName } from "../utils/helpers";
  import { variableTypeDetection } from "../utils/is";
  import { transportData } from "../core/transportData";

export function replace(type: EVENTTYPES) {
  switch (type) {
    case EVENTTYPES.XHR:
      xhrReplace()
      break;
    case EVENTTYPES.ERROR:
      listenError()
      break;
    case EVENTTYPES.CONSOLEERROR:
      consoleErrorReplace()
      break;
    case EVENTTYPES.UNHANDLEDREJECTION:
      unhandledrejectionReplace()
      break;
    case EVENTTYPES.DOM:
      domReplace()
      break;
    default:
      break;
  }
}

export function addReplaceHandler(handle: ReplaceHandler) {
  if(!subscribeEvent(handle)) return
  replace(handle.type as EVENTTYPES)
}

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
        type: HTTPTYPE.XHR
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
        const { status, responseType, response } = this
        this.mito_xhr = this.mito_xhr || {}
        if(this.mito_xhr?.isSdkUrl) return
        this.mito_xhr.reqData = args[0]
        this.mito_xhr.status = status
        //  请求结束后触发
        console.log(this,'this', args);
        if(['', 'json', 'text'].indexOf(responseType) !== -1) {
          this.mito_xhr.responseText = typeof response === 'object' ? JSON.stringify(response) : response
        }
        
        triggerHandlers(EVENTTYPES.XHR, this.mito_xhr)
      })
      
      originSend.apply(this, args)
    }
  })
}

function listenError():void {
  on(
    window, 
    'error',
    function(e: ErrorEvent) {
      triggerHandlers(EVENTTYPES.ERROR, e)
    }
  )
}

function consoleErrorReplace():void {
  if(!('console' in window)) return;
  const logType = 'error'

  if(!(logType in window.console)) return;
  replaceOld(window.console, logType,function(originalConsoleError):Function {
    return function(...args:any[]):void {
      if(originalConsoleError) {
        triggerHandlers(EVENTTYPES.CONSOLEERROR, {args, logType})
        originalConsoleError.apply(window.console, args)
      }
    }
  })
}

function unhandledrejectionReplace():void {
  console.log('unhandledrejection' in window);
  on(window, EVENTTYPES.UNHANDLEDREJECTION, function(ev:any) {
    console.log(ev, 'EVENTTYPES.UNHANDLEDREJECTION');
    triggerHandlers(EVENTTYPES.UNHANDLEDREJECTION, ev)
  })
}

function domReplace():void {
  if(!('document' in window)) return
  on(window.document,'click',function(e:any) {
    triggerHandlers(EVENTTYPES.DOM, {
      type: 'click',
      data: e
    })
  })
}

const replaceFlag: ReplaceFlag= {}
const handlers: Handlers = {}
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