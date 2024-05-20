import { Typography } from 'antd';

import type { ResolveRouteObject } from '@/router';
import { Link } from '@/router';

import { useBooks } from './hooks/useBooks';
import styles from './styles/Books.module.less';

const { Title, Paragraph } = Typography;

const BookItem = ({ book }: { book: ResolveRouteObject }) => {
  return (
    <Link rel="bookmark" to={book.fullPath}>
      <div className={styles.bookItem}>
        <div className={styles.contentBox}>
          <Title className={styles.title} level={3}>
            {book.meta?.title}
          </Title>

          <Paragraph
            type="secondary"
            ellipsis={{ rows: 5, tooltip: book.meta?.description }}
            style={{ marginTop: 18, fontSize: 16 }}
          >
            {book.meta?.description}
          </Paragraph>
        </div>

        <div className={styles.imageBox}>
          <img loading="lazy" src={book.meta?.imageUrl} alt={book.meta?.title} />
        </div>
      </div>
    </Link>
  );
};

const Books = () => {
  const books = useBooks();

  return (
    <div className={styles.books}>
      {books.map((book) => (
        <BookItem key={book.fullPath} book={book} />
      ))}
    </div>
  );
};

export default Books;
