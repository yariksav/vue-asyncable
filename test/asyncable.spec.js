import Vue from 'vue'
import Asyncable from '../src/asyncable'
import { mount } from '@vue/test-utils'
import { generateAsyncFn, sleep } from './utils'
import { ensureVmAsyncData } from '../src/asyncdata'

describe('async', () => {
  it('should apply sync data', async () => {
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

  it('should catch errors if handler exist', async () => {
    const fn1 = generateAsyncFn('bar', 3)
    const fn2 = jest.fn(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('something bad happened')), 5)
      })
    })

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
    // test component in not ensure data twise
    let res = await ensureVmAsyncData(wrapper.vm)
    expect(res).toEqual({})
  })

  it('should catch global error', async () => {
    const asyncData = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('something bad happened')), 5)
      })
    }

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
