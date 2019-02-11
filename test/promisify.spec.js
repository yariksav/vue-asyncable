import { promisify } from '../src/entry'
import { generateAsyncFn } from './utils'
const context = { foo: 'bar' }

describe('promisify', () => {
  it('Should work with simple types', async () => {
    let res = await promisify('string')
    expect(res).toEqual('string')
  })

  it('should work with async function', async () => {
    const fn = generateAsyncFn({ msg: 'foo' }, 1)
    const res = await promisify(fn, context)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(context)
    expect(res).toEqual({ msg: 'foo' })
  })

  it('should work with object of async function', async () => {
    const fn1 = generateAsyncFn('bar', 1)
    const fn2 = generateAsyncFn(['test'], 1)
    const fn3 = generateAsyncFn(null, 0)
    const res = await promisify({
      foo: fn1,
      arr: fn2,
      testNull: fn3,
      simpleString: 'foo',
      simpleObject: { test: 1 }
    })
    expect(fn1).toHaveBeenCalledTimes(1)
    expect(fn2).toHaveBeenCalledTimes(1)
    expect(res).toEqual({ foo: 'bar', arr: [ 'test' ], simpleString: 'foo', simpleObject: { test: 1 } })
  })

  it('should work with object of async functions and object destructuring ', async () => {
    const fn1 = generateAsyncFn({ foo: 'bar', baz: 1 }, 0)
    const fn2 = generateAsyncFn(['test'], 1)
    const res = await promisify({
      '...': fn1,
      arr: fn2
    })
    expect(fn1).toHaveBeenCalledTimes(1)
    expect(fn2).toHaveBeenCalledTimes(1)
    expect(res).toEqual({ foo: 'bar', baz: 1, arr: [ 'test' ] })
  })

  it('should work with promise which returns object of promises', async () => {
    const fn1 = generateAsyncFn('bar', 3)
    const fn2 = generateAsyncFn(['test'], 2)
    const obj = {
      foo: fn1,
      arr: fn2,
      simpleString: 'foo',
      simpleObject: { test: 1 }
    }

    const asyncFn = jest.fn((context) => { return obj })// generateAsyncFn(obj, 1)

    const res = await promisify(asyncFn)

    expect(asyncFn).toBeCalledTimes(1)
    expect(fn1).toBeCalledTimes(1)
    expect(fn2).toBeCalledTimes(1)
    expect(res).toEqual({
      simpleString: 'foo',
      simpleObject: { test: 1 },
      arr: [ 'test' ],
      foo: 'bar'
    })
  })

  it('should work when one of promises raizes error', async () => {
    const fn1 = generateAsyncFn('bar', 3)
    const fn2 = jest.fn(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('something bad happened')), 5)
      })
    })

    const errors = []
    const context = {
      asyncDataError: jest.fn((error) => {
        errors.push(error.message)
      })
    }

    const obj = {
      foo: fn1,
      arr: fn2,
      simpleString: 'foo',
      simpleObject: { test: 1 }
    }

    const res = await promisify(obj, context)

    expect(fn1).toBeCalledTimes(1)
    expect(fn2).toBeCalledTimes(1)
    expect(context.asyncDataError).toHaveBeenCalledTimes(1)
    expect(res).toEqual({
      simpleString: 'foo',
      simpleObject: { test: 1 },
      foo: 'bar'
    })
  })

  it('should raize error when one of promises has error and context.error is undefigned', async () => {
    const fn1 = generateAsyncFn('bar', 3)
    const fn2 = jest.fn(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('something bad happened')), 5)
      })
    })

    const obj = {
      foo: fn1,
      arr: fn2,
      simpleString: 'foo',
      simpleObject: { test: 1 }
    }

    await expect(promisify(obj)).rejects.toThrow('something bad happened')
  })

  it('should start all promises immediately', async () => {
    const start = new Date().getTime()
    const res = await promisify({
      param1: generateAsyncFn(1, 5),
      param2: generateAsyncFn('test', 5),
      param3: generateAsyncFn(['test'], 6),
      param4: generateAsyncFn({ p: 'test' }, 7),
      testNull: generateAsyncFn(null, 0),
      simpleString: 'foo',
      simpleObject: { test: 1 }
    })
    const end = new Date().getTime()
    expect(end - start).toBeLessThan(15)
    expect(res).toEqual({
      param1: 1,
      param2: 'test',
      param3: ['test'],
      param4: {
        p: 'test'
      },
      simpleString: 'foo',
      simpleObject: { test: 1 }
    })
  })

  it('should work with promise which returns object of promises', async () => {
    const fn1 = generateAsyncFn('bar', 3)
    const fn2 = generateAsyncFn(['test'], 2)
    const obj = {
      foo: fn1,
      arr: fn2,
      simpleString: 'foo',
      simpleObject: { test: 1 }
    }

    const asyncFn = async () => { return obj }
    const res = await promisify(asyncFn)
    expect(fn1).toBeCalledTimes(1)
    expect(fn2).toBeCalledTimes(1)
    expect(res).toEqual({
      simpleString: 'foo',
      simpleObject: { test: 1 },
      arr: [ 'test' ],
      foo: 'bar'
    })
  })
})
