import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cart") || "[]"); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(product, qty = 1, size = "", color = []) {
    const key = `${product._id}-${size}-${JSON.stringify(color)}`;
    setCart(prev => {
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, {
        key,
        product: product._id,
        name:    product.name,
        img:     product.images?.[0] || "",
        price:   product.price,
        qty,
        size,
        color,
      }];
    });
  }

  function removeFromCart(key) {
    setCart(prev => prev.filter(i => i.key !== key));
  }

  function updateQty(key, qty) {
    if (qty < 1) return;
    setCart(prev => prev.map(i => i.key === key ? { ...i, qty } : i));
  }

  function clearCart() {
    setCart([]);
  }

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
