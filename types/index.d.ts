import Vue, { VueConstructor } from 'vue'

export interface VueAsyncable {
  Asyncable: object
  promisify (fn: Function | object | Promise<all>, context?: object): Promise<all>
  applyComponentAsyncData (Component: VueConstructor | object, data: object): void
  ensureAsyncData (Component: Array<VueConstructor | object>, context?: object): Promise<all>
  ensureComponentAsyncData (Component: VueConstructor | object, context?: object): Promise<all>
  hasAsyncPreload (Component: VueConstructor | object): Boolean | undefined
  sanitizeComponent (Component: VueConstructor | object): object
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    asyncData? (context?: object): Promise<any> | object | Funciton
    fetch? (context?: object): Promise<void> | void;
  }
}
