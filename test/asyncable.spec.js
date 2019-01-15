import Vue from 'vue'
import Asyncable from '../src/asyncable'
import { mount } from '@vue/test-utils'
import { generateAsyncFn, sleep } from './utils'

describe('async', () => {
  it('should apply async data', async () => {
    let vmThis = null
    const asyncData = jest.fn(function () {
      expect(this.$loadingAsyncData).toEqual(true)
      vmThis = this
      return new Promise((resolve) => {
        setTimeout(() => resolve({ foo: 'bar' }), 1)
      })
    })

    const fetch = generateAsyncFn(null, 1)
    const Component = {
      mixins: [Asyncable],
      asyncData,
      data () {
        return {
          foo: null
        }
      },
      fetch,
      render: () => {}
    }
    const wrapper = mount(Vue.extend(Component))
    expect(wrapper.vm).toEqual(vmThis)
    expect(asyncData).toBeCalledTimes(1)
    expect(fetch).toBeCalledTimes(1)
    expect(wrapper.vm.$data).toEqual({ $loadingAsyncData: true, foo: null })
    await sleep(5)
    expect(wrapper.vm.$loadingAsyncData).toEqual(false)
    expect(wrapper.vm.foo).toEqual('bar')
  })

  it('should calculate promises in $data', async () => {
    let vmThis = null
    const asyncFn = jest.fn(function () {
      expect(this.$loadingAsyncData).toEqual(true)
      vmThis = this
      return new Promise((resolve) => {
        setTimeout(() => resolve({ bar: 'baz' }), 1)
      })
    })

    const Component = {
      mixins: [Asyncable],
      data () {
        return {
          foo: asyncFn,
          test: generateAsyncFn([1, 2], 2)
        }
      },
      template: '<p>{{ foo }}</p>'
    }
    // const wrapper = mount(Component)
    const wrapper = mount(Vue.extend(Component))
    // await sleep(1)
    expect(wrapper.vm).toEqual(vmThis)
    expect(asyncFn).toBeCalledTimes(1)
    expect(wrapper.vm.$data).toEqual({ $loadingAsyncData: true, test: null, foo: null })

    await sleep(5)
    expect(wrapper.vm.$loadingAsyncData).toEqual(false)
    expect(wrapper.vm.$data).toEqual({ $loadingAsyncData: true, test: [1, 2], foo: { bar: 'baz' } })
    // expect(wrapper.vm.foo).toEqual({ foo: 'bar' })
  })

  it('should catch errors if handler exist', async () => {
    const fn1 = generateAsyncFn('bar', 3)
    const fn2 = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('something bad happened')), 5)
      })
    }

    let Component = {
      mixins: [Asyncable],
      asyncData: {
        foo: fn1,
        arr: fn2
      },
      render: () => {}
    }
    global.console.error = jest.fn()
    const wrapper = mount(Vue.extend(Component))
    await sleep(10)
    await Vue.nextTick()
    expect(wrapper.vm.$loadingAsyncData).toEqual(false)
    expect(wrapper.vm.arr).toEqual(null)
    expect(wrapper.vm.foo).toEqual('bar')
    expect(global.console.error).toBeCalled()
  })

  it('should catch global error', async () => {
    const asyncData = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('something bad happened')), 5)
      })
    }
    global.console.error = jest.fn()
    let Component = {
      mixins: [Asyncable],
      asyncData,
      render: () => {}
    }
    const wrapper = mount(Vue.extend(Component))
    await sleep(10)
    expect(wrapper.vm.$loadingAsyncData).toEqual(false)
    // TODO
  })
})
