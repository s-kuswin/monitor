import { addReplaceHandler } from './replace'
import { handleEvents } from './handleEvents'
import { BREADCRUMBTYPES, EVENTTYPES } from "../utils/common";

export function setupReplace():void {
  addReplaceHandler({
    callback: (data) => {
      handleEvents.handleHttp(data, BREADCRUMBTYPES.XHR)
    },
    type: EVENTTYPES.XHR
  })
  addReplaceHandler({
    callback: (data) => {
      handleEvents.handleError(data)
    },
    type: EVENTTYPES.ERROR
  })
  addReplaceHandler({
    callback: (data) => {
      handleEvents.handleUnhandleRejection(data)
    },
    type: EVENTTYPES.UNHANDLEDREJECTION
  })
  addReplaceHandler({
    callback: (data) => {
      handleEvents.handleConsoleError(data)
    },
    type: EVENTTYPES.CONSOLEERROR
  })
  addReplaceHandler({
    callback: (data) => {
      handleEvents.handleDom(data)
    },
    type: EVENTTYPES.DOM
  })
}