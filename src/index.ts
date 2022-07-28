import { setupReplace } from "./browser/load";
import { transportData } from "./core/transportData";
import { InitOptions } from './utils/common';

export function monitorInit(options: InitOptions = {}):void {
  setupReplace()
  transportData.bindOptions(options)
}