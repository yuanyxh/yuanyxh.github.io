import { Divider, Typography } from 'antd';

import { Link } from '@/router';

import { Icon } from '@/components';

import styles from './styles/AboutSite.module.less';

const { Paragraph, Title, Text } = Typography;

const AboutSite = () => {
  return (
    <div className={styles.aboutSite}>
      <div className={styles.tips}>
        <h2>
          <Icon
            style={{ marginRight: 6 }}
            svgStyle={{ verticalAlign: 'bottom' }}
            color="var(--color-primary)"
            icon="material-symbols:info"
            size={25}
          />
          设计
        </h2>

        <p>
          <strong>一个好的、优秀的网站应该做到自己常用</strong>
        </p>
      </div>

      <Divider />

      <Typography>
        <Title level={3}>介绍</Title>

        <Paragraph style={{ fontSize: 16 }}>
          最开始想做博客是因为一个朋友分享了他的&nbsp;
          <Link
            style={{ color: 'var(--color-primary)' }}
            to="https://yang-xianzhu.github.io/"
          >
            博客站点
          </Link>
          ，心血来潮开始搭建自己的博客，从&nbsp;
          <Link
            style={{ color: 'var(--color-primary)' }}
            to="https://hexo.io/zh-cn/"
          >
            Hexo
          </Link>
          &nbsp;到&nbsp;
          <Link
            style={{ color: 'var(--color-primary)' }}
            to="https://vuepress.vuejs.org/zh/"
          >
            Vuepress
          </Link>
          ，&nbsp;中间也输出了一些自己的文章，为了学习 React
          也编写了一个在线演示效果的&nbsp;
          <Link
            style={{ color: 'var(--color-primary)' }}
            to="https://github.com/yuanyxh/illustrate"
          >
            项目
          </Link>
          ，是为了和博客项目互补的。后来为了更好的学习
          React，也为了将博客和演示站结合起来， 从 0 到 1 搭建了目前的这个项目。
        </Paragraph>

        <Title level={3}>网站特色</Title>

        <Paragraph style={{ fontSize: 16 }}>
          <ul>
            <li style={{ padding: '4px' }}>
              SPA，单页应用程序，加入了 Server Worker 缓存，使网站的性能、SEO
              都不逊色于服务端渲染的程序，并支持离线访问。
            </li>
            <li style={{ padding: '4px' }}>
              预渲染，使用预渲染技术为每个 SPA 路由页面生成静态的 html，使程序的
              SEO 更上一层楼， 并支持静态网站托管服务下使用 history 路由。
            </li>
            <li style={{ padding: '4px' }}>
              PWA，使用 PWA 依赖的一系列技术完成，可以让 web
              程序有类似桌面或移动端程序的体验。
            </li>
            <li style={{ padding: '4px' }}>
              自定义的路由，使用自实现的路由来对路由跳转时页面的行为进行精细的控制，允许路由加载期间继续执行操作。
            </li>
            <li>
              可配置，支持自定义配置网站行为，如禁用 Service Worker
              缓存、清理已加载缓存。
            </li>
            <li style={{ padding: '4px' }}>
              案例预览，网站提供了很多自己编写的案例，支持在线查看代码并预览效果。
            </li>
            <li style={{ padding: '4px' }}>沉浸式阅读、主题切换、全屏模式</li>
          </ul>
        </Paragraph>

        <Title level={3}>网站技术与规划</Title>

        <Paragraph style={{ fontSize: 16 }}>
          网站使用 <Text code>React</Text> + <Text code>Vite</Text> +{' '}
          <Text code>TypeScript</Text>
          作为基础架构，搭配 <Text code>ESLint</Text>、
          <Text code>StyleLint</Text>、<Text code>CommitLint</Text>、
          <Text code>Prettier</Text>
          规范项目，<Text code>Antd</Text> 实现网站的部分 UI，图标使用{' '}
          <Text code>iconify/Material Symbols</Text> 与{' '}
          <Text code>@ant-design/icons</Text>，使用 <Text code>postcss</Text> 和{' '}
          <Text code>less</Text> 处理 css，<Text code>MDX</Text> 编译 markdown，
          <Text code>zustand</Text> 作为全局状态管理。
        </Paragraph>

        <Paragraph style={{ fontSize: 16 }}>
          网站目前部署在 Github Pages
          中，是一个纯静态托管的服务，使用域名解析到国内域名，后续会学习服务端相关知识，并将网站迁移。
        </Paragraph>

        <Paragraph style={{ fontSize: 16 }}>
          现在在慢慢的完善网站并填充内容，目的是将博客和演示站很好的融合，可以作为一个工具站使用。
        </Paragraph>

        <Title level={3}>联系我</Title>

        <Paragraph style={{ fontSize: 16 }}>
          若本站文章中引用的素材侵犯了您的权益，或对部分内容有更好的建议，请联系：
        </Paragraph>

        <Paragraph style={{ fontSize: 16 }}>
          <ul>
            <li>
              <span
                style={{
                  display: 'inline-block',
                  textAlignLast: 'justify',
                  width: 55
                }}
              >
                QQ：
              </span>
              725441272
            </li>

            <li>
              <span
                style={{
                  display: 'inline-block',
                  textAlignLast: 'justify',
                  width: 55
                }}
              >
                微信：
              </span>
              hxy3130gbs
            </li>

            <li>
              <span
                style={{
                  display: 'inline-block',
                  textAlignLast: 'justify',
                  width: 55
                }}
              >
                Email：
              </span>
              yang_xuheng@163.com
            </li>
          </ul>
        </Paragraph>
      </Typography>
    </div>
  );
};

export default AboutSite;
