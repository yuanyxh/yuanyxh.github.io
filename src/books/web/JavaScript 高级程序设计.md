---
icon: info
title: JavaScript 高级程序设计
date: '2022-12-04 12:32:46'
author: yuanyxh
description: 推荐书籍，JavaScript 高级程序设计，学习全面的 JavaScript 知识
publish: false
article: false
---

## 简介

《JavaScript 高级程序设计》 是业界公认的 `JavaScript` 红宝书，书中简单介绍了 `JavaScript` 的历史，并由此展开，全面详实的介绍了 `JavaScript` 的相关知识。

《JavaScript 高级程序设计》 目前已更至第 4 版，于 2019 年出版发售，前三版的作者是 [Nicholas C. Zakas] [^1]，因病不能参与第 4 版的编写，第 4 版作者是 Matt Frisbie[^2]。

这本书适合刚入门的前端人员阅读，也适合很多虽然工作很久但从未深入了解过这门语言的前端开发者。

## 推荐原因

《JavaScript 高级程序设计》 是我刚入门前端时读的第一本前端书籍，因本人入门前端较晚，所以看的是第 4 版，在那个时侯，我只是简单的对 `HTML`、`CSS`、`JavaScript` 这三个网页组成部分有所了解，而这本书让我较为全面深入的了解了 `JavaScript` 这门语言。

不同于工具书籍，这本书并不仅仅是介绍 `JavaScript` 一些 Api 的作用，而是从历史出发，带我们了解这些 Api 的出现原因、作用以及解决了什么问题，比如 `let/const`、`class`、`Promise` 等等，让我收获颇丰，不愧 <q>红宝书</q> 之名。

文章会对 《JavaScript 高级程序设计》 的全部章节进行简要总结，对于部分内容可能会另写单独的文章进行较为深入的讲解，这些文章会同步更新附录在对应章节下，对于其他书籍类的文章都会采用这种模式。

::: tip
持续更新中
:::

## 章节

### 第 1 章 什么是 JavaScript

通过本章知道了 JavaScript 的由来与发展，JavaScript 是 Brendan Eich 于 1995 年开发的一门脚本语言，一开始主要用于表单校验。

由于浏览器厂商相互竞争，出现了多个版本的 JavaScript，它们的实现不尽相同，为了统一 JavaScript 的语法与特性，规范被制定出来，被称为 ECMAScript。

JavaScript 并不完全等于 ECMAScript，JavaScript 包含三个部分

- ECMAScript
- BOM
- DOM

#### ECMAScript

ECMAScript 只规定了不特定于平台的部分，像 `document`、`location` 这些 Api 就是特定于 Web 平台的，不特定于平台意味着只要引擎实现满足 ECMAScript 规范定义，那么只包含这部分的代码能够运行在任何平台下。

ECMAScript 版本之前以发布次数作为版本号，最近几年由于前端蓬勃发展，ECMAScript 每年都会发布一个新版本，所以目前以年份作为版本号，当然，普遍会将 ES2015 以后的版本统称为 ES6 或 ES6+。

#### BOM

BOM，浏览器对象模型，顾名思义，这部分特定于浏览器，提供的 Api 主要用于操作浏览器窗口。

#### DOM

DOM，文档对象模型，提供了操作网页文档的 Api，通过 DOM 能够实现页面的动态改变而无需请求一份新的网页文件。

DOM Level 1 映射文档结构，DOM Level 2 增加视图、事件、样式、遍历与范围等模块，DOM Level 3 新增加载、保存、验证文档的方法，且支持所有 XML 1.0 特性，DOM 4 新增 Mutation Events 与 Mutation Observers；目前不以 Level 维护 DOM。

### 第 2 章 HTML 中的 JavaScript

通过本章了解了任何在 HTML 使用 JavaScript，并在浏览器不支持 JavaScript 时显示后置内容。

#### script

`<script>` 元素可以用于加载外部 JavaScript 脚本，也能在元素内部直接书写 JavaScript 代码，他有许多属性，通过这些属性我们能够实现延迟执行、异步加载等功能。

通过 DOM Api 我们能够动态加载脚本，在 `<script>` 被添加到 DOM 前并执行前，对应的脚本不会被下载。

#### noscript

`<noscript>` 元素在不支持 JavaScript 或相关功能被关闭的浏览器上会显示，用于告知用户相应的内容。

### 第 3 章 语言基础

本章讲述了语言相关的基础知识，如语法、变量、数据类型、操作符、语句、函数等。

