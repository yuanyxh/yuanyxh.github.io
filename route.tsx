import NProgress from 'nprogress';

import type { RouteObject } from '@/router';
import { createRouter } from '@/router';

import { sleep } from '@/utils';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: () => import('@/viewer/Layout'),
    children: [
      {
        path: 'index',
        element: () => import('@/viewer/Index')
      },
      {
        path: 'articles',
        children: [
          {
            path: 'index',
            element: () => import('@/viewer/Articles')
          }
          ,
        {
          path: "axios_source_1",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/source/axios_source_1.mdx"),
          meta: {"title":"学习 axios 源码（一）","date":"2023-03-07T16:42:00.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/1dbf569c31dd90e6.png","description":"学习目前主流的网络请求库 axios 的源码，了解其内部的执行流程，知晓实现的细节。"}
        },
      
        {
          path: "axios_source_2",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/source/axios_source_2.mdx"),
          meta: {"title":"学习 axios 源码（二）","date":"2023-03-14T16:22:00.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/1dbf569c31dd90e6.png","description":"学习目前主流的网络请求库 axios 的源码，了解其内部的执行流程，知晓实现的细节。"}
        },
      
        {
          path: "axios_source_3",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/source/axios_source_3.mdx"),
          meta: {"title":"学习 axios 源码（三）","date":"2023-03-21T10:54:00.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/1dbf569c31dd90e6.png","description":"学习目前主流的网络请求库 axios 的源码，了解其内部的执行流程，知晓实现的细节。"}
        },
      
        {
          path: "redux_source",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/source/redux_source.mdx"),
          meta: {"title":"redux 源码学习","date":"2023-06-26T23:36:00.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/c5a5b8af015c8f76.png","description":"学习 redux 状态管理库的相关源码，了解其如何管理维护 web 应用程序的状态，并从源码中学习函数式编程的思想。"}
        },
      
        {
          path: "compatible_discussion",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/skill/compatible_discussion.mdx"),
          meta: {"title":"为什么我要牺牲现代浏览器用户的体验去兼容 ie8？","date":"2023-09-17T14:38:00.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/01aae4b34b9facbc.jpg","description":"对项目兼容性的探讨，以及以现代浏览器为主向下兼容的思想与可行方法的讨论。"}
        },
      
        {
          path: "habits",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/skill/habits.mdx"),
          meta: {"title":"代码风格与编码习惯","date":"2023-02-25T10:58:00.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/3fbf152c093f1136.jpg","description":"学习好的代码风格与编码习惯"}
        },
      
        {
          path: "Idle_mobile_and_intranet_penetration",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/skill/Idle_mobile_and_intranet_penetration.mdx"),
          meta: {"title":"【折腾向】闲置手机 + 内网穿透 + caddy + rclone = ？","date":"2024-03-10T17:20:00.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/6516a9300533ca12.png","description":"通过 frp 内网穿透将闲置手机暴露至公网，并使用 caddy 搭建 webdav 服务，客户端使用 rclone 实现 webdav 挂载，达到类坚果云的效果。"}
        },
      
        {
          path: "record_vuepress_rolling_recovery",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/skill/record_vuepress_rolling_recovery.mdx"),
          meta: {"title":"记录一次关于 vuepress 滚动恢复的讨论","date":"2023-09-28T14:12:00.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/ff9c074093a8255d.png","description":"一次关于滚动恢复的讨论。"}
        },
      
        {
          path: "typora_synchronization",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/skill/typora_synchronization.mdx"),
          meta: {"title":"typora & vscode 实现图片自动上传与云同步","date":"2023-02-28T21:57:00.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/181a4aef9f1c32b5.jpg","description":"实现 typora 与 vscode 的图片自动上传，并完成 typora 文档云同步功能"}
        },
      
        {
          path: "uniapp_multi_end_adaptation_problem",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/skill/uniapp_multi_end_adaptation_problem.mdx"),
          meta: {"title":"入职一个月，总结下 uniapp 多端项目遇到的一些问题与解决方案","date":"2023-11-12T21:11:00.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/3a6e04cb2d739750.jpg","description":"记录在一个 uniapp 多端项目中遇到的一些问题及解决方法或思路。"}
        },
      
        {
          path: "uniapp_project_development_experience_summary",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/skill/uniapp_project_development_experience_summary.mdx"),
          meta: {"title":"uniapp 项目开发经验总结","date":"2024-01-07T23:08:00.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/3a6e04cb2d739750.jpg","description":"总结 uniapp 多端项目三个月开发维护的经验，遇到并解决了什么困难，收获了什么。回首看，青州已过万重山。"}
        },
      
        {
          path: "drop_api",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/posts/js/drop_api.mdx"),
          meta: {"title":"HTML5 拖拽 Api 研究","date":"2023-04-10T18:03:40.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/4567f0aa4bbb41be.png","description":"学习研究 HTML5 的拖拽 Api，了解其中的技术细节，并展示拖拽 Api 可能的实际应用。"}
        },
      
        {
          path: "es6-iterator",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/posts/js/es6-iterator.mdx"),
          meta: {"title":"ES6 新特性详解 - 迭代器与生成器","date":"2022-11-26T14:47:27.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/5a97aff6bdd7c7a3.jpg","description":"详解 JavaScript ES6 迭代器与生成器"}
        },
      
        {
          path: "es6_arrow_func",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/posts/js/es6_arrow_func.mdx"),
          meta: {"title":"ES6 新特性详解 - 箭头函数","date":"2022-10-24T18:17:19.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/f8bd8ad829bcab6d.png","description":"详解 JavaScript ES6 箭头函数"}
        },
      
        {
          path: "es6_async_func",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/posts/js/es6_async_func.mdx"),
          meta: {"title":"ES6 新特性详解 - 异步函数","date":"2022-11-29T10:15:19.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/ebe7642f4f6d4328.png","description":"详解 JavaScript ES6 异步函数"}
        },
      
        {
          path: "es6_class",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/posts/js/es6_class.mdx"),
          meta: {"title":"ES6 新特性详解 - 类","date":"2022-11-02T21:15:10.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/8fb480e2c5c77412.png","description":"详解 JavaScript ES6 class"}
        },
      
        {
          path: "es6_deconstruct",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/posts/js/es6_deconstruct.mdx"),
          meta: {"title":"ES6 新特性详解 - 解构赋值","date":"2022-10-23T19:54:03.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/f16d7ca84cf00b68.jpg","description":"详解 JavaScript ES6 新的语言特性 - 解构赋值"}
        },
      
        {
          path: "es6_let_and_const",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/posts/js/es6_let_and_const.mdx"),
          meta: {"title":"ES6 新特性详解 - let/const","date":"2022-10-22T13:00:22.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/b6c97384245502d8.jpg","description":"详解 JavaScript ES6 新的定义变量的方式"}
        },
      
        {
          path: "es6_promise",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/posts/js/es6_promise.mdx"),
          meta: {"title":"ES6 新特性详解 - Promise","date":"2022-10-29T18:24:50.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/817e1efc333799c0.png","description":"详解 JavaScript ES6 Promise"}
        },
      
        {
          path: "es6_symbol",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/posts/js/es6_symbol.mdx"),
          meta: {"title":"ES6 新特性详解 - Symbol","date":"2022-11-06T17:09:27.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/0d598efd28c6cf11.png","description":"详解 JavaScript ES6 symbol"}
        },
      
        {
          path: "js_closure",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/posts/js/js_closure.mdx"),
          meta: {"title":"JavaScript 概念 - 闭包","date":"2022-11-12T12:04:03.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/879ccc71f21e0fbd.jpg","description":"详解 JavaScript 中的闭包，并了解为什么大量使用闭包会造成内存泄漏"}
        },
      
        {
          path: "js_event_loop",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/posts/js/js_event_loop.mdx"),
          meta: {"title":"JavaScript 概念 - 事件循环","date":"2022-11-19T22:09:49.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/3440a278bbdf21bc.gif","description":"从规范出发，使用伪代码模拟 JavaScript 事件循环机制，并详细解读 JavaScript 事件循环的重要部分。"}
        },
      
        {
          path: "js_prototype_and_inheri",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/posts/js/js_prototype_and_inheri.mdx"),
          meta: {"title":"JavaScript 概念 - 原型与继承","date":"2022-10-26T19:38:27.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/e4e9836bb70b7c6e.png","description":"详解 JavaScript 原型与继承的概念"}
        },
      
        {
          path: "js_pro_func",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/posts/js/js_pro_func.mdx"),
          meta: {"title":"JavaScript 概念 - 高阶函数","date":"2022-10-25T09:52:19.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/50f392eb22185501.jpg","description":"详解 JavaScript 中的高阶函数概念"}
        },
      
        {
          path: "what_is_functional_programming",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/posts/js/what_is_functional_programming.mdx"),
          meta: {"title":"什么是函数式编程","date":"2023-01-04T13:54:00.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/a0bfbf882e472c54.webp","description":"理解什么是函数式编程，并了解为什么使用函数式编程、它给我们带来了什么好处；除此之外还需要知道与函数式编程相关的知识，如：柯里化、偏函数、组合与管道以及函子等。"}
        },
      
        {
          path: "css_type_of_data",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/posts/css/css_type_of_data.mdx"),
          meta: {"title":"CSS 数据类型与浏览器渐进兼容处理","date":"2023-03-05T20:12:00.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/a9e5c8a2241aff83.jpg","description":"了解 css 中的数据类型与属性定义语法，学习 css 中对于不同时期浏览器的渐进处理方案。"}
        },
      
        {
          path: "blog_product_with_hexo",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/posts/product/blog_product_with_hexo.mdx"),
          meta: {"title":"个人博客搭建 - 基于Hexo + Next + Github","date":"2022-10-21T09:21:00.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/8af068b22c8eab2d.png","description":"基于 Hexo 框架，搭配 Next 主题搭建自己的第一个博客，并配合 Github Pages 免费服务，让别人也能访问你的博客！"}
        },
      
        {
          path: "boss_article_auto_upload",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/posts/product/boss_article_auto_upload.mdx"),
          meta: {"title":"Boss 文章自动上传","date":"2024-02-22T13:40:00.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/3a74af32b33652e5.jpg","description":"解析 Boss 直聘文章上传协议，实现文章自动批量发布上传，不必使用 Boss 难用的富文本编辑器。"}
        },
      
        {
          path: "create_picgo_plugin",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/posts/product/create_picgo_plugin.mdx"),
          meta: {"title":"开发一个 PicGo 插件","date":"2023-03-03T22:37:00.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/7ca9f9ebd0cbcd20.png","description":"开发一个自定义图片上传的 PicGo 插件，支持任意图床的图片快速上传功能。"}
        },
      
        {
          path: "flashback_analysis_and_develop_native_plug",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/posts/product/flashback_analysis_and_develop_native_plug.mdx"),
          meta: {"title":"应用闪退分析与 uniapp 安卓原生插件开发","date":"2023-11-28T22:40:00.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/3a6e04cb2d739750.jpg","description":"记录一次 App 闪退分析的过程，了解不同机型对于后台进程回收的策略，并借助 uniapp 原生插件的能力解决相关 bug。"}
        },
      
        {
          path: "Pro_Git_reading_comprehension_how_to_achieve_git",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/posts/product/Pro_Git_reading_comprehension_how_to_achieve_git.mdx"),
          meta: {"title":"Pro Git 阅读理解：Git 是如何实现的","date":"2024-01-18T01:57:00.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/474d39a9bb90c51f.png","description":"阅读 Pro Git 有关实现原理的部分内容，深入理解 Git 是如何实现版本控制的。"}
        },
      
        {
          path: "upload_component_create",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/posts/product/upload_component_create.mdx"),
          meta: {"title":"upload 组件封装","date":"2023-05-01T20:26:00.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/d7b22a66f53f4d0a.png","description":"封装一个简易的文件上传组件"}
        },
      
        {
          path: "use_file_system",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/posts/product/use_file_system.mdx"),
          meta: {"title":"利用 FileSystem API 实现一个 web 端的残缺版文件管理器","date":"2023-08-19T17:15:00.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/9230f3c07bdc6557.jpg","description":"通过实现一个简易的 web 文件管理器来了解 FileSystem 文件系统 API，知晓 web 文件处理的方式。"}
        },
      
        {
          path: "what_is_gif",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/posts/product/what_is_gif.mdx"),
          meta: {"title":"深入浅出 GIF","date":"2023-09-12T13:41:00.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/5fb84fd5087780ea.jpg","description":"本文深入探讨了 gif 编解码的原理与技术。涵盖了 gif 文件的格式、压缩算法、八叉树颜色量化和字典树等关键内容。通过这些知识，我们成功实现了视频转 gif、图片转 gif 和 gif 播放器等功能。无论是从理论还是实践角度，本文都将为你展示 gif 编解码的精髓。"}
        },
      
        {
          path: "what_is_pdf",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/posts/product/what_is_pdf.mdx"),
          meta: {"title":"解锁 PDF 文件：使用 JavaScript 和 Canvas 渲染 PDF 内容","date":"2023-05-21T21:26:00.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/59816849ca089366.jpg","description":"从解析一个 PDF 开始，探索 JS 中处理二进制数据的方式，展望未来 Web 应用程序的形式。"}
        },
      
        ]
      },
      {
        path: 'books',
        children: [
          {
            path: 'index',
            element: () => import('@/viewer/Books')
          }
          ,
        {
          path: "professional_js",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/books/professional_js.mdx"),
          meta: {"title":"JavaScript 高级程序设计","date":"2022-12-04T12:32:46.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/77bbf8bf52103149.jpg","description":"《JavaScript 高级程序设计》 是业界公认的 JavaScript 红宝书，书中简单介绍了 JavaScript 的历史，并由此展开，全面详实的介绍了 JavaScript 的相关知识。这本书适合刚入门的前端人员阅读，也适合很多虽然工作很久但从未深入了解过这门语言的前端开发者。","book":true}
        },
      
        {
          path: "you_don't_know_js",
          element: () => import("E:/yuanyxh-worker/project/illustrate-reconstruct/src/markdowns/books/you_don't_know_js.mdx"),
          meta: {"title":"你不知道的 JavaScript","date":"2023-10-08T17:37:00.000Z","author":"yuanyxh","imageUrl":"http://qkc148.bvimg.com/18470/d47456e395635afa.jpg","description":"《你不知道的 JavaScript》 是一部由 Kyle Simpson 所著的 JavaScript 书籍。这本书旨在深入探讨 JavaScript 语言的核心概念，特别是一些常常被开发者误解或忽视的部分。这本书是一本深入研究 JavaScript 的经典之作，对于想要提高他们的 JavaScript 编程技能的开发者来说是一本非常有价值的资源，可以帮助你更深入地理解 JavaScript 的内部工作原理。","book":true}
        },
      
        ]
      },
      {
        path: 'profile',
        element: () => import('@/viewer/ProfileLayout'),
        children: [
          {
            path: 'index',
            element: () => import('@/viewer/Settings')
          },
          {
            path: 'about_me',
            element: () => import('@/viewer/AboutMe')
          },
          {
            path: 'about_site',
            element: () => import('@/viewer/AboutSite')
          }
        ]
      }
    ]
  },
  {
    path: '/coder',
    element: () => import('@/coder/Layout'),
    children: [
      {
        path: 'index',
        element: () => import('@/coder/Cases')
      }
      ,{
        path: "base64_coder",
        element: () => import("@/examples/base64_coder/code/__.tsx"),
        meta: {"imageUrl":"","title":"base64 编解码","date":"2024-4-21 16:54:00","author":"yuanyxh","description":"js 实现的 base64 示例，帮助理解 base64 是如何工作的"},
        children: [
      {
        path: 'Index.module.tsx',
        element: () => import('@/examples/base64_coder/code/Index.module.tsx')
      },
      {
        path: 'index',
        element: () => import('@/examples/base64_coder/code/Index.tsx')
      },
      {
        path: 'utils-base64.tsx',
        element: () => import('@/examples/base64_coder/code/utils/base64.tsx')
      },
      ]
    },
    ]
  }
];

const router = createRouter(routes);

let clear: (() => void) | null = null;
router.beforeEnter(() => {
  clear = sleep(200, () => NProgress.start());
});

router.afterEnter(() => {
  resetProgressBar();
});

export const resetProgressBar = () => {
  NProgress.done();

  clear && clear();
  clear = null;
};

export default router;
