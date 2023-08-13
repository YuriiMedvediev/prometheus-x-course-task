import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import { render, screen, waitFor } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';

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
  it('The quantity should increase when the increase button is clicked.', async () => {
    renderSpecificBook(['/books/1']);

    const quantityInput = screen.getByTestId('quantity-input');

    const increaseButton = screen.getByTestId('increase-button');

    fireEvent.change(quantityInput, { target: { value: '1' } });
    fireEvent.click(increaseButton);

    await waitFor(() => {
      expect(parseInt(quantityInput.value)).toBe(2);
    });

    fireEvent.change(quantityInput, { target: { value: '41' } });
    expect(parseInt(quantityInput.value)).toBe(41);
    fireEvent.click(increaseButton);

    await waitFor(() => {
      expect(parseInt(quantityInput.value)).toBe(42);
    });

    fireEvent.click(increaseButton);

    await waitFor(() => {
      expect(parseInt(quantityInput.value)).toBe(42);
    });
  });

  it('The quantity should decrease when the decrease button is clicked.', async () => {
    renderSpecificBook(['/books/1']);

    const quantityInput = screen.getByTestId('quantity-input');

    const decreaseButton = screen.getByTestId('decrease-button');

    fireEvent.change(quantityInput, { target: { value: '1' } });
    fireEvent.click(decreaseButton);

    await waitFor(() => {
      expect(parseInt(quantityInput.value)).toBe(1);
    });

    fireEvent.change(quantityInput, { target: { value: '2' } });
    expect(parseInt(quantityInput.value)).toBe(2);
    fireEvent.click(decreaseButton);

    await waitFor(() => {
      expect(parseInt(quantityInput.value)).toBe(1);
    });

    fireEvent.click(decreaseButton);

    await waitFor(() => {
      expect(parseInt(quantityInput.value)).toBe(1);
    });
  });

  it('The total cost should change when the quantity is modified.', async () => {
    renderSpecificBook(['/books/1']);

    const quantityInput = screen.getByTestId('quantity-input');

    const totalCost = screen.getByTestId('order-sum');

    fireEvent.change(quantityInput, { target: { value: '1' } });
    const initialOrderSum = totalCost.textContent;
    fireEvent.change(quantityInput, { target: { value: '5' } });

    await waitFor(() => {
      expect(totalCost.textContent).not.toBe(initialOrderSum);
    });

    expect(totalCost.textContent).toBe('54.95');
  });
});
