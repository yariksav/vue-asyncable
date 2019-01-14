import { ensureVmAsyncData } from './asyncdata'
export default {
  data () {
    return {
      $loadingAsyncData: true
    }
  },
  created () {
    this.$loadingAsyncData = true
    let context = {
      error ({ error, key, obj }) {
        this.handleError(error, 'param', key)
      }
    }
    ensureVmAsyncData(this, context).then(() => {
      this.$loadingAsyncData = false
    }).catch((e) => {
      this.handleError(e, 'load')
      this.$loadingAsyncData = false
    })
  },
  methods: {
    handleError (e, type, key) {
      // if (process.env.NODE_ENV !== 'production') {
      console.error('Async data loading error', e, type, key)
      // }
    }
  }
}
