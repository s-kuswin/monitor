export interface IAnyObject {
  [key: string]: any
}
export interface ReplaceHandler {
  type: EVENTTYPES
  callback: ReplaceCallback
}

type ReplaceCallback = (data: any) => void

export interface MITOHttp {
  type ?: HTTPTYPE
  method?: string
  url?: string
  status?: number
  isSdkUrl?: boolean
  time?: number
  responseText?: any
  traceId?: string
  reqData?: any
}

export interface MITOXMLHttpRequest extends XMLHttpRequest {
  [key: string]:any,
  mito_xhr?: MITOHttp
}

export type viodFun = () => void

export type ReplaceFlag = { 
  [key in EVENTTYPES]?: boolean 
}
export type Handlers = { 
  [key in EVENTTYPES]?: ReplaceCallback[] 
}

export enum HTTPTYPE {
  XHR = 'xhr'
}
export enum EVENTTYPES {
  XHR = 'xhr'
}

export enum BREADCRUMBTYPES {
  XHR = 'Xhr'
}

export enum HTTP_CODE {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  INTERNAL_EXCEPTION = 500
}
export enum ERRORTYPES {
  UNKNOWN = 'UNKNOWN',
  UNKNOWN_FUNCTION = 'UNKNOWN_FUNCTION',
  JAVASCRIPT_ERROR = 'JAVASCRIPT_ERROR',
  LOG_ERROR = 'LOG_ERROR',
  HTTP_ERROR = 'HTTP_ERROR',
  VUE_ERROR = 'VUE_ERROR',
  REACT_ERROR = 'REACT_ERROR',
  RESOURCE_ERROR = 'RESOURCE_ERROR',
  PROMISE_ERROR = 'PROMISE_ERROR',
  ROUTE_ERROR = 'ROUTE_ERROR'
}

// export interface BreadcrumbPushData {
//   type: BREADCRUMBTYPES,
//   data: R