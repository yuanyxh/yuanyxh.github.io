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

不同于工具书籍，这本书并不仅仅是介绍 `JavaScript` 一些 Api 的作用，而是从历史出发，带我们了解这些 Api 的出现原因、作用以及解决了什么问题，比如 `let/const`、`class`、`Promise` 等等，让我收获颇丰，不愧 ‘红宝书’ 之名。

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

待续...

[^1]: Nicholas C. Zakas：独立软件开发者，曾在 Yahoo 和 Box 任职，创建了 `ESLint` 开源项目，同时也是 《JavaScript 高级程序设计》 1~3 版的作者
[^2]: Matt Frisbie：知名前端技术专家，曾在 Google 任职，目前担任 Gosellout 公司 CTO

[Nicholas C. Zakas]: https://humanwhocodes.com/
