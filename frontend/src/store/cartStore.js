import { create } from 'zustand'
import { cartAPI } from '../api'

export const useCartStore = create((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async () => {
    set({ loading: true })
    try {
      const { data } = await cartAPI.get()
      set({ items: data, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  addToCart: async (productId, quantity = 1, size = null, color = null) => {
    try {
      await cartAPI.add({ product_id: productId, quantity, size, color })
      await get().fetchCart()
      return true
    } catch (err) {
      return false
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      await cartAPI.update(itemId, quantity)
      await get().fetchCart()
    } catch {}
  },

  removeItem: async (itemId) => {
    try {
      await cartAPI.remove(itemId)
      set((state) => ({ items: state.items.filter((i) => i.id !== itemId) }))
    } catch {}
  },

  clearCart: async () => {
    try {
      await cartAPI.clear()
      set({ items: [] })
    } catch {}
  },

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  subtotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
}))
