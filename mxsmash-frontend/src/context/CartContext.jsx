import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Builds a unique cart line key based on product id + selected add-ons,
  // so "Burger with cheese" and "Burger without cheese" are separate lines
  const getCartKey = (productId, selectedAddOns = []) => {
    const addOnIds = selectedAddOns.map((a) => a.id).sort().join(",");
    return `${productId}::${addOnIds}`;
  };

  // Now accepts an optional selectedAddOns array
  const addToCart = (product, quantity = 1, selectedAddOns = []) => {
    const cartKey = getCartKey(product.id, selectedAddOns);
    const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = product.price + addOnsTotal;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartKey === cartKey);
      if (existing) {
        return prev.map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          cartKey,
          quantity,
          selectedAddOns,
          unitPrice, // base price + add-ons, used for display and totals
        },
      ];
    });
  };

  const removeFromCart = (cartKey) => {
    setCart((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  const updateQuantity = (cartKey, quantity) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.cartKey === cartKey ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);