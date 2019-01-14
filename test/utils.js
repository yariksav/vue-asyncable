import { createWrapper } from '@vue/test-utils'

export function sleep (ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function wrap (vm) {
  return createWrapper({ componentInstance: vm }, {
    attachedToDocument: true
  })
}

export const generateAsyncFn = (data, timeout) => {
  return jest.fn(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), timeout)
    })
  })
}
