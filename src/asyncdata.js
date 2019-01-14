/*
 * vue-asyncable
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * Some functions was imported from nuxt.js/lib/app/utils.js
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import Vue from 'vue'
import { noopData } from './utils'
import { promisify } from './promisify'

export function applyComponentAsyncData (Component, asyncData) {
  const componentData = Component.options.data || noopData
  // Prevent calling this method for each request on SSR context
  if (!asyncData || Component.options.hasAsyncData) { // && ?
    return
  }
  Component.options.hasAsyncData = true
  Component.options.data = function () {
    const data = componentData.call(this)
    // if (this.$ssrContext) {
    //   asyncData = this.$ssrContext.asyncData[component.cid]
    // }
    return { ...data, ...asyncData }
  }
  if (Component._Ctor && Component._Ctor.options) {
    Component._Ctor.options.data = Component.options.data
  }
}

export function sanitizeComponent (Component) {
  // If Component already sanitized
  if (Component.options && Component._Ctor === Component) {
    return Component
  }
  if (!Component.options) {
    Component = Vue.extend(Component)
    Component._Ctor = Component
  } else {
    Component._Ctor = Component
    Component.extendOptions = Component.options
  }
  // For debugging purpose
  if (!Component.options.name && Component.options.__file) {
    Component.options.name = Component.options.__file
  }
  return Component
}

export const hasAsyncPreload = (options) => {
  return Boolean((options.asyncData || options.fetch) && !options.hasAsyncData)
}

export const ensureVmAsyncData = (vm, context) => {
  if (!hasAsyncPreload(vm.$options)) {
    return Promise.resolve({})
  }
  const promises = []

  if (vm.$options.asyncData) {
    let promise = promisify.call(vm, vm.$options.asyncData, context).then((data) => {
      if (data) {
        for (let key in data) {
          vm.$set(vm, key, data[key])
        }
      }
      return data
    })
    promises.push(promise)
  }

  if (vm.$options.fetch) {
    promises.push(vm.$options.fetch(context))
  }
  return Promise.all(promises)
}

export const ensureComponentAsyncData = (Component, context) => {
  const promises = []

  if (Component.options.asyncData) {
    let promise = promisify(Component.options.asyncData, context)
    promise.then((asyncDataResult) => {
      // ssrContext.asyncData[Component.cid] = asyncDataResult
      applyComponentAsyncData(Component, asyncDataResult)
      return asyncDataResult
    })
    promises.push(promise)
  }

  // Call fetch(context)
  if (Component.options.fetch) {
    promises.push(Component.options.fetch(context))
  }
  return Promise.all(promises)
}

export const ensureAsyncData = async (components, context) => {
  if (!Array.isArray(components)) {
    if (!components) {
      return null
    } else {
      components = [components]
    }
  }

  return Promise.all(components.map((Component) => {
    return ensureComponentAsyncData(Component, context)
  }))
}
