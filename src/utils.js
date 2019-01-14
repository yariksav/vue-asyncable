/*
 * vue-asyncable
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * Some functions was imported from nuxt.js/lib/app/utils.js
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

export const noopData = () => ({})

export const isFunction = (fn) => typeof fn === 'function'

export const isNil = s => s === null || s === undefined

export const isPromise = (promise) => {
  return promise && (promise instanceof Promise || typeof promise.then === 'function')
}
