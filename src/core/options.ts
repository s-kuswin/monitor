import { InitOptions } from "../utils/common";
import { transportData } from "./transportData";

export function initOptions(paramsOption:InitOptions = {}) {
  transportData.bindOptions(paramsOption)
}