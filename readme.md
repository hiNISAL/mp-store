# mp-store

原生微信小程序的状态管理机

## 存在的问题

- 如果是简单的父子组件关系，不建议将数据放到数据流中，因为`props`传值的方式比`setData`性能要高。（本项目的内部实现你原理都是使用`setData`完成的）

- `setData`的数据是有长度限制的，微信官方限制了`1MB`左右

## 使用

`mp-store`默认导出的是一个`Store`实例，因为具有`命名空间`的机制，所以可以只用一个实例管理全局的数据。

### 注册状态

``` js
// view
<view>
  <view>{{bar}}</view>
  <view>{{ns_foo}}</view>
  <button bindtap="eve">click here</button>
</view>

// app-service
import store from 'mp-store.js'

Page({
  onLoad(opts) {
    store.register('bar', this);

    // 可以带有命名空间
    store.register({
      key: 'foo',
      instance: this,
      beforeUpdate(prev, next) {
        console.log(prev, next);
      },
      nameSpace: 'ns',
    });
  },

  eve() {
    // 可以使用赋值表达式赋值
    store['bar'] = 'bar here';
    store['ns_foo'] = 'data2';
    setTimeout(() => {
      // 也可以用set方法赋值
      store.set('ns_foo', 'data2');
    }, 1000);

    store.set('bar', 'bar value');

    console.log(store.get('ns_foo'));
  }
});
```

组件中使用方式相同

## 页面与组件解决方案

在项目的`/cover`目录下有一个`Page.js`和一个`Component.js`

使用他们代替Page和Component来申明页面和组件，可以优化对数据的访问体验。

``` js
import CoverPage from './cover/Page';
import store from './store';

CoverPage({
  store: ['foo', 'bar'],
  onLoad() {
    console.log(this.store.foo);
  },
}, store);

CoverPage({
  store: {
    ns: ['bar', {
      key: 'foo',
      beforeUpdate: () => {},
    }],
  },
  onLoad() {
    console.log(this.store['ns_foo']);
  },
}, store);
```

组件中使用方式相同

## API

### register

给需要被通知的页面或者组件注册数据

``` txt
第一种传参方式

/** 要创建或者监听的数据 */
key: string

/** 当数据改变后要通知的组件或者页面实例 */
instance: Page|Component)
```

``` txt
第二种传参方式

options: {
  /** 要创建或者监听的数据 */
  key: string

  /** 命名空间 */
  nameSpace: string

  /** 当数据改变后要通知的组件或者页面实例 */
  instance: Page|Component

  /** 第一次设置值时候的默认值 */
  defaultValue: any

  /** 值被更新前要做的事情 */
  beforeUpdate

  /** 值被更新后要做的事情 */
  afterUpdate
}
```

### logout

``` txt
第一种传参方式

注销所有该页面监听的数据

/** 需要被注销的页面或者组件 */
instance: Page|Component
```

``` txt
第二种传参方式

注销所有命名空间下监听的`key`

/** 需要被注销的页面或者组件 */
instance: Page|Component

/** 需要被注销的数据名称 */
key: string
```

``` txt
第三种传参方式

会注销某个命名空间下的某个数据的监听

/** 需要被注销的页面或者组件 */
instance: Page|Component

/** 需要被注销的数据名称 */
key: string

/** 命名空间 */
nameSpace: string
```

### get

返回某一个数据

``` txt
第一种传参方式

/** 需要获取的数据的名字 */
key: string
```

``` txt
第二种传参方式

/** 需要获取的数据的名字 */
key: string

/** 命名空间 */
nameSpace: string
```

### set

设置值

``` txt
第一种传参方式

options: {
  /** 数据名 */
  key: string

  /** 命名空间 */
  nameSpace: string

  /** 值 */
  value: any
}
```

``` txt
第二种传参方式

/** 数据名 */
key: string

/** 值 */
value: any
```
