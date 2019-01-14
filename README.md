## vue-asyncable

> Async data loading plugin for Vue.js

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
  data: function {
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

Property asyncData can be simple object

``` js
Vue.component('example', {
  // ...
  asyncData: {
    orders: this.$axios.$get('api/orders', { user_id: profile.id }),
    news: this.$axios.$get('api/news', { user_id: profile.id })
  }
})
```
### Promise

You can also return a promise that resolves to the data, and return object with promises and siple types

``` js
Vue.component('example', {
  // ...
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