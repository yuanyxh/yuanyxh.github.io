import { path } from '@vuepress/utils';
import { hopeTheme } from 'vuepress-theme-hope';
import { zhNavbar } from './navbar/index.js';
import { zhSidebar } from './sidebar/index.js';

export default hopeTheme({
  hostname: 'https://yuanyxh.com',

  author: {
    name: 'yuanyxh',
    url: 'https://yuanyxh.com',
    email: 'yang_xuheng@163.com'
  },

  iconAssets: 'iconfont',

  logo: '/logo.png',

  repo: 'https://github.com/yuanyxh/yuanyxh.github.io',

  docsRepo: 'https://github.com/yuanyxh/yuanyxh.github.io',
  docsDir: '/src',
  docsBranch: 'source',

  pageInfo: ['Author', 'Original', 'Date', 'Category', 'Tag', 'ReadingTime'],

  themeColor: {
    blue: '#2196f3',
    red: '#f26d6d',
    green: '#3eaf7c',
    orange: '#fb9b5f'
  },

  fullscreen: true,

  sidebarSorter: ['readme', 'order', 'date'],

  navbarLayout: {
    left: ['Brand'],
    center: ['Links'],
    right: ['Language', 'Repo', 'Outlook', 'Search']
  },

  blog: {
    roundAvatar: true,
    description: '时间着急的，冲刷着，剩下了什么',
    medias: {
      GitHub: 'https://github.com/yuanyxh',
      Gitee: 'https://gitee.com/xuhengyang',
      JueJin: [
        'https://juejin.cn/user/2881148117060749',
        path.resolve(__dirname, 'public/assets/svg/juejin.svg')
      ],
      Zhihu: 'https://www.zhihu.com/people/yuanyxh',
      Wechat: 'hxy3130gbs',
      QQ: 'http://wpa.qq.com/msgrd?v=3&uin=725441272&site=qq&menu=yes',
      Youtube: 'https://www.youtube.com/channel/UC_-fmapbeuOd2DOu8W1Wb2Q',
      BiliBili: 'https://space.bilibili.com/29380273?spm_id_from=333.1007.0.0'
    }
  },

  locales: {
    // '/': {
    //   // navbar
    //   navbar: enNavbar,

    //   // sidebar
    //   sidebar: enSidebar,

    //   footer: 'Default footer',

    //   displayFooter: true,

    //   blog: {
    //     description: 'A FrontEnd programmer',
    //     intro: '/intro.html',
    //   },

    //   metaLocales: {
    //     editLink: 'Edit this page on GitHub',
    //   },
    // },

    /**
     * Chinese locale config
     */
    '/': {
      // navbar
      navbar: zhNavbar,

      // sidebar
      sidebar: zhSidebar,

      footer: '那么现在的我，学识太浅薄，还没有学会怎么去跟身边的人相处',

      displayFooter: true,

      blog: {
        description: '站在巨人的肩膀上',
        intro: '/intro.html'
      },

      // page meta
      metaLocales: {
        editLink: '编辑'
      }
    }
  },

  encrypt: {
    config: {
      // '/demo/encrypt.html': ['1234'],
    }
  },

  plugins: {
    blog: {
      autoExcerpt: true
    },

    seo: true,

    photoSwipe: true,

    copyCode: {
      duration: 1500,
      showInMobile: true
    },

    // If you don’t need comment feature, you can remove following option
    // The following config is for demo ONLY, if you need comment feature, please generate and use your own config, see comment plugin documentation for details.
    // To avoid disturbing the theme developer and consuming his resources, please DO NOT use the following config directly in your production environment!!!!!
    comment: {
      /**
       * Using Giscus
       */
      provider: 'Giscus',
      repo: 'yuanyxh/yuanyxh_blog_comment',
      repoId: 'R_kgDOIi7VEg',
      category: 'Announcements',
      categoryId: 'DIC_kwDOIi7VEs4CS4Eo'

      /**
       * Using Twikoo
       */
      // provider: "Twikoo",
      // envId: "https://twikoo.ccknbc.vercel.app",

      /**
       * Using Waline
       */
      // provider: "Waline",
      // serverURL: "https://vuepress-theme-hope-comment.vercel.app",
    },

    // Disable features you don’t want here
    mdEnhance: {
      align: true,
      attrs: true,
      chart: true,
      codetabs: true,
      container: true,
      demo: true,
      echarts: true,
      flowchart: true,
      gfm: true,
      imageLazyload: true,
      imageTitle: true,
      imageSize: true,
      include: true,
      katex: true,
      mark: true,
      mermaid: true,
      playground: {
        presets: ['ts', 'vue']
      },
      presentation: {
        plugins: ['highlight', 'math', 'search', 'notes', 'zoom']
      },
      stylize: [
        {
          matcher: 'Recommended',
          replacer: ({ tag }) => {
            if (tag === 'em')
              return {
                tag: 'Badge',
                attrs: { type: 'tip' },
                content: 'Recommended'
              };
          }
        }
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
      vuePlayground: true
    },

    pwa: {
      favicon: '/favicon.ico',
      cacheHTML: true,
      cachePic: true,
      appendBase: true,
      apple: {
        icon: '/assets/icon/apple-icon-152.png',
        statusBarColor: 'black'
      },
      msTile: {
        image: '/assets/icon/ms-icon-144.png',
        color: '#ffffff'
      },
      manifest: {
        icons: [
          {
            src: '/assets/icon/chrome-mask-512.png',
            sizes: '512x512',
            purpose: 'maskable',
            type: 'image/png'
          },
          {
            src: '/assets/icon/chrome-mask-192.png',
            sizes: '192x192',
            purpose: 'maskable',
            type: 'image/png'
          },
          {
            src: '/assets/icon/chrome-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/assets/icon/chrome-192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ],
        shortcuts: [
          {
            name: 'yuanyxh の blog',
            short_name: 'yuanyxh の blog',
            url: '/',
            icons: [
              {
                src: '/assets/icon/guide-maskable.png',
                sizes: '192x192',
                purpose: 'maskable',
                type: 'image/png'
              },
              {
                src: '/assets/icon/guide-monochrome.png',
                sizes: '192x192',
                purpose: 'monochrome',
                type: 'image/png'
              }
            ]
          }
        ]
      }
    }
  }
});
