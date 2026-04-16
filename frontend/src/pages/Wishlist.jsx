import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react'
import { useWishlistStore } from '../store/wishlistStore'
import { useCartStore } from '../store/cartStore'
import { useToast } from '../components/Toast'

export default function Wishlist() {
  const navigate = useNavigate()
  const { items, fetchWishlist, removeFromWishlist } = useWishlistStore()
  const { addToCart } = useCartStore()
  const { showToast } = useToast()

  useEffect(() => { fetchWishlist() }, [])

  const handleMoveToCart = async (product) => {
    const size = product.sizes?.[2] || product.sizes?.[0] || null
    const color = product.colors?.[0]?.name || null
    await addToCart(product.id, 1, size, color)
    await removeFromWishlist(product.id)
    showToast('Moved to cart! 🛒', 'success')
  }

  if (items.length === 0) {
    return (
      <main className="page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">♡</div>
            <h3>Your wishlist is empty</h3>
            <p>Save items you love and find them here anytime.</p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/catalog')}>
              Discover Products <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="container">
        <div className="page-header">
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 800 }}>
            Wishlist <span style={{ color: 'var(--rose)' }}>♥</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>{items.length} saved items</p>
        </div>

        <div className="products-grid">
          {items.map((item) => {
            const p = item.product
            const discount = p.original_price ? Math.round(((p.original_price - p.price) / p.original_price) * 100) : null
            return (
              <div key={item.id} className="product-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={p.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600'}
                    alt={p.name} className="product-card-image"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/product/${p.id}`)}
                    onError={e => e.target.src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600'}
                  />
                  {discount && <div className="badge badge-rose" style={{ position: 'absolute', top: 12, left: 12 }}>-{discount}%</div>}
                  <button
                    onClick={() => { removeFromWishlist(p.id); showToast('Removed from wishlist') }}
                    style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: '50%', background: 'rgba(244,63,94,0.15)', border: '1px solid var(--rose)', color: 'var(--rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
                    <Heart size={15} fill="currentColor" />
                  </button>
                </div>
                <div className="product-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className="product-card-brand">{p.brand}</div>
                  <div className="product-card-name" style={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${p.id}`)}>{p.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 16 }}>
                    <span className="product-card-price">${p.price.toFixed(2)}</span>
                    {p.original_price && <span className="product-card-original">${p.original_price.toFixed(2)}</span>}
                  </div>
                  <button className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: 'auto' }}
                    onClick={() => handleMoveToCart(p)}>
                    <ShoppingCart size={16} /> Move to Cart
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
