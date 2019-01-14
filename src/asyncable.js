import { ensureVmAsyncData } from './asyncdata'
export default {
  data () {
    const data = {
      $loadingAsyncData: true
      // $loadingErrors: {}
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
    let context = {
      error: this.handleErrorWrapper
    }

    ensureVmAsyncData(this, context)
      .then(() => {
        self.$loadingAsyncData = false
      }).catch((e) => {
        self.handleError(e, 'load')
        self.$loadingAsyncData = false
      })
  },
  methods: {
    handleErrorWrapper ({ error, key, obj }) {
      this.handleError(error, 'param', key)
      // this.$set(this.$loadingErrors, key, true)
    },
    // errorCaptured()
    handleError (e, type, key) {
      // if (process.env.NODE_ENV !== 'production') {
      console.error('Async data loading error', e, type, key)
      // }
    }
  }
}
