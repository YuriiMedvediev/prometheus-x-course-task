import { useState, useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { Layout } from '../routes';
import SignIn from '../components/SignIn';
import Cart from '../components/Cart';
import NotFoundPage from '../components/NotFoundPage';
import SpecificBook from '../components/SpecificBook';
import BookList from '../components/BookList';

import { BooksProvider } from '../contexts/BooksContext';
import { CartProvider } from '../contexts/CartContext';

import './app.scss';

function App() {
  const [userName, setUserName] = useState('');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    let storedUserName = localStorage.getItem('userName');
    if (storedUserName !== null && storedUserName !== '') {
      setUserName(storedUserName);
      setIsUserLoggedIn(true);
    }
  }, []);

  const handleSignIn = (userName) => {
    setUserName(userName);
    setIsUserLoggedIn(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem('userName');
    setUserName('');
    setIsUserLoggedIn(false);
  };

  return (
    <ErrorBoundary
      fallback={
        <div>
          <h1>Something went wrong.</h1>
          <p>
            Oops. Something happened. Please try refreshing the page or contact
            the support team at skylake@email.ua.
          </p>

          <h3>Here's a short poem about this subject :-) </h3>
          <p>
            I'm broken down trying to pick all the pieces <br />
            I'm tired of trying but i know i can do this <br />
            The sun will appear from behind the clouds
            <br />
            The night will fall when the stars are out
            <br />
            The skies will clear when i've dried my tears
            <br />
            The rain will fall and i'll still be here ...
          </p>

          <p>
            <a
              href="https://www.youtube.com/watch?v=FJpiLy1iaQY&list=PLPblke13MGdjQf64hb4vwpNN--lO0kxH9&index=185"
              target="_blank"
              rel="noopener noreferrer"
            >
              Costa Mee, Pete Bellis & Tommy - Paradise
            </a>
          </p>
        </div>
      }
    >
      <BooksProvider>
        <CartProvider userName={userName}>
          <HashRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <Layout
                    isUserLoggedIn={isUserLoggedIn}
                    userName={userName}
                    handleSignOut={handleSignOut}
                  />
                }
              >
                <Route index element={<SignIn handleSignIn={handleSignIn} />} />
                <Route
                  path="signin"
                  element={<SignIn handleSignIn={handleSignIn} />}
                />
                <Route
                  path="cart"
                  element={
                    <Cart isUserLoggedIn={isUserLoggedIn} userName={userName} />
                  }
                />
                <Route
                  path="books"
                  element={
                    <BookList
                      isUserLoggedIn={isUserLoggedIn}
                      userName={userName}
                    />
                  }
                />
                <Route
                  path="books/:id"
                  element={
                    <SpecificBook
                      isUserLoggedIn={isUserLoggedIn}
                      userName={userName}
                    />
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </HashRouter>
        </CartProvider>
      </BooksProvider>
    </ErrorBoundary>
  );
}

export default App;
