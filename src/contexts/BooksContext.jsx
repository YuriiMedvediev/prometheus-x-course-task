import { createContext, useEffect, useState } from 'react';
import booksJSON from '../assets/books.json';

const BooksContext = createContext();

const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    setBooks(booksJSON.books);
  }, []);

  return (
    <BooksContext.Provider value={books}>{children}</BooksContext.Provider>
  );
};

export { BooksContext, BooksProvider };
