import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SpecificBook from '../components/SpecificBook';
import { BooksProvider } from '../contexts/BooksContext';
import { CartProvider } from '../contexts/CartContext';

const renderSpecificBook = (initialEntries) => {
  return render(
    <BooksProvider>
      <CartProvider>
        <MemoryRouter initialEntries={initialEntries}>
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
};

describe('SpecificBook', () => {
  it('renders with quantity set to 1', () => {
    renderSpecificBook(['/books/1']);

    // Verify that the quantity input value is initially set to 1
    const quantityInput = screen.getByTestId('quantity-input');
    expect(quantityInput.value).toBe('1');
  });
});
