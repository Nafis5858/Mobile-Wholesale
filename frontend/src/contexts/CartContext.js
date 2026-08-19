import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('mobileWholesaleCart');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Filter out legacy format items that don't have a 'product' object
        return parsed.filter(item => item && item.product && item.product._id);
      }
    } catch (e) {
      console.error('Failed to parse cart', e);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('mobileWholesaleCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product._id === product._id);
      if (existing) {
        return prevItems.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.product._id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product._id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.length;

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
