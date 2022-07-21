import { viodFun } from "./common";

export class Queue {
  private stack:any[] = []
  private micro:Promise<void> | undefined
  private isFlushing = false
  constructor() {
    if(!('Promise' in window)) return
    this.micro = Promise.resolve()
  }

  addFn(fn: viodFun):void {
    if(typeof fn !== 'function') return
    if(!('Promise' in window)){
      fn()
      return
    }
    console.log(fn, 'fn');
    
    this.stack.push(fn)
    if(!this.isFlushing) {
      this.isFlushing = true
      this.micro?.then(() => this.flushStack())
    }
  }
  flushStack():void {
    const temp = this.stack.slice(0)
    this.stack.length = 0
    this.isFlushing = false    
    for(let i = 0; i < temp.length; i++) {
      temp[i]()
      console.log(temp[i]);
    }
  }
}