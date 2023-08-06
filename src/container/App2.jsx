import SpecificBook from '../components/SpecificBook';
import { BooksProvider } from '../contexts/BooksContext';
import { CartProvider } from '../contexts/CartContext';
import { Route, Routes } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';
import '../containers/app.scss';

function App2() {
  return (
    <BooksProvider>
      <CartProvider>
        <MemoryRouter initialEntries={['/books/13']}>
          <Routes>
            <Route
              path="/books/:id"
              element={<SpecificBook isUserLoggedIn={true} />}
            />
          </Routes>
        </MemoryRouter>
      </CartProvider>
    </BooksProvider>
  );
}

export default App2;
