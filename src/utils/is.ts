export const nativeToString = Object.prototype.toString

function isType(type: string) {
  return function(value: any):boolean {
    return nativeToString.call(value) === `[object ${type}]`
  }
}

export const variableTypeDetection = {
  isString: isType('String'),
  isNumber: isType('Number'),
  isBoolean: isType('Boolean'),
  isNull: isType('Null'),
  isObject: isType('Object'),
  isFunction: isType('Function'),
  isArray: isType('Array')
}

