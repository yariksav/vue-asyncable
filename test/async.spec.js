// import { promisify as p } from 'util'
// const context = { foo: 'bar' }
import Vue from 'vue'
import {
  ensureAsyncData,
  ensureComponentAsyncData,
  sanitizeComponent,
  applyComponentAsyncData,
  hasAsyncPreload
} from '../src/asyncdata'
import { mount } from '@vue/test-utils'
import { generateAsyncFn } from './utils'

describe('async', () => {
  it('should apply sync data', async () => {
    const asyncData = generateAsyncFn({ test: 1 }, 1)
    const fetch = generateAsyncFn(null, 1)
    const cmp = {
      asyncData,
      fetch,
      render: () => {}
    }
    let Component = sanitizeComponent(cmp)
    await ensureAsyncData(Component)
    const wrapper = mount(Component)
    expect(asyncData).toBeCalledTimes(1)
    expect(fetch).toBeCalledTimes(1)
    expect(wrapper.vm.$data).toEqual({ test: 1 })
  })

  it('should be correct context argument', async () => {
    const context = { foo: 'bar' }
    const asyncData = jest.fn((ctx) => {
      return new Promise((resolve) => {
        // check valid context in asyncData
        expect(ctx).toEqual(context)
        setTimeout(() => resolve({ msg: 'foo' }), 1)
      })
    })

    const cmp = {
      template: '<p>{{ msg }}</p>',
      asyncData
    }
    let Component = sanitizeComponent(cmp)
    expect(hasAsyncPreload(Component.options)).toEqual(true)
    await ensureComponentAsyncData(Component, context)
    expect(hasAsyncPreload(Component.options)).toEqual(false)
    const wrapper = await mount(Component, { bar: 'baz' })

    expect(asyncData).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.$data).toEqual({ msg: 'foo' })
    expect(wrapper.element.innerHTML).toBe('foo')
  })

  it('should correct sanitize component', () => {
    const cmp = sanitizeComponent({
      render: () => {}
    })
    const cmp2 = sanitizeComponent(cmp)
    expect(cmp).toEqual(cmp2)
    const cmp3 = sanitizeComponent(Vue.extend({
      render: () => {}
    }))
    expect(cmp3).toHaveProperty('_Ctor')
  })

  it('should not apply async data twice', async () => {
    const cmp = {
      data () {
        return {
          foo: 'bar'
        }
      },
      __file: 'test',
      render: () => {}
    }
    let Component = sanitizeComponent(cmp)
    applyComponentAsyncData(Component, { baz: 'bad' })
    expect(Component.options.hasAsyncData).toEqual(true)
    applyComponentAsyncData(Component, { baz2: 'bad' })
    const wrapper = await mount(Component)
    expect(wrapper.vm.$data).toEqual({ foo: 'bar', baz: 'bad' })
  })

  it('should ensureAsyncData with no params', async () => {
    const res = await ensureAsyncData()
    expect(res).toEqual(null)
  })
  // TODO: test with errors
})
