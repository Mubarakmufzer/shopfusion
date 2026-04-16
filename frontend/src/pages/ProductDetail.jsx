import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, Star, ChevronLeft, ChevronRight, X, Check } from 'lucide-react'
import { productsAPI } from '../api'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import { useAuthStore } from '../store/authStore'
import { useToast } from '../components/Toast'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCartStore()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore()
  const { isAuthenticated, user } = useAuthStore()
  const { showToast } = useToast()

  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [imgIdx, setImgIdx] = useState(0)
  const [selSize, setSelSize] = useState(null)
  const [selColor, setSelColor] = useState(null)
  const [qty, setQty] = useState(1)
  const [addingCart, setAddingCart] = useState(false)
  const [sizeChartOpen, setSizeChartOpen] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [tab, setTab] = useState('description')

  useEffect(() => {
    window.scrollTo(0, 0)
    Promise.all([productsAPI.getOne(id), productsAPI.getReviews(id)])
      .then(([p, r]) => {
        setProduct(p.data)
        setReviews(r.data)
        setSelSize(p.data.sizes?.[0] || null)
        setSelColor(p.data.colors?.[0] || null)
        setLoading(false)
      }).catch(() => { navigate('/catalog'); setLoading(false) })
  }, [id])

  const inWish = product ? isInWishlist(product.id) : false

  const handleAddToCart = async () => {
    if (!isAuthenticated()) { navigate('/login'); return }
    if (!selSize && product.sizes?.length > 0) { showToast('Please select a size', 'error'); return }
    setAddingCart(true)
    await addToCart(product.id, qty, selSize, selColor?.name)
    setAddingCart(false)
    showToast('Added to cart! 🛒', 'success')
  }

  const handleWishlist = async () => {
    if (!isAuthenticated()) { navigate('/login'); return }
    if (inWish) { await removeFromWishlist(product.id); showToast('Removed from wishlist') }
    else { await addToWishlist(product.id); showToast('Added to wishlist ♡', 'success') }
  }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!isAuthenticated()) { navigate('/login'); return }
    setSubmittingReview(true)
    try {
      await productsAPI.addReview(id, reviewForm)
      const r = await productsAPI.getReviews(id)
      const p = await productsAPI.getOne(id)
      setReviews(r.data); setProduct(p.data)
      setReviewForm({ rating: 5, title: '', comment: '' })
      showToast('Review submitted! ⭐', 'success')
    } catch (err) {
      showToast(err.response?.data?.detail || 'Already reviewed', 'error')
    }
    setSubmittingReview(false)
  }

  const ratingBreakdown = [5,4,3,2,1].map(n => ({
    n, count: reviews.filter(r => Math.round(r.rating) === n).length
  }))

  if (loading) return <main className="page"><div className="container loading-center"><div className="spinner" /></div></main>
  if (!product) return null

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : null

  return (
    <main className="page">
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 32, fontSize: 14, color: 'var(--text-muted)' }}>
          <button className="btn-ghost" style={{ padding: 0, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => navigate('/')}>Home</button>
          <span>/</span>
          <button style={{ padding: 0, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textTransform: 'capitalize' }} onClick={() => navigate(`/catalog/${product.category}`)}>{product.category}</button>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'flex-start' }}>
          {/* IMAGE GALLERY */}
          <div>
            <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', aspectRatio: '4/5', border: '1px solid var(--border)' }}>
              <img
                src={product.images?.[imgIdx] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'}
                alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => e.target.src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'}
              />
              {product.images?.length > 1 && (
                <>
                  <button onClick={() => setImgIdx(i => (i - 1 + product.images.length) % product.images.length)}
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', background: 'rgba(7,7,26,0.8)', border: '1px solid var(--border)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setImgIdx(i => (i + 1) % product.images.length)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', background: 'rgba(7,7,26,0.8)', border: '1px solid var(--border)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
              {discount && <div className="badge badge-rose" style={{ position: 'absolute', top: 16, left: 16 }}>-{discount}%</div>}
            </div>
            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                {product.images.map((img, i) => (
                  <div key={i} onClick={() => setImgIdx(i)} style={{ width: 80, height: 100, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: `2px solid ${i === imgIdx ? 'var(--primary)' : 'var(--border)'}`, cursor: 'pointer', flexShrink: 0, transition: 'var(--transition)' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT INFO */}
          <div style={{ position: 'sticky', top: 'calc(var(--navbar-height) + 20px)' }}>
            <div className="badge badge-primary" style={{ marginBottom: 12 }}>{product.brand}</div>
            {product.is_new_arrival && <span className="badge badge-gold" style={{ marginLeft: 8 }}>New Arrival</span>}
            <h1 style={{ fontFamily: 'Outfit', fontSize: 32, fontWeight: 800, margin: '12px 0' }}>{product.name}</h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div className="stars">
                {[1,2,3,4,5].map(s => <Star key={s} size={16} fill={s <= Math.round(product.rating) ? 'var(--gold)' : 'none'} color={s <= Math.round(product.rating) ? 'var(--gold)' : 'var(--text-muted)'} />)}
              </div>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{product.rating.toFixed(1)} ({product.review_count} reviews)</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 28 }}>
              <span style={{ fontFamily: 'Outfit', fontSize: 36, fontWeight: 800, color: 'var(--primary-light)' }}>${product.price.toFixed(2)}</span>
              {product.original_price && <span style={{ fontSize: 20, color: 'var(--text-muted)', textDecoration: 'line-through' }}>${product.original_price.toFixed(2)}</span>}
              {discount && <span className="badge badge-rose">Save {discount}%</span>}
            </div>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>
                  Color: <span style={{ color: 'var(--text-primary)' }}>{selColor?.name}</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {product.colors.map((c, i) => (
                    <div key={i} title={c.name} onClick={() => setSelColor(c)} style={{ width: 32, height: 32, borderRadius: '50%', background: c.hex, cursor: 'pointer', border: `3px solid ${selColor?.name === c.name ? 'var(--primary)' : 'transparent'}`, boxShadow: selColor?.name === c.name ? '0 0 0 2px var(--primary-light)' : 'none', transition: 'var(--transition)' }} />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Size: <span style={{ color: 'var(--text-primary)' }}>{selSize}</span>
                  </span>
                  <button style={{ fontSize: 12, color: 'var(--primary-light)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }} onClick={() => setSizeChartOpen(true)}>
                    Size Chart →
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelSize(s)} style={{ padding: '8px 16px', borderRadius: 8, border: `1.5px solid ${selSize === s ? 'var(--primary)' : 'var(--border)'}`, background: selSize === s ? 'rgba(16, 185, 129,0.15)' : 'transparent', color: selSize === s ? 'var(--primary-light)' : 'var(--text-secondary)', fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'var(--transition)' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty & Actions */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <button className="cart-qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))} style={{ borderRadius: 0, border: 'none' }}>−</button>
                <span className="cart-qty" style={{ padding: '0 16px' }}>{qty}</span>
                <button className="cart-qty-btn" onClick={() => setQty(q => q + 1)} style={{ borderRadius: 0, border: 'none' }}>+</button>
              </div>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleAddToCart} disabled={addingCart}>
                <ShoppingCart size={18} /> {addingCart ? 'Adding...' : 'Add to Cart'}
              </button>
              <button className={`btn ${inWish ? 'btn-rose' : 'btn-ghost'} btn-icon`} onClick={handleWishlist} title="Wishlist">
                <Heart size={18} fill={inWish ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Stock */}
            <p style={{ fontSize: 13, color: product.stock > 10 ? '#4ade80' : product.stock > 0 ? '#fb923c' : 'var(--rose)', marginBottom: 20 }}>
              {product.stock > 10 ? '✓ In Stock' : product.stock > 0 ? `⚠ Only ${product.stock} left!` : '✗ Out of Stock'}
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {product.tags?.map(t => <span key={t} className="badge badge-primary">{t}</span>)}
            </div>
          </div>
        </div>

        {/* TABS */}
        <div style={{ marginTop: 64 }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 40 }}>
            {['description','reviews'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '14px 28px', background: 'none', border: 'none', borderBottom: `2px solid ${tab === t ? 'var(--primary)' : 'transparent'}`, color: tab === t ? 'var(--primary-light)' : 'var(--text-muted)', fontFamily: 'Outfit', fontWeight: 700, fontSize: 15, cursor: 'pointer', textTransform: 'capitalize', transition: 'var(--transition)', marginBottom: -1 }}>
                {t} {t === 'reviews' && `(${reviews.length})`}
              </button>
            ))}
          </div>

          {tab === 'description' && (
            <div style={{ maxWidth: 700, lineHeight: 1.9, color: 'var(--text-secondary)', fontSize: 15 }}>
              <p>{product.description}</p>
              <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[['Category', product.category], ['Brand', product.brand], ['Sizes', product.sizes?.join(', ')], ['Stock', `${product.stock} units`]].map(([k, v]) => (
                  <div key={k} style={{ padding: '14px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>{k}</div>
                    <div style={{ fontWeight: 600, marginTop: 4, textTransform: 'capitalize' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'reviews' && (
            <div>
              {/* Rating summary */}
              <div style={{ display: 'flex', gap: 48, marginBottom: 48, flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Outfit', fontSize: 72, fontWeight: 900, color: 'var(--primary-light)', lineHeight: 1 }}>{product.rating.toFixed(1)}</div>
                  <div className="stars" style={{ justifyContent: 'center', margin: '8px 0' }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={20} fill={s <= Math.round(product.rating) ? 'var(--gold)' : 'none'} color={s <= Math.round(product.rating) ? 'var(--gold)' : 'var(--text-muted)'} />)}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{product.review_count} reviews</div>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  {ratingBreakdown.map(({ n, count }) => (
                    <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)', width: 10 }}>{n}</span>
                      <Star size={12} fill="var(--gold)" color="var(--gold)" />
                      <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : '0%', height: '100%', background: 'var(--gold)', borderRadius: 3, transition: 'width 0.5s' }} />
                      </div>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)', width: 20 }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Write review */}
              {isAuthenticated() && (
                <form onSubmit={handleReview} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 28, marginBottom: 40 }}>
                  <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 20 }}>Write a Review</h3>
                  <div style={{ marginBottom: 16 }}>
                    <label className="input-label">Rating</label>
                    <div className="stars" style={{ marginTop: 8, gap: 8 }}>
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={28} style={{ cursor: 'pointer', transition: 'var(--transition)' }}
                          fill={s <= reviewForm.rating ? 'var(--gold)' : 'none'}
                          color={s <= reviewForm.rating ? 'var(--gold)' : 'var(--text-muted)'}
                          onClick={() => setReviewForm(f => ({ ...f, rating: s }))} />
                      ))}
                    </div>
                  </div>
                  <div className="input-group" style={{ marginBottom: 12 }}>
                    <label className="input-label">Title</label>
                    <input className="input" placeholder="Great product!" value={reviewForm.title} onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} />
                  </div>
                  <div className="input-group" style={{ marginBottom: 20 }}>
                    <label className="input-label">Review</label>
                    <textarea className="input" rows={4} placeholder="Share your experience..." value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} style={{ resize: 'vertical' }} />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              {/* Reviews list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {reviews.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first!</p>
                ) : reviews.map(r => (
                  <div key={r.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                          {r.user.full_name?.[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{r.user.full_name}</div>
                          <div className="stars">
                            {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= r.rating ? 'var(--gold)' : 'none'} color={s <= r.rating ? 'var(--gold)' : 'var(--text-muted)'} />)}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                    {r.title && <p style={{ fontWeight: 600, marginBottom: 6 }}>{r.title}</p>}
                    {r.comment && <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{r.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Size Chart Modal */}
      {sizeChartOpen && (
        <div className="modal-backdrop" onClick={() => setSizeChartOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 800 }}>Size Chart</h3>
              <button onClick={() => setSizeChartOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>{['Size','Chest (in)','Waist (in)','Hip (in)'].map(h => <th key={h} style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid var(--border)', fontWeight: 700, color: 'var(--text-muted)' }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {[['XS','32-33','25-26','35-36'],['S','34-35','27-28','37-38'],['M','36-37','29-30','39-40'],['L','38-40','31-33','41-43'],['XL','41-43','34-36','44-46'],['XXL','44-46','37-39','47-49']].map(([s,...v], i) => (
                  <tr key={s} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--primary-light)' }}>{s}</td>
                    {v.map((val, vi) => <td key={vi} style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{val}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>Measurements in inches. If between sizes, size up.</p>
          </div>
        </div>
      )}
    </main>
  )
}
