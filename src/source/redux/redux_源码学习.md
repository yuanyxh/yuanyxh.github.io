---
title: redux 源码学习
date: 2023-06-26 23:36:00
author: yuanyxh
tag:
 - redux 状态管理
description: 学习 redux 状态管理库的相关源码，了解其如何管理维护 web 应用程序的状态，并从源码中学习函数式编程的思想。
---

## 前言

[redux]，一个继承了 `flux` 架构思想的状态管理库，不与任何 UI 框架、库强绑定，因为其不与框架耦合的特性，所以在状态变更时无法自动触发视图更新，且配置较为繁琐，在使用体验上不如一些较新的状态管理库。

为什么学习它？在几个月前笔者学习 `React` 及其周边库时，对 `Redux` 的中间件实现颇感兴趣，所以翻看了对应的源码，以此进了函数式编程的门，这次想对 `Redux` 的完整源码进行学习。

`Redux` 版本 4.2.1，建议阅读文档熟悉相关 Api 后进行学习。

## createStore

在使用 `Redux` 时，通常使用 `createStore` 函数进行全局状态（store）的创建，它在 `/src/index.js` 中被导出，代码省略如下：

```js
// src/index.js

import { createStore } from './createStore'

export {
  createStore
}
```

可以看到是从同级的 `createStore.js` 文件导入进来的，该 js 文件中只定义了一个 `createStore` 函数，这个函数可以说是 `redux` 的核心。

下面我们就一步一步的学习 `createStore` 函数的代码，首先查看它的函数签名：

```js
// src/createStore.js

export function createStore(reducer, preloadedState, enhancer) {}
```

在函数签名中可以发现它定义了三个形参：

- `reducer`：作用固定，即用户定义的用于更新状态的纯函数
- `preloadedState`：作用不固定，可能是初始状态，也可能是将插件整合的组合函数
- `enhancer`：可能是将插件整合的组合函数，也可能为 `undefined`

`preloadedState` 和 `enhancer` 的作用在后续代码的判断中可以知道：

```js
// src/createStore.js

export function createStore(reducer, preloadedState, enhancer) {
  if (
    (typeof preloadedState === 'function' && typeof enhancer === 'function') ||
    (typeof enhancer === 'function' && typeof arguments[3] === 'function')
  ) {
    throw new Error(
      'It looks like you are passing several store enhancers to ' +
        'createStore(). This is not supported. Instead, compose them ' +
        'together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.'
    )
  }

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error(
        `Expected the enhancer to be a function. Instead, received: '${kindOf(
          enhancer
        )}'`
      )
    }

    return enhancer(createStore)(reducer, preloadedState)
  }

  if (typeof reducer !== 'function') {
    throw new Error(
      `Expected the root reducer to be a function. Instead, received: '${kindOf(
        reducer
      )}'`
    )
  }
}
```

在第一个判断中判断了 `preloadedState` 和 `enhancer` 是否是函数，或者 `enhancer` 和可能传入的第四个参数是否是函数，如果这两个中的其中一个满足了条件即抛出错误，根据错误信息可以知道 `redux` 不允许直接传递多个中间件，而建议将多个中间件以组合的方式组合为一个函数。

在第二个判断中判断了 `preloadedState` 是否是一个函数且 `enhancer` 为 `undefined`，当条件满足时， `redux` 会认为用户没有传入初始状态，只传入了中间件函数或多个中间件组合而成的函数，此时会交换两者的值以明确它们的含义以及完成后续的操作。

第三个判断限制了 `enhancer` 只能为 `undefined` 或是一个中间件。

[redux]: https://redux.js.org/
