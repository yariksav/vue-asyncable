import { ensureVmAsyncData } from './asyncdata'
export default {
  data () {
    const data = {
      $loadingAsyncData: true
    }
    if (typeof this.$options.asyncData === 'object') {
      Object.keys(this.$options.asyncData).forEach(key => {
        data[key] = null
      })
    }
    return data
  },
  created () {
    this.$loadingAsyncData = true
    let self = this

    ensureVmAsyncData(this, this)
      .then(() => {
        self.$loadingAsyncData = false
      }).catch((e) => {
        self.asyncDataError(e, { type: 'load' })
        self.$loadingAsyncData = false
      })
  },
  methods: {
    asyncDataError (e, { type, key }) {
      // if (process.env.NODE_ENV !== 'production') {
      console.error('Async data loading error', e, type, key)
      // }
    }
  }
}
