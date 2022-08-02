import { MITOHttp, ERRORTYPES, TriggerConsole } from "../utils/common";
import { fromHttpStatus } from "../utils/httpStatus";
import { getLocationHref } from "../utils/helpers";
import { transportData } from "./transportData";

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