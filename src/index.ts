// const handleEvents: {
//   handleHttp(): void
//   handleError(): void
//   handleConsole(): void
//   handleHistory(): void
//   handleHashchange(): void
//   handleUnhandleRejection(): void
// }

import { replaceOld } from "./utils/helpers";
import { MITOXMLHttpRequest, viodFun } from "./utils/common";
import { variableTypeDetection } from "./utils/is";
import { transportData } from "./utils/transportData";

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
      console.log(22);
      
      originOpen.apply(this, args)
    }
  })
  replaceOld(originalXhrProto, 'send',(originSend: Function): VoidFunction => {
    console.log(444);
    
    return function (this:MITOXMLHttpRequest, ...args: any[]):void {
      console.log('loadend' in this,'addEventListener' in this, this);
      
      originSend.apply(this, args)
    }
  })
}

function on() {
  
}

xhrReplace()
