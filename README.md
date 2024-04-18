# ILLUSTRATE

博客演示站

## 介绍

最开始想做博客是因为一个朋友分享了他的 [博客站点]，心血来潮开始搭建自己的博客，从 [Hexo] 到 [Vuepress]， 中间也输出了一些自己的文章，为了学习 React 也编写了一个在线演示效果的 [项目]，是为了和博客项目互补的。后来为了更好的学习 React，也为了将博客和演示站结合起来， 从 0 到 1 搭建了目前的这个项目。

## 网站特色

- SPA，单页应用程序，加入了 Server Worker 缓存，使网站的性能、SEO 都不逊色于服务端渲染的程序，并支持离线访问。
- 预渲染，使用预渲染技术为每个 SPA 路由页面生成静态的 html，使程序的 SEO 更上一层楼， 并支持静态网站托管服务下使用 history 路由。
- PWA，使用 PWA 依赖的一系列技术完成，可以让 web 程序有类似桌面或移动端程序的体验。
- 自定义的路由，使用自实现的路由来对路由跳转时页面的行为进行精细的控制，允许路由加载期间继续执行操作。
- 可配置，支持自定义配置网站行为，如禁用 Service Worker 缓存、清理已加载缓存。
- 案例预览，网站提供了很多自己编写的案例，支持在线查看代码并预览效果。
- 沉浸式阅读、主题切换、全屏模式

## 网站技术与规划

网站使用 `React` + `Vite` + T`ypeScript` 作为基础架构，搭配 `ESLint`、`StyleLint`、`CommitLint`、`Prettier` 规范项目，`Antd` 实现网站的部分 UI，图标使用 `iconify/Material Symbols` 与 `@ant-design/icons`，使用 `postcss` 和 `less` 处理 css，`MDX` 编译 markdown，`zustand` 作为全局状态管理。

网站目前部署在 Github Pages 中，是一个纯静态托管的服务，使用域名解析到国内域名，后续会学习服务端相关知识，并将网站迁移。

现在在慢慢的完善网站并填充内容，目的是将博客和演示站很好的融合，可以作为一个工具站使用。

## 联系我

若本站文章中引用的素材侵犯了您的权益，或对部分内容有更好的建议，请联系：

- QQ：725441272
- 微信：hxy3130gbs
- Email：yang_xuheng@163.com

[博客站点]: https://yang-xianzhu.github.io/
[Hexo]: https://hexo.io/zh-cn/
[Vuepress]: https://vuepress.vuejs.org/zh/
[项目]: https://github.com/yuanyxh/illustrate
