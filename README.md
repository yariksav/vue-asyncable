## vue-asyncable

> Async data loading plugin for Vue.js


<p align="center">
  <a href="https://npmcharts.com/compare/vue-asyncable?minimal=true">
    <img src="http://img.shields.io/npm/dm/vue-asyncable.svg">
  </a>
  <a href="https://www.npmjs.org/package/vue-asyncable">
    <img src="https://img.shields.io/npm/v/vue-asyncable.svg">
  </a>
  <a href="http://img.badgesize.io/https://unpkg.com/vue-asyncable/dist/vue-asyncable.js?compression=gzip&label=gzip%20size:%20JS">
    <img src="http://img.badgesize.io/https://unpkg.com/vue-asyncable/dist/vue-asyncable.cjs.js?compression=gzip&label=gzip%20size:%20JS">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-green.svg">
  </a>
  <a href='https://coveralls.io/github/yariksav/vue-asyncable'><img src='https://coveralls.io/repos/github/yariksav/vue-asyncable/badge.svg' alt='Coverage Status' /></a>
  <a href='https://travis-ci.org/yariksav/vue-asyncable'><img src='https://travis-ci.org/yariksav/vue-asyncable.svg?branch=master' /></a>
</p>

### Install

``` bash
npm install vue-asyncable --save-dev
```

### Usage

``` js
// assuming CommonJS
import { Asyncable } from 'vue-asyncable'
```

Then, in your component options, provide an `asyncData` function:

``` js
Vue.component('example', {
  mixins: ['Asyncable'],
  data () {
    return {
      orders: [],
      news: []
    }
  },
  asyncData () {
    return {
      orders: this.$axios.$get('api/orders'),
      news: this.$axios.$get('api/news')
    }
  }
})
```

### Object

Property asyncData can be simple object. In this case you don't need to define initial data elements, the module will set it's automatically

``` js
Vue.component('example', {
  // ...
  asyncData: {
    orders: axios.$get('api/orders', { user_id: profile.id }),
    news: axios.$get('api/news', { user_id: profile.id })
  }
})
```
### Promise

You can also return a promise that resolves to the data, and return object with promises and siple types

``` js
Vue.component('example', {
  mixins: [Asyncable],
  data () {
    return {
      profile: null,
      orders: null,
      news: null
    }
  }
  async asyncData () {
    let profile = await this.$axios.$get('api/profile')
    return {
      profile,
      orders: this.$axios.$get('api/orders', { user_id: profile.id }),
      news: this.$axios.$get('api/news', { user_id: profile.id })
    }
  }
})
```

In this case you have to predefine all params in data function

### Use promises in data function

You can define props with promises directly in data function and mixin will:
 1) set params to null
 2) call all promise functions
 3) when promises have resolved - assign to data by key

``` js
Vue.component('example', {
  mixins: [Asyncable],
  async data () {
    return {
      simpleParam: 'test',
      orders: this.$axios.$post('api/orders', { user_id: profile.id }),
      news: this.$axios.$post('api/news', { user_id: profile.id })
    }
  }
})
```

<!-- #### Reloading Data

The component also gets a method named `reloadAsyncData`, which obviously reloads the data:

``` js
Vue.component('example', {
  // ...
  asyncData() {
    // load data based on `this.params`
  },
  // reload when params change
  watch: {
    params: 'reloadAsyncData'
  }
})
``` -->

#### Loading State

Your component automatically gets a `$loadingAsyncData` meta property, which allows you to display a loading state before the data is loaded:

``` html
<div v-if="$loadingAsyncData">Loading...</div>
<div v-if="!$loadingAsyncData">Loaded. Put your real content here.</div>
```

### License

[MIT](http://opensource.org/licenses/MIT)