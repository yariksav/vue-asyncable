/*
 * vue-asyncable
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * Some functions was imported from nuxt.js/lib/app/utils.js
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { isFunction, isPromise, isNil } from './utils'

export function promisify (fn, context) {
  let promise

  if (isFunction(fn)) {
    promise = fn.call(this, context)
  } else {
    promise = fn
  }

  if (!isPromise(promise)) {
    if (typeof promise === 'object') {
      return checkObjectForPromises.call(this, promise, context)
    } else {
      promise = Promise.resolve(promise)
    }
  }
  return promise.then((data) => {
    return checkObjectForPromises(data)
  })
}

export function checkObjectForPromises (obj, context) {
  let promises = []
  let data = {}
  if (typeof obj !== 'object') {
    return obj
  }
  for (let key in obj) {
    let something = obj[key]
    if (isFunction(something)) {
      something = something.call(this, context)
    }
    if (isPromise(something)) {
      something = something.then((res) => {
        if (isNil(res)) {
          return
        }
        if (key.startsWith('...')) {
          data = { ...data, ...res }
        } else {
          data[key] = res
        }
        return res
      })
      // let newPromise = something.then((res) => {
      //   if (isNil(res)) {
      //     return
      //   }
      //   if (key.startsWith('...')) {
      //     data = { ...data, ...res }
      //   } else {
      //     data[key] = res
      //   }
      // })
      if (context && isFunction(context.error)) {
        something = something.catch((error) => {
          context.error({ error, key, obj })
        })
      }
      promises.push(something)
    } else {
      data[key] = something
    }
  }
  return Promise.all(promises).then(() => {
    return Promise.resolve(data)
  })
}
