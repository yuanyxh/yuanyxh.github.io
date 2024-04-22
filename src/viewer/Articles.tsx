import { Col, Divider, Row, Typography } from 'antd';

import type { ResolveRouteObject } from '@/router';
import { Link } from '@/router';

import { useArticles } from './hooks/useArticles';
import styles from './styles/Articles.module.less';

const ArticleItem = ({ article }: { article: ResolveRouteObject }) => {
  return (
    <Link to={article.fullPath}>
      <div className={styles.articleItem}>
        <div className={styles.preview}>
          <img
            loading="lazy"
            src={article.meta?.imageUrl}
            alt={article.meta?.title}
          />

          <div className={styles.descriptionWrapper}>
            <Typography.Paragraph
              className={styles.description}
              ellipsis={{
                rows: 2,
                tooltip: {
                  mouseEnterDelay: 0.2,
                  children: article.meta?.description
                }
              }}
            >
              {article.meta?.description}
            </Typography.Paragraph>
          </div>
        </div>

        <Divider style={{ margin: 0 }} />

        <div className={styles.title}>
          <Typography.Paragraph
            className={styles.text}
            ellipsis={{ rows: 2, tooltip: article.meta?.title }}
          >
            {article.meta?.title || article.path}
          </Typography.Paragraph>
        </div>
      </div>
    </Link>
  );
};

const Articles = () => {
  const articles = useArticles();

  return (
    <Row className={styles.articles} gutter={[60, 50]}>
      {articles?.map((article) => (
        <Col xs={24} sm={12} md={12} lg={12} xl={8} xxl={6} key={article.path}>
          <ArticleItem article={article} />
        </Col>
      ))}
    </Row>
  );
};

export default Articles;
