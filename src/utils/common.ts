export interface IAnyObject {
  [key: string]: any
}

export interface MITOHttp {
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