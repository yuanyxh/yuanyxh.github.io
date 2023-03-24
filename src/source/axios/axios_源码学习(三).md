---
title: 学习 axios 源码（三）
date: 2023-03-21 10:54:00
author: yuanyxh
tag:
 - 学习 axios 源码
description: 学习目前主流的网络请求库 axios 的源码，了解其内部的执行流程，知晓实现的细节。
publish: false
---

## axios 源码学习系列

- [axios 源码学习 - axios 的初始化][axios_源码学习(一)]
- [axios 源码学习 - request 执行流程][axios_源码学习(二)]

## dispatchRequest 执行流程

上一章中我们讲解了 `request` 方法的执行流程，在 `request` 方法的最后调用了 `dispatchRequest` 函数以完成请求，这一篇文章我们就来学习一下后续的请求执行流程。`dispatchRequest` 函数定义在 `lib\core\dispatchRequest.js`。

```js
// lib\core\dispatchRequest.js
function dispatchRequest(config) {}
```

### 检查请求

在函数代码的开头，调用了 `throwIfCancellationRequested`，它的代码如下：

```js
// lib\core\dispatchRequest.js
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new CanceledError(null, config);
  }
}
```

我们知道，`axios` 是支持取消请求的，且支持两种取消方式，分别是 `CancelToken` 和 `AbortController`，它们的使用如下：

```js
// CancelToken
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
axios.get('https://yuanyxh.com/', {
  cancelToken: source.token
});
source.cancel();

// AbortController
const controller = new AbortController();
axios.get('https://yuanyxh.com/', {
  signal: controller.signal
});
controller.about();
```

这里判断请求配置中是否有 `cancelToken` 或 `signal` 这两个用于取消请求的属性，我们知道， `signal` 其实是 `AbortSignal` 的实例，实例有一个 `aborted` 属性用于描述请求是否被取消，所以 `throwIfCancellationRequested` 这个函数就是判断当前请求是否被取消，是则抛出错误。

[axios_源码学习(一)]: ./axios_源码学习(一).md
[axios_源码学习(二)]: ./axios_源码学习(二).md
