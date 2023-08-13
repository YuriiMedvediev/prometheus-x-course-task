import { createContext, useEffect, useState } from 'react';
import notFoundImage from '../assets/imageNotFound.png';

const CartContext = createContext();

const CartProvider = ({ children, userName }) => {
  const savedCart = localStorage.getItem('cart');
  const initialCartItems = savedCart ? JSON.parse(savedCart) : [];
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [userCartItems, setUserCartItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    setUserCartItems(cartItems.filter((item) => item.userName === userName));
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems, userName]);

  useEffect(() => {
    setTotalQuantity(
      userCartItems.reduce((total, item) => total + item.quantity, 0)
    );
    setTotalAmount(
      userCartItems.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      )
    );
  }, [userCartItems]);

  const addToCart = (item, onlyUpdate = true) => {
    const isItemInCart = cartItems.find(
      (cartItem) =>
        cartItem.id === item.id && cartItem.userName === item.userName
    );
    if (isItemInCart) {
      updateQuantityInCart(item.id, item.userName, item.quantity, onlyUpdate);
    } else {
      setCartItems((prevCartItems) => [...prevCartItems, item]);
    }
  };

  const removeFromCart = (itemId, userName) => {
    setCartItems((prevCartItems) => {
      return prevCartItems.filter(
        (item) => !(item.id === itemId && item.userName === userName)
      );
    });
  };

  const updateQuantityInCart = (
    itemId,
    userName,
    newQuantity,
    onlyUpdate = true
  ) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === itemId && item.userName === userName
          ? {
              ...item,
              quantity: onlyUpdate ? newQuantity : item.quantity + newQuantity,
            }
          : item
      )
    );
  };

  const getQuantityById = (itemId, userName) => {
    const item = cartItems.find(
      (item) => item.id === itemId && item.userName === userName
    );
    return item ? item.quantity : 0;
  };

  const clearCart = (userName) => {
    setCartItems((prevCartItems) => {
      return prevCartItems.filter((item) => item.userName !== userName);
    });
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
    userCartItems,
    totalQuantity,
    totalAmount,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantityInCart,
    getQuantityById,
    handleAddToCartAnimation,
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