#### 语法

JavaScript 的语法很大程度上借鉴了 C 语言，它区分大小写，标识符、注释都采用 C 风格，同时还描述了一组关键字与保留字。

#### 变量

ES6 以前使用 var 声明变量，现在已不再推荐使用，因为它具有很多不符合直觉的行为。

[变量声明]

#### 数据类型

JavaScript 有许多内置的数据类型，如 number、string、boolean、symbol、undefined、null 等基本数据类型，还有 object 引用数据类型。

[symbol]

#### 操作符

JavaScript 中拥有许多可用的操作符，如一元操作符、位操作符、布尔操作符、乘性操作符、加性操作符、关系操作符、相等操作符、条件操作符、复制操作符、逗号操作符等。

#### 语句

JavaScript 与其他语言一样，拥有多种语句，如 if、do-while、while、for、for-in、for-of、标签语句、break 与 continue、with、switch 等常用语句。

#### 函数

JavaScript 是 C 风格的语言，使用函数作为核心组件，使用函数封装语句以达到复用，JavaScript 函数是一等公民。

### 第 4 章 变量、作用域与内存

本章讲述了 JavaScript 中非常重要的概念：变量、作用域以及内存的相关知识。

#### JavaScript 变量

JavaScript 中的变量是弱类型的，变量的类型只在运行时确定，这意味着我们能够动态改变变量的类型（静态类型的语言不允许我们这样做），但这通常是不建议的。

JavaScript 变量分为原始值与引用值，原始值就是最简单的数据，引用值就是多个值构成的对象。

#### 作用域

作用域与执行上下文在编程语言中是一个重要的概念，变量与函数的上下文决定了它们能够访问哪些数据，作用域一般分为全局作用域、函数作用域、块作用域。

#### 内存

合理的管理内存是浏览器厂商需要考虑的，对于不再需要使用的内存，一般有两种垃圾回收方式：标记清理与引用计数。标记清理标记不再需要使用的数据，在合适的时间进行垃圾回收；引用计数记录每个数据被引用的次数，没有引用时进行垃圾回收（引用计数可能出现循环引用的情况，如 a 对象有一个属性引用了 b 对象，b 对象有一个属性引用了 a 对象，这会导致它们的引用次数永远为 1）。

我们无法控制垃圾回收运行的运行，但我们能够编写合理的代码以减少垃圾回收的次数，这对性能是有提升的。

### 第 5 章 基本引用类型

本章介绍了一些常见的内置引用类型，如 Date、RegExp 类型，它们提供了大量的实用 Api 供开发者使用，同时还介绍了原始值类型对应的包装类型，由此得知原始值为何能够使用引用类型特有的属性与方法。

除了内置类型，还存在着一些内置的对象实例，它们不与宿主环境相关，在 ECMAScript 程序运行时就存在，如 Global（并不显示存在，但浏览器将其实现为 window 对象）、Math。

### 第 6 章 集合引用类型

本章介绍了 JavaScript 中的集合引用类型，集合即一系列数据的组合，如 Object、Array、定型数组、Map、WeakMap、Set、WeakSet、DOM 节点，其中重点介绍了数组的相关操作，以及定型数组的由来与作用，还有 Map 映射与 Set 集合，对于 Map，它允许将任意类型当作 key，而 Object 是不允许的。

同时还详细介绍了对于这些集合引用类型的迭代以及扩展操作。

### 第 7 章 迭代器与生成器

本章介绍了 ES6 非常重要的特性，迭代器与生产器，通过本章我们了解了什么是迭代器模式，以及迭代器协议与可迭代对象的概念，同时还了解了生产器是一种强大的流程控制模式，生成器对象也满足了迭代器协议。

[迭代与生成]

[^1]: Nicholas C. Zakas：独立软件开发者，曾在 Yahoo 和 Box 任职，创建了 `ESLint` 开源项目，同时也是 《JavaScript 高级程序设计》 1~3 版的作者
[^2]: Matt Frisbie：知名前端技术专家，曾在 Google 任职，目前担任 Gosellout 公司 CTO

[Nicholas C. Zakas]: https://humanwhocodes.com/
[变量声明]: ../../posts/javascript/es6/ES6-新特性详解%20-%20let与const.md
[symbol]: ../../posts/javascript/es6/ES6-新特性详解-Symbol.md
[迭代与生成]: ../../posts/javascript/es6/ES6-新特性详解-迭代器与生成器.md
