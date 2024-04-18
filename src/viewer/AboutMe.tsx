import { Divider, Typography } from 'antd';

import { Icon } from '@/components';

import styles from './styles/AboutMe.module.less';

const { Paragraph, Title } = Typography;

const AboutMe = () => {
  return (
    <div className={styles.aboutMe}>
      <div className={styles.tips}>
        <h2>
          <Icon
            style={{ marginRight: 6 }}
            svgStyle={{ verticalAlign: 'bottom' }}
            color="var(--color-primary)"
            icon="material-symbols:info"
            size={25}
          />
          人生啊
        </h2>

        <p>
          泡夜店、纹身、买醉，这些事情看起来很酷，但其实一点难度都没有，只要你想办到随时都可以。
        </p>

        <p>
          真正酷的，应该是那些不容易办到的，比如：读书、赚钱、健身、早睡早起、孝顺父母，用炙热的心爱人爱己，用你毕生的精力去战胜一个个专业领域。
        </p>

        <p>
          <strong>低级的欲望放纵即可获得，高级的欲望只有克制才能达成</strong>
        </p>
      </div>

      <Divider />

      <Typography>
        <Title level={3}>介绍</Title>

        <Paragraph style={{ fontSize: 'var(--font-size-base)' }}>
          姓杨，目前是一名前端开发工程师，爱好编程、知识原理、科学、逆向工程、历史(三国)，喜欢看书、动漫、电影、游戏。
          借用三毛的一句话介绍自己：
        </Paragraph>

        <Paragraph style={{ fontSize: 'var(--font-size-base)' }}>
          <blockquote>
            请不要用你的想法来揣测我，我本身就是一个不喜欢主动的人；虽然灵魂有趣，但不爱表达；死倔，也慢热；
            遇到懂我的人是幸运，遇不到也是正常了；沉默，喜欢独处，三观正；比你想象的深情，也比你以为的冷漠。
          </blockquote>
        </Paragraph>

        <Paragraph style={{ fontSize: 'var(--font-size-base)' }}>
          喜欢龙叔、星爷和所有优秀的电影；喜欢迪迦、空我、亚极陀和所有优秀的特摄或动漫；喜欢玩王者但现在不玩
          ，喜欢玩三国杀但偶尔玩，没怎么玩过电脑大作；喜欢三国演义，从小时候看纸质版三国演义开始的。
        </Paragraph>

        <Paragraph style={{ fontSize: 'var(--font-size-base)' }}>
          讨厌笑贫不笑娼的社会，讨厌草台班子，讨厌如今的大部分影视，无演技，无剧情。
        </Paragraph>

        <Title level={3}>编程之路</Title>

        <Paragraph style={{ fontSize: 'var(--font-size-base)' }}>
          2020
          年因为疫情，在家躺平了一段时间，期间接触到了刷机，程序逆向，对这类知识感到好奇，开始通过培训、自学的
          方式学习编程，成为了一名前端。
        </Paragraph>

        <Paragraph style={{ fontSize: 'var(--font-size-base)' }}>
          我的学习方式偏向于书籍，然后是官方文档、博客文章、视频等；很多人跟我说过，阅读官方文档是最好的学习方式，
          但我的理解不同，官方文档固然权威，但大部分只会告诉你如何使用、API、最佳实践等，而好的书籍，
          包含作者对语言、框架的理解，多年使用的经验，源码、原理的解读，让你能够知其然而知其所以然，
          这也是我从程序逆向中学到的：<strong>溯其根源，达其本质</strong>。
        </Paragraph>

        <Paragraph style={{ fontSize: 'var(--font-size-base)' }}>
          记得在刚学前端的时候，我在网上看到了一篇不错的 JQuery
          文章，发到了学习交流群，一位老师看到说了一句：
        </Paragraph>

        <Paragraph style={{ fontSize: 'var(--font-size-base)' }}>
          <blockquote>JQuery 已经不学了，JQuery 已经过时了。</blockquote>
        </Paragraph>

        <Paragraph style={{ fontSize: 'var(--font-size-base)' }}>
          我的回答大概是：
        </Paragraph>

        <Paragraph style={{ fontSize: 'var(--font-size-base)' }}>
          <blockquote>学一下他的设计思想，这个不会过时吧。</blockquote>
        </Paragraph>

        <Paragraph style={{ fontSize: 'var(--font-size-base)' }}>
          现在我依旧如此认为。
        </Paragraph>
      </Typography>
    </div>
  );
};

export default AboutMe;
