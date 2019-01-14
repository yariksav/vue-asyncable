import Vue from 'vue'
import asyncable from '../src/asyncable'
import { mount } from '@vue/test-utils'
import { generateAsyncFn, sleep } from './utils'

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
      mixins: [asyncable],
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
    await Vue.nextTick()
    expect(wrapper.vm.$loadingAsyncData).toEqual(false)
    expect(wrapper.vm.foo).toEqual('bar')
  })
})
