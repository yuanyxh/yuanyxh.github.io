---
title: 个人博客搭建 - 基于Hexo + Next + Github
date: 2022-10-21 09:21:00
author: yuanyxh
category:
  - 站点建设
description: 基于 Hexo 框架，搭配 Next 主题搭建自己的第一个博客，并配合 Github Pages 免费服务，让别人也能访问你的博客！
--- 

## 准备工作

博客基于 [Hexo] 搭建，使用主题为 [Next]， 为保证过程顺利，需要先做一些准备，包括需要使用的依赖及账号，搭建环境为 Windows。

### 依赖

#### Node.js

Node.js 是一个开源、跨平台的 JavaScript 运行时环境，基于 Google 的 V8 引擎；我们在接下来的操作中处处离不开 Node 与 NPM(Node Package Manager)，安装请看：[Node.js官方网站][Node]，NPM 会与 Node.js 一起安装，安装后在 cmd 窗口键入以下命令验证

```shell
node -v

npm -v
```

出现版本号则说明安装成功。

#### Git

Git 是一种分布式开源版本控制系统(VCS)，可以理解为仓库，管理项目代码，可以管理本地仓库与远程仓库，我们主要用来推送博客至 Github 远程仓库更新个人博客网站。[Git 官网][Git]，关于 Git 的安装较为复杂，推荐一篇详细讲解的文章：[Git 详细安装教程][Git 详细安装]。

### 相关账号注册

#### Github

说到Github，相信大家都不会陌生，它是全球最大的同性交友网站:smirk:，提供了一系列的免费服务。前往 [Github 官网][Github] 注册账号。

#### 阿里云

主要用于自定义域名，若无需求可无视，[阿里云官网][aliyun]，直接使用支付宝账号注册登录即可。

#### LeanCloud

用于存放评论数据，若无需求可无视，[LeanCloud 官网][LeanCloud]，也可以暂时放置，后面介绍评论系统时一并注册。

## 博客搭建

### 本地搭建

Hexo 是基于 Node 的博客框架，能够帮助我们快速生成静态站点，使用需要先安装，输入以下命令

```shell
npm install hexo-cli -g   # g 表示 global, 全局安装
```

如果长时间下载不下来可以切换 npm 源为淘宝镜像

```shell
npm config set registry https://registry.npmmirror.com

npm config get registry # 验证是否成功
```

安装后就可以通过 `hexo init 博客存放目录` 命令初始化博客雏形

```shell
hexo init blog

cd ./blog          # 进入目录
```

初始化的文件目录大概如下

```directory
|-- blog
    |-- .gitignore               # git 忽略文件
    |-- package-lock.json
    |-- package.json             # 项目信息与配置
    |-- _config.landscape.yml    # landscape 主题配置
    |-- _config.yml              # 站点配置
    |-- .github
    |   |-- dependabot.yml
    |-- scaffolds                # 模板目录
    |   |-- draft.md               # 草稿模板
    |   |-- page.md                # 页面模板
    |   |-- post.md                # 文章模板
    |-- source                   # 资源目录
    |   |-- _posts                 # 文章目录
    |       |-- hello-world.md       # 初始化自带文章
    |-- themes                   # 所有主题存放目录
        |-- .gitkeep
```

依次键入命令

```shell
hexo new title  # 创建一篇名为 title 的文章，在 _posts 目录下

hexo g          # g 表示 generate，生成静态文件

hexo s          # s 表示 server，开启一个本地服务器，默认为 http://localhost:4000
```

访问 <http://localhost:4000>，即可看到网站雏形

