import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useWishlistStore } from '../store/wishlistStore'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { useToast } from './Toast'

export default function ProductCard({ product, style = {} }) {
  const navigate = useNavigate()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore()
  const { addToCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const { showToast } = useToast()

  const inWish = isInWishlist(product.id)
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null

  const handleWishlist = async (e) => {
    e.stopPropagation()
    if (!isAuthenticated()) { navigate('/login'); return }
    if (inWish) {
      await removeFromWishlist(product.id)
      showToast('Removed from wishlist', 'info')
    } else {
      await addToWishlist(product.id)
      showToast('Added to wishlist ♡', 'success')
    }
  }

  const handleAddToCart = async (e) => {
    e.stopPropagation()
    if (!isAuthenticated()) { navigate('/login'); return }
    const size = product.sizes?.[2] || product.sizes?.[0] || null
    const color = product.colors?.[0]?.name || null
    await addToCart(product.id, 1, size, color)
    showToast('Added to cart!', 'success')
  }

  const stars = Math.round(product.rating)

  return (
    <div className="product-card fade-in-up" style={style} onClick={() => navigate(`/product/${product.id}`)}>
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600'}
          alt={product.name}
          className="product-card-image"
          loading="lazy"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600' }}
        />
        {/* Badges */}
        <div className="product-card-tag" style={{ display: 'flex', gap: 6 }}>
          {discount && <span className="badge badge-rose">-{discount}%</span>}
          {product.is_new_arrival && <span className="badge badge-primary">New</span>}
        </div>
        {/* Action buttons */}
        <div className="product-card-actions">
          <button
            className={`product-card-action-btn${inWish ? ' active' : ''}`}
            onClick={handleWishlist}
            title={inWish ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={15} fill={inWish ? 'currentColor' : 'none'} />
          </button>
          <button
            className="product-card-action-btn"
            onClick={handleAddToCart}
            title="Add to cart"
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="product-card-body">
        <div className="product-card-brand">{product.brand}</div>
        <div className="product-card-name">{product.name}</div>
        {/* Stars */}
        <div className="stars" style={{ marginBottom: 10 }}>
          {[1,2,3,4,5].map(s => (
            <Star key={s} size={12} className={s <= stars ? 'star' : 'star star-empty'} fill={s <= stars ? 'currentColor' : 'none'} />
          ))}
          <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>({product.review_count})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span className="product-card-price">${product.price.toFixed(2)}</span>
          {product.original_price && (
            <span className="product-card-original">${product.original_price.toFixed(2)}</span>
          )}
        </div>
        {/* Color dots */}
        {product.colors?.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            {product.colors.slice(0, 5).map((c, i) => (
              <div key={i} title={c.name} style={{
                width: 14, height: 14, borderRadius: '50%',
                background: c.hex, border: '1px solid rgba(255,255,255,0.2)'
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
