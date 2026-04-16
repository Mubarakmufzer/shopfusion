import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react'
import { useCartStore } from '../store/cartStore'

export default function Cart() {
  const navigate = useNavigate()
  const { items, updateQuantity, removeItem, subtotal } = useCartStore()

  const shipping = subtotal() >= 100 ? 0 : 5.99
  const total = subtotal() + shipping

  if (items.length === 0) {
    return (
      <main className="page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/catalog')}>
              Start Shopping <ArrowRight size={18} />
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
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 800 }}>Your Cart</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>{items.reduce((s,i)=>s+i.quantity,0)} items</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'flex-start' }}>
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300'}
                  alt={item.product.name} className="cart-item-img"
                  onError={e => e.target.src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300'}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/product/${item.product.id}`)}
                />
                <div className="cart-item-info" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: 12, color: 'var(--primary-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{item.product.brand}</p>
                      <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 17, margin: '4px 0', cursor: 'pointer' }}
                        onClick={() => navigate(`/product/${item.product.id}`)}>
                        {item.product.name}
                      </h3>
                      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                        {item.size && <span className="badge badge-primary">Size: {item.size}</span>}
                        {item.color && <span className="badge badge-primary">Color: {item.color}</span>}
                      </div>
                    </div>
                    <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, borderRadius: 6, transition: 'var(--transition)' }}
                      onMouseEnter={e => e.target.style.color='var(--rose)'}
                      onMouseLeave={e => e.target.style.color='var(--text-muted)'}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 16 }}>
                    {/* Qty controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <button className="cart-qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                      <span className="cart-qty">{item.quantity}</span>
                      <button className="cart-qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 20, color: 'var(--primary-light)' }}>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                      {item.quantity > 1 && (
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>${item.product.price.toFixed(2)} each</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ position: 'sticky', top: 'calc(var(--navbar-height) + 20px)' }}>
            <div className="glass" style={{ borderRadius: 'var(--radius-xl)', padding: 28 }}>
              <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 22, marginBottom: 24 }}>Order Summary</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: 14 }}>
                  <span>Subtotal ({items.reduce((s,i)=>s+i.quantity,0)} items)</span>
                  <span>${subtotal().toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: 14 }}>
                  <span>Shipping</span>
                  <span style={{ color: shipping === 0 ? '#4ade80' : 'inherit' }}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && (
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', background: 'rgba(16, 185, 129,0.08)', padding: '8px 12px', borderRadius: 8 }}>
                    💡 Add ${(100 - subtotal()).toFixed(2)} more for free shipping!
                  </p>
                )}
                <div className="divider" />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Outfit', fontWeight: 800, fontSize: 22 }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--primary-light)' }}>${total.toFixed(2)}</span>
                </div>
              </div>
              <button className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: 24, padding: '14px' }}
                onClick={() => navigate('/checkout')}>
                Proceed to Checkout <ArrowRight size={18} />
              </button>
              <button className="btn btn-ghost w-full" style={{ justifyContent: 'center', marginTop: 12 }}
                onClick={() => navigate('/catalog')}>
                Continue Shopping
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ marginTop: 16, padding: 20, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
              {[['🔒','Secure Checkout'],['🚚','Free shipping over $100'],['↩️','30-day easy returns']].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
