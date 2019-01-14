
export function sleep (ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const generateAsyncFn = (data, timeout) => {
  return jest.fn(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), timeout)
    })
  })
}
