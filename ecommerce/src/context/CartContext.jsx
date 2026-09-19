import { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  const addToCart = useCallback((producto, talla, color) => {
    setCart((prev) => {
      const variantKey = `${producto.id}-${talla || ''}-${color || ''}`
      const existing = prev.find((item) => item.variantKey === variantKey)
      if (existing) {
        return prev.map((item) =>
          item.variantKey === variantKey
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      }
      return [...prev, { ...producto, talla, color, variantKey, cantidad: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((variantKey) => {
    setCart((prev) => prev.filter((item) => item.variantKey !== variantKey))
  }, [])

  const updateQuantity = useCallback((variantKey, cantidad) => {
    if (cantidad < 1) return
    setCart((prev) =>
      prev.map((item) =>
        item.variantKey === variantKey ? { ...item, cantidad } : item
      )
    )
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + item.precio * item.cantidad, 0)
  }, [cart])

  const getCartCount = useCallback(() => {
    return cart.reduce((total, item) => total + item.cantidad, 0)
  }, [cart])

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
