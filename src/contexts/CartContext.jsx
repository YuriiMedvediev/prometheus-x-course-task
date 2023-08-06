import { createContext, useEffect, useState } from 'react';
import { LocalStorageService, LS_KEYS } from '../services/localStorage';

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const savedCartItems = localStorage.getItem(LS_KEYS.CART);
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
  }, []);

  useEffect(() => {
    setTotalQuantity(
      cartItems.reduce((total, item) => total + item.quantity, 0)
    );
    setTotalAmount(
      cartItems.reduce((total, item) => total + item.quantity * item.price, 0)
    );

    localStorage.setItem(LS_KEYS.CART, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    const isItemInCart = cartItems.find((cartItem) => cartItem.id === item.id);
    if (isItemInCart) {
      updateQuantityInCartAdd(item.id, item.quantity, item.avaliableQuantity);
    } else {
      setCartItems((prevCartItems) => [...prevCartItems, item]);
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevCartItems) => {
      return prevCartItems.filter((item) => item.id !== itemId);
    });
  };

  const updateQuantityInCartAdd = (itemId, newQuantity, avaliableQuantity) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.min(
                item.quantity + newQuantity,
                avaliableQuantity
              ),
            }
          : item
      )
    );
  };

  const updateQuantityInCart = (itemId, newQuantity) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item
      )
    );
  };

  const getQuantityById = (itemId) => {
    const item = cartItems.find((item) => item.id === itemId);
    return item ? item.quantity : 0;
  };

  const clearCart = () => {
    setCartItems([]);
    setTotalAmount(0);
    setTotalQuantity(0);
  };

  const cartContextValue = {
    cartItems,
    totalQuantity,
    totalAmount,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantityInCart,
    getQuantityById,
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
