import { create } from 'zustand'
import { wishlistAPI } from '../api'

export const useWishlistStore = create((set, get) => ({
  items: [],

  fetchWishlist: async () => {
    try {
      const { data } = await wishlistAPI.get()
      set({ items: data })
    } catch {}
  },

  addToWishlist: async (productId) => {
    try {
      await wishlistAPI.add(productId)
      await get().fetchWishlist()
    } catch {}
  },

  removeFromWishlist: async (productId) => {
    try {
      await wishlistAPI.remove(productId)
      set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) }))
    } catch {}
  },

  isInWishlist: (productId) => get().items.some((i) => i.product.id === productId),
}))