![hexo_init_blog](http://qkc148.bvimg.com/18470/0e2a1a239bc219de.png '初始化')

默认主题为 landscape，我们将其更换为 [Next]，先卸载 landscape

```shell
npm un hexo-theme-landscape
```

安装 [Next]

```shell
git clone https://github.com/next-theme/hexo-theme-next themes/next
```

注意，git 配置了 ssh 要使用以下命令

```shell
git clone git@github.com:next-theme/hexo-theme-next.git themes/next
```

此时 themes 目录下会多出一个 next 目录，然后修改根目录站点配置 `_config.yml` 文件

```yml
# _config.yml

#theme: landscape
theme: next
```

可以看到主题已经改变了

![next](http://qkc148.bvimg.com/18470/9a468b2b731affad.png 'next 主题')

### 链接 Github Pages

新建 Github 仓库，仓库名应为 `Github 用户名.github.io`，复制仓库链接（配置了 ssh 应复制 ssh 链接），修改站点配置

```yml
# _config.yml

 deploy:
   type: git
   repo: 上一步复制的链接
   branch: master
```

安装 git 部署插件

```shell
npm install hexo-deployer-git --save
```

键入以下命令

```shell
hexo clean  # 清除缓存

hexo g

hexo d      # d表示deploy，部署至 Github
```

然后访问 `Github 用户名.github.io` 即可

### 自定义域名

首先你需要有一个域名，我用的是阿里云，所以演示也是基于阿里云官网操作，先登录阿里云，找到域名解析，点添加设置，添加如下

![parseDNS](http://qkc148.bvimg.com/18470/46026a0a9acbe2ad.png '解析DNS')

其中第一项记录值需要替换为 `Github 用户名.github.io`，第二项纪录值可以在 cmd 窗口中输入以下命令得知

```shell
ping 用户名.github.io
```

第三项记录值是 Github 官方的 IP，有被更换的可能，可以前往 [Github 官方文档][Github Docs] 处查看

![Github IP](http://qkc148.bvimg.com/18470/fb8d6ba8afa651bf.png 'Github 官方文档')

设置解析后前往 仓库设置为自己的域名：Settings -> Pages

![domain](http://qkc148.bvimg.com/18470/8b4afa23cced642e.png '设置域名')

在 `source` 目录下新建 `CNAME` 文件，输入自己的域名（不要带 www）后保存，再次输入以下命令

```shell
hexo clean

hexo g

hexo d
```

如果每次执行嫌麻烦，可以在项目根目录新建 `run.bat` 文件，写入 `hexo clean && hexo g && hexo d`，保存即可，以后需要发布双击此文件就会自动执行命令，想要在本地运行可以将 `d` 换成 `s`。

## Hexo 配置

### 网站标题、关键字等

站点配置，修改根目录 `_config.yml`。

```yml
#_config.yml

# Site
title: yuanyxh - 学习与沉淀       # 站点标题
subtitle: 学以致用                # 站点二级标题
description: 读万卷书，行万里路    # 站点描述
keywords: 博客, web, 前端, JavaScript, React, Vue, Node, Java, C/C++, Frida, Xposed  # 站点关键词
author: yuanyxh                   # 作者
language: zh-CN                   # 语言
timezone: Asia/Shanghai           # 时区
```

以上内容建议认真填写，会影响 `SEO`。

### 添加黑暗模式

[Next] 默认支持黑暗模式，但无法手动切换，使用 [drakmode.js][Drakmode.js] 手动添加支持，主题配置

```yml
# _config.next.yml

vendors:
  # cdn 引用插件
  darkmode_js: https://cdn.jsdelivr.net/npm/darkmode-js@1.5.7/lib/darkmode-js.min.js

darkmode_js:
  enable: true   # 启用插件
```

在 `/themes/next/layout/_scripts/vendors.njk` 中添加内容

```njk
# vendors.njk

{# Customize darkmode.js - Declaration #}
{%- if theme.darkmode_js.enable %}
  <script src="{{ theme.vendors.darkmode_js }}"></script>
{%- endif %}

{# Customize darkmode.js - Invokation #}
{%- if theme.darkmode_js.enable %}
<script>
var options = {
  bottom: '64px', // default: '32px'
  right: 'unset', // default: '32px'
  left: '32px', // default: 'unset'
  time: '0.5s', // default: '0.3s'
  mixColor: 'transparent', // default: '#fff'
  backgroundColor: 'transparent',  // default: '#fff'
  buttonColorDark: '#100f2c',  // default: '#100f2c'
  buttonColorLight: '#fff', // default: '#fff'
  saveInCookies: true, // default: true,
  label: '🌓', // default: ''
  autoMatchOsTheme: true // default: true
}
const darkmode = new Darkmode(options);
darkmode.showWidget();
</script>
{%- endif %}
```

此时可以手动切换模式，但样式部分还需要更改，当切换到黑暗模式时，`drakmode.js` 会在 `body` 元素中添加 `darkmode--activated` 类，我们新建 `themes/next/source/css/_custom/drakmode.styl` 样式文件，写入以下内容

```styl
# drakmode.styl

.darkmode--activated {
  --body-bg-color: $body-bg-color-dark;
  --content-bg-color: $content-bg-color-dark;
  --card-bg-color: $card-bg-color-dark;
  --text-color: $text-color-dark;
  --blockquote-color: $blockquote-color-dark;
  --link-color: $link-color-dark;
  --link-hover-color: $link-hover-color-dark;
  --brand-color: $brand-color-dark;
  --brand-hover-color: $brand-hover-color-dark;
  --table-row-odd-bg-color: $table-row-odd-bg-color-dark;
  --table-row-hover-bg-color: $table-row-hover-bg-color-dark;
  --menu-item-bg-color: $menu-item-bg-color-dark;

  --btn-default-bg: $btn-default-bg-dark;
  --btn-default-color: $btn-default-color-dark;
  --btn-default-border-color: $btn-default-border-color-dark;
  --btn-default-hover-bg: $btn-default-hover-bg-dark;
  --btn-default-hover-color: $btn-default-hover-color-dark;
  --btn-default-hover-border-color: $btn-default-hover-border-color-dark;

  --highlight-background: $highlight-background-dark;
  --highlight-foreground: $highlight-foreground-dark;
  --highlight-gutter-background: $highlight-gutter-background-dark;
  --highlight-gutter-foreground: $highlight-gutter-foreground-dark;

  img {
    opacity: .75;
    &:hover {
      opacity: .9;
    }
  }

  code {
   color: #69dbdc;
   background: transparent;
 }
}
```

然后在 `themes/next/source/css/main.styl` 中添加引用

```styl
# main.styl

@import '_custom/darkmode.styl';
```

### 替换 Markdown 渲染引擎

[Hexo] 默认的渲染引擎缺少了很多功能，我们对他进行替换，先卸载默认渲染引擎

```shell
npm un hexo-renderer-marked --save
```

安装 `hexo-renderer-markdown-it` 插件

```shell
npm i hexo-renderer-markdown-it --save
```

站点配置添加内容

```yml
# _config.yml

markdown:
  preset: "default"
  render:
    html: true
    xhtmlOut: false
    langPrefix: "language-"
    breaks: true
    linkify: true
    typographer: true
    quotes: "“”‘’"
  enable_rules:
  disable_rules:
  plugins:
    - markdown-it-abbr
    - markdown-it-cjk-breaks
    - markdown-it-deflist
    - markdown-it-emoji
    - markdown-it-footnote
    - markdown-it-ins
    - markdown-it-mark
    - markdown-it-sub
    - markdown-it-sup
    - markdown-it-checkbox
    - markdown-it-imsize
    - markdown-it-expandable
    - name: markdown-it-container
      options: success
    - name: markdown-it-container
      options: tips
    - name: markdown-it-container
      options: warning
    - name: markdown-it-container
      options: danger
  anchors:
    level: 2
    collisionSuffix: ""
    permalink: false
    permalinkClass: "header-anchor"
    permalinkSide: "left"
    permalinkSymbol: "¶"
    case: 0
    separator: "-"
```

安装以下插件

```shell
npm i markdown-it-checkbox

npm i markdown-it-imsize

npm i markdown-it-expandable
```

## Next 配置

默认提供的 [Next] 只提供了部分功能，我们可以修改默认配置来进行扩展，在项目根目录新建 `_config.next.yml` 主题配置文件，这个文件中的配置优先于 next 主题中的 `_config.yml`。

### 替换布局

next 默认使用的布局为 Muse，这里我使用的是Mist，`#` 代表注释。将内容复制粘贴至 `_config.next.yml`。

```yml
# _config.next.yml

# Schemes
#scheme: Muse
scheme: Mist
#scheme: Pisces
#scheme: Gemini
```

### 菜单项

可以按需添加修改，不需要显示的菜单项注释即可。

```yml
#_config.next.yml

menu:
  home: / || fa fa-home                   # 首页
  tags: /tags/ || fa fa-tags              # 标签
  categories: /categories/ || fa fa-th    # 分类
  archives: /archives/ || fa fa-archive   # 归档
  schedule: /schedule/ || fa fa-calendar  # 日程表
  sitemap: /sitemap.xml || fa fa-sitemap  # 站点地图
  about: /about/ || fa fa-user            # 关于
  commonweal: /404/ || fa fa-heartbeat    # 404

# Enable / Disable menu icons / item badges.
menu_settings:
  icons: true    # 是否显示图标
  badges: false  # 是否显示右上角文章数量
```

此时我们点击菜单项会发现除首页和归档外其他菜单项都会丢失页面，因为我们还没创建对应的页面，使用 `hexo new page 页面名`

```shell
hexo new page tags        # 创建标签页

hexo new page categories  # 创建分类页

hexo new page about       # 创建关于页
```

此时 source 会多出几个文件夹与之对应。

既然有标签和分类，那我们要怎么将文章标记和归类呢，以分类为例，我们找到 `source/categories/` 下的 `index.md`，修改内容为

```yml
# source/categories/index.md

---
type: categories
title: 文章分类
date: 2022-10-19 13:30:10
---
```

可以看到就是加了一个 type 字段指明这个 Markdown 文件用来分类，这样我们的文章想要分类时可以这样

```yml
# source/_posts/个人博客搭建 - 基于Hexo + Next + Github.md

---
title: 个人博客搭建 - 基于Hexo + Next + Github
categories:
  - 站点建设  # 指明分类
date: 2022-10-21 09:21:00
description: 基于 Hexo 框架，搭配 Next 主题搭建自己的第一个博客，并配合 Github Pages 免费服务，让别人也能访问你的博客！          # 添加文章描述
---
```

### 添加本地搜索

安装搜索插件

```shell
npm install hexo-generator-search
```

在站点配置文件中添加内容

```yml
# _config.yml

search:
  path: search.xml        # 查找路径，search.xml 是插件默认生成的检索文件
  field: post             # 查找类型
  content: true           # 是否开启查找文章内容
  template: ./search.xml
```

开启主题的本地搜索，添加内容

```yml
# _config.next.yml

local_search:
  enable: true
  # If auto, trigger search by changing input.
  # If manual, trigger search by pressing enter key or search button.
  trigger: auto
  # Show top n results per article, show all results by setting to -1
  top_n_per_article: 1
  # Unescape html strings to the readable one.
  unescape: false
  # Preload the search data when the page loads.
  preload: false
```

### 修改网站图标

以下配置不用添加，在 `theme/next/source/images` 目录下，将你想要使用的图标复制进去并重命名为 `favicon-16x16-next.png` 和 `favicon-32x32-next.png`

```yml
favicon:
  small: /images/favicon-16x16-next.png
  medium: /images/favicon-32x32-next.png
  apple_touch_icon: /images/apple-touch-icon-next.png
  safari_pinned_tab: /images/logo.svg
  #android_manifest: /manifest.json
```

### 添加版权

```yml
# _config.next.yml

creative_commons:
  license: by-nc-sa   # 使用的协议
  # Available values: big | small
  size: small         # 大小
  sidebar: false      # 侧边栏是否显示
  post: true          # 文章是否显示
  language: zh-CN     # 语言
```

配置后如下所示

![copyrig](http://qkc148.bvimg.com/18470/e82c64e56b76f575.png '设置域名')

### 配置侧边栏

```yml
# _config.next.yml

sidebar:
  position: right    # 侧边栏位置
  display: hide      # 侧边栏默认隐藏
  padding: 18
  offset: 12

avatar:
  url: /images/Only_Me_Edit.png  # 头像路径
  rounded: true                  # 是否显示圆形头像
  rotated: false                 # 鼠标移入是否旋转

site_state: true    # 是否显示日志、分类等

# 设置社交链接，可添加删除
social:
  GitHub: https://github.com/yuanyxh || fab fa-github
  QQ: http://wpa.qq.com/msgrd?v=3&uin=725441272&site=qq&menu=yes || fa-brands fa-qq
  掘金: https://juejin.cn/user/2881148117060749 || fa-solid fa-layer-group
  #E-Mail: mailto:yourname@gmail.com || fa fa-envelope
  #Weibo: https://weibo.com/yourname || fab fa-weibo
  #Google: https://plus.google.com/yourname || fab fa-google
  #Twitter: https://twitter.com/yourname || fab fa-twitter
  #FB Page: https://www.facebook.com/yourname || fab fa-facebook
  #StackOverflow: https://stackoverflow.com/yourname || fab fa-stack-overflow
  #YouTube: https://youtube.com/yourname || fab fa-youtube
  #Instagram: https://instagram.com/yourname || fab fa-instagram
  #Skype: skype:yourname?call|chat || fab fa-skype

social_icons:
  enable: true         # 是否启用社交链接对应图标
  icons_only: false    # 是否只显示图标
  transition: false
```

### 显示文章字数与阅读时长

安装 `hexo-symbols-count-time` 插件

```shell
npm install hexo-symbols-count-time
```

站点配置

```yml
# _config.yml

symbols_count_time:
  symbols: true               # 启用字数统计
  time: true                  # 启用阅读时长估计
  total_symbols: true         # 字符总数
  total_time: true            # 总时长
  exclude_codeblock: false    # 是否包含代码块
  awl: 4
  wpm: 275
  suffix: "mins."
```

主题配置

```yml
# _config.next.yml

symbols_count_time:
  separated_meta: true
  item_text_total: false
```

### 文章添加时效性提示

根目录新建 `/scripts/injector.js` 文件，写入以下内容

```javascript
//注入文章过期提示
hexo.extend.injector.register('body_end', `<script src="/js/outdate.js"></script>`,'post')
```

新建 `/source/js/outdate.js` 文件，写入内容

```javascript
(function() {
  //不同的日期显示不同的样式，200 天为黄色提示，400天为红色提示，可以自己定义。
  let warningDay = 200;
  let errorDay = 400;
  // 确保能够获取到文章时间以及在文章详情页
  let times = document.getElementsByTagName('time');
  if (times.length === 0) { return; }
  let posts = document.getElementsByClassName('post-body');
  if (posts.length === 0) { return; }

  // 获取系统当前的时间
  let pubTime = new Date(times[0].dateTime);  /* 文章发布时间戳 */
  let now = Date.now()  /* 当前时间戳 */
  let interval = parseInt(now - pubTime)
  let days = parseInt(interval / 86400000)
  /* 发布时间超过指定时间（毫秒） */
  //note warning 以及 note danger 是 Next 主题的自定义模板语法，如果使用其他主题，请自行更改样式以达到最佳显示效果
  if (interval > warningDay*3600*24*1000 && interval < errorDay*3600*24*1000){
    posts[0].innerHTML = '<div class="note warning">' +
      '<h5>文章时效性提示</h5><p>这是一篇发布于 ' + days + ' 天前的文章，部分信息可能已发生改变，请注意甄别。</p>' +
      '</div>' + posts[0].innerHTML;
    }else if(interval >= errorDay*3600*24*1000){
      posts[0].innerHTML = '<div class="note danger">' +
        '<h5>文章时效性提示</h5><p>这是一篇发布于 ' + days + ' 天前的文章，部分信息可能已发生改变，请注意甄别。</p>' +
        '</div>' + posts[0].innerHTML;
    }
  })();
```

文章超过200天则显示过时提示

### 代码块添加复制功能

主题配置添加

```yml
# _config.next.yml

codeblock:
  copy_button:
    enable: true
    # Available values: default | flat | mac
    style: mac
```

### 添加评论系统

[Hexo博客进阶：为 Next 主题添加 Waline 评论系统][11]
[Waline 官方文档][Waline]

::: warning

**注意**
根据 [LeanCloud] 官方描述，目前国际版已不支持国内访问，具体看 [LeanCloud 国际版共享域名不再向中国大陆提供服务][LeanCloud CN]
:::

这意味着国内网络无法获取并发布评论数据，本站后续可能会替换评论系统，如需要其他评论系统可看 [Next 文档 - 评论系统][Next Comments]

## 网站 SEO 优化

SEO，即搜索引擎优化，这里的 SEO 优化主要针对项目的体积，加速站点首屏加载时间，实际还要看站点内容是否优质，有效用户访问量等。

### 压缩代码

安装插件

```shell
npm install hexo-neat --save
```

站点配置添加

```yml
# _config.yml

# 开启压缩
neat_enable: true
neat_html:
  enable: true
  exclude:
neat_css:
  enable: true
  exclude:
    - '**/*.min.css'
neat_js:
  enable: true
  mangle: true
  output:
  compress:
  exclude:
    - '**/*.min.js'
    - '**/index.js'
```

### 站点收录

[如何让搜索引擎收录我的站点][9]  
[Next SEO][10]

### 网站性能测试

一个好的网站，性能是必须要好的，如果用户访问你的网站要等很久，或者网站页面卡顿，就会降低用户的满意度，从而流失大量用户，这里推荐一个性能测试网站，专门用于测试网站性能，并生成统计报告

[PageSpeed Insights]

## 参考文章

> [GitHub+Hexo 搭建个人网站详细教程][1]  
> [hexo博客站点sitemap的使用][2]  
> [Hexo Next 主题进阶设置][3]  
> [Hexo Next 8.x 主题添加可切换的暗黑模式][4]  
> [Hexo搭建的GitHub博客之优化大全][5]  
> [Hexo选择更高级的Markdown渲染器][6]  
> [Hexo-NexT 加载性能优化][7]  
> [Hexo博客进阶：为 Next 主题的 Hexo 博客内容添加文章过期/时效提示][8]  
> [Hexo + Next + Pages 个人博客 - SEO优化][9]  
> [Hexo博客进阶：为 Next 主题添加 Waline 评论系统][11]

[Node]: https://nodejs.org/zh-cn/
[Git]: https://git-scm.com/、
[Git 详细安装]: https://blog.csdn.net/mukes/article/details/115693833
[Github]: https://github.com/
[aliyun]: https://www.aliyun.com/product/ecs
[LeanCloud]: https://console.leancloud.app/apps
[Hexo]: https://hexo.io/zh-cn/
[Next]: https://theme-next.js.org/
[Github Docs]: https://docs.github.com/cn/pages
[Drakmode.js]: https://github.com/sandoche/Darkmode.js
[1]: https://zhuanlan.zhihu.com/p/26625249
[2]: https://eericzeng.github.io/2019/07/14/hexo%E5%8D%9A%E5%AE%A2%E7%AB%99%E7%82%B9sitemap%E7%9A%84%E4%BD%BF%E7%94%A8/
[3]: https://www.qtmuniao.com/2019/10/16/hexo-theme-landscaping/
[4]: https://www.techgrow.cn/posts/abf4aee1.html
[5]: https://zhuanlan.zhihu.com/p/33616481
[6]: https://blog.csdn.net/qq_42951560/article/details/123596899
[7]: https://tding.top/archives/7e5b094d.html
[8]: https://qianfanguojin.top/2022/09/07/Hexo%E5%8D%9A%E5%AE%A2%E8%BF%9B%E9%98%B6%EF%BC%9A%E4%B8%BA-Next-%E4%B8%BB%E9%A2%98%E7%9A%84-Hexo-%E5%8D%9A%E5%AE%A2%E5%86%85%E5%AE%B9%E6%B7%BB%E5%8A%A0%E6%96%87%E7%AB%A0%E8%BF%87%E6%9C%9F-%E6%97%B6%E6%95%88%E6%8F%90%E7%A4%BA/
[9]: https://www.linjiexin.com/post/blog-seo/
[10]: https://theme-next.js.org/docs/theme-settings/seo.html
[11]: https://qianfanguojin.top/2022/01/20/Hexo%E5%8D%9A%E5%AE%A2%E8%BF%9B%E9%98%B6%EF%BC%9A%E4%B8%BA-Next-%E4%B8%BB%E9%A2%98%E6%B7%BB%E5%8A%A0-Waline-%E8%AF%84%E8%AE%BA%E7%B3%BB%E7%BB%9F/
[PageSpeed Insights]: https://pagespeed.web.dev/?utm_source=psi&utm_medium=redirect
[Waline]: https://waline.js.org/guide/get-started.html
[LeanCloud CN]: https://forum.leancloud.cn/t/2022-8/25408
[Next Comments]: https://theme-next.js.org/docs/third-party-services/comments
