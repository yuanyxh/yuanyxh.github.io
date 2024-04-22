import { Typography } from 'antd';

import type { ResolveRouteObject } from '@/router';
import { Link } from '@/router';

import { useExamples } from './hooks/useExamples';
import styles from './styles/Examples.module.less';

const { Title, Paragraph } = Typography;

const ExampleItem = ({ example }: { example: ResolveRouteObject }) => {
  return (
    <Link to={example.fullPath}>
      <div className={styles.exampleItem}>
        <div className={styles.contentBox}>
          <Title className={styles.title} level={4}>
            {example.meta?.title}
          </Title>

          <Paragraph
            type="secondary"
            ellipsis={{ rows: 5, tooltip: example.meta?.description }}
            style={{ marginTop: 13, fontSize: 16 }}
          >
            {example.meta?.description}
          </Paragraph>
        </div>
      </div>
    </Link>
  );
};

export default function Examples() {
  const examples = useExamples();

  return (
    <div className={styles.examples}>
      {examples.map((example) => (
        <ExampleItem key={example.fullPath} example={example} />
      ))}
    </div>
  );
}
