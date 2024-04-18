import { useBooks } from './hooks/useBooks';

const Books = () => {
  const books = useBooks();

  return (
    <div>
      {books.map((book) => (
        <div key={book.fullPath}>{book.meta?.title}</div>
      ))}
    </div>
  );
};

export default Books;
