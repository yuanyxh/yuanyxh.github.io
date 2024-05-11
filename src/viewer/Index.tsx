import { Typography } from 'antd';

import styles from './styles/Index.module.less';

const Exhibit = () => {
  return (
    <section className={styles.exhibit}>
      <div>
        <div className={styles.logo}>
          <img src="/logo.webp" alt="logo" />
        </div>

        <Typography.Title
          style={{ fontWeight: 400 }}
          level={2}
          title={import.meta.env.VITE_APP_TITLE}
        >
          {import.meta.env.VITE_APP_TITLE}
        </Typography.Title>

        <Typography.Title
          style={{ marginTop: 0, fontWeight: 400 }}
          level={2}
          title="我是 yuanyxh，一名前端开发者，非 cv 工程师。"
        >
          我是 yuanyxh，一名前端开发者，非 cv 工程师。
        </Typography.Title>

        <Typography.Paragraph
          type="secondary"
          title="站在巨人的肩膀上/If I have seen further than others, it is by standing
        upon the shoulders of giants."
        >
          站在巨人的肩膀上/If I have seen further than others, it is by standing
          upon the shoulders of giants.
        </Typography.Paragraph>
      </div>
    </section>
  );
};

const Index = () => {
  return (
    <main className={styles.main}>
      <Exhibit />
    </main>
  );
};

export default Index;
