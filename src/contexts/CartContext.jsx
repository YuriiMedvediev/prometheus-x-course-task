import { createContext, useEffect, useState } from 'react';
import notFoundImage from '../assets/imageNotFound.png';

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const savedCart = localStorage.getItem('cart');
  const initialCartItems = savedCart ? JSON.parse(savedCart) : [];

  const [cartItems, setCartItems] = useState(initialCartItems);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    setTotalQuantity(
      cartItems.reduce((total, item) => total + item.quantity, 0)
    );
    setTotalAmount(
      cartItems.reduce((total, item) => total + item.quantity * item.price, 0)
    );

    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item, onlyUpdate = true) => {
    const isItemInCart = cartItems.find((cartItem) => cartItem.id === item.id);
    if (isItemInCart) {
      updateQuantityInCart(item.id, item.quantity, onlyUpdate);
    } else {
      setCartItems((prevCartItems) => [...prevCartItems, item]);
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevCartItems) => {
      return prevCartItems.filter((item) => item.id !== itemId);
    });
  };

  const updateQuantityInCart = (itemId, newQuantity, onlyUpdate = true) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: onlyUpdate ? newQuantity : item.quantity + newQuantity,
            }
          : item
      )
    );
  };

  const getQuantityById = (itemId) => {
    const item = cartItems.find((item) => item.id === itemId);
    return item ? item.quantity : 0;
  };

  const getSumById = (itemId) => {
    const item = cartItems.find((item) => item.id === itemId);
    return item ? item.quantity * item.price : 0;
  };

  const clearCart = () => {
    setCartItems([]);
    setTotalAmount(0);
    setTotalQuantity(0);
  };

  const handleAddToCartAnimation = (event, count, book) => {
    const cartImage = document.querySelector('#cartImg');
    const rectCartImg = cartImage.getBoundingClientRect();
    const offsetYCart = rectCartImg.y;

    const generateImage = (offsetX, offsetY) => {
      const flyingImage = document.createElement('img');
      flyingImage.src = book.image || notFoundImage;
      flyingImage.className = 'flyingBookImage';

      document.body.appendChild(flyingImage);

      const rect = flyingImage.getBoundingClientRect();

      flyingImage.style.position = 'fixed';
      flyingImage.style.left = `${offsetX}px`;
      flyingImage.style.top = `${offsetY}px`;

      flyingImage.style.transition = 'all 1s ease';
      flyingImage.style.opacity = '0';

      setTimeout(() => {
        flyingImage.style.opacity = '1';
        flyingImage.style.transform = `translate(0, -${
          offsetY - offsetYCart + rect.height * 0.3
        }px) translateX(${
          rectCartImg.x - offsetX - rect.width * 0.3
        }px) scale(0.2)`;
      }, 50);

      setTimeout(() => {
        document.body.removeChild(flyingImage);
      }, 1000);
    };

    const generateImages = async (count) => {
      for (let i = 0; i < Math.min(count, 5); i++) {
        const offsetX = event.clientX;
        const offsetY = event.clientY;
        generateImage(offsetX, offsetY);
        await new Promise((resolve) => setTimeout(resolve, 60));
      }
    };

    generateImages(count);
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
    getSumById,
    handleAddToCartAnimation,
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
