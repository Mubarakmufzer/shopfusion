import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, CreditCard, MapPin, Truck, ArrowRight, ArrowLeft } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { ordersAPI } from '../api'
import { useToast } from '../components/Toast'

const STEPS = ['Address', 'Shipping', 'Payment', 'Confirm']

export default function Checkout() {
  const navigate = useNavigate()
  const { items, subtotal, clearCart } = useCartStore()
  const { showToast } = useToast()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const [address, setAddress] = useState({
    full_name: '', phone: '', street: '', city: '', state: '', zip_code: '', country: 'US'
  })
  const [shipping, setShipping] = useState('standard')
  const [payment, setPayment] = useState('card')
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' })

  const shippingCost = subtotal() >= 100 ? 0 : shipping === 'standard' ? 5.99 : 15.99
  const total = subtotal() + shippingCost

  const handleNext = () => {
    if (step === 0) {
      if (!address.full_name || !address.street || !address.city || !address.zip_code) {
        showToast('Please fill all required fields', 'error'); return
      }
    }
    if (step < STEPS.length - 1) setStep(s => s + 1)
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      const { data } = await ordersAPI.checkout({
        address: { ...address, country: address.country || 'US' },
        shipping_method: shipping,
        payment_method: payment,
      })
      await clearCart()
      setOrderId(data.id)
      setStep(4)
    } catch (err) {
      showToast(err.response?.data?.detail || 'Checkout failed', 'error')
    }
    setLoading(false)
  }

  // Order Success Screen
  if (step === 4) {
    return (
      <main className="page">
        <div className="container" style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', boxShadow: '0 0 40px var(--primary-glow)' }}>
            <Check size={36} color="white" />
          </div>
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 40, marginBottom: 12 }}>Order Confirmed!</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 8 }}>
            Thank you for your purchase. Your order #{orderId} has been placed successfully.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 40 }}>
            You'll receive a confirmation email shortly. Track your order in My Orders.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/orders')}>
              Track Order <ArrowRight size={18} />
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => navigate('/catalog')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (items.length === 0) {
    navigate('/cart'); return null
  }

  return (
    <main className="page">
      <div className="container">
        <h1 style={{ fontFamily: 'Outfit', fontWeight: 800, marginBottom: 36 }}>Checkout</h1>

        {/* Step indicator */}
        <div className="checkout-steps" style={{ marginBottom: 48 }}>
          {STEPS.map((s, i) => (
            <div key={s} className={`checkout-step${i === step ? ' active' : ''}${i < step ? ' done' : ''}`}>
              <span style={{ marginRight: 8 }}>{i < step ? '✓' : i + 1}</span>{s}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40, alignItems: 'flex-start' }}>
          {/* Step Content */}
          <div className="glass" style={{ borderRadius: 'var(--radius-xl)', padding: 36 }}>
            {/* STEP 0: Address */}
            {step === 0 && (
              <div>
                <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <MapPin size={22} color="var(--primary-light)" /> Shipping Address
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { key: 'full_name', label: 'Full Name *', placeholder: 'John Doe', span: 2 },
                    { key: 'phone', label: 'Phone Number *', placeholder: '+1 555 0000', span: 1 },
                    { key: 'country', label: 'Country', placeholder: 'US', span: 1 },
                    { key: 'street', label: 'Street Address *', placeholder: '123 Main St, Apt 4', span: 2 },
                    { key: 'city', label: 'City *', placeholder: 'New York', span: 1 },
                    { key: 'state', label: 'State', placeholder: 'NY', span: 1 },
                    { key: 'zip_code', label: 'ZIP Code *', placeholder: '10001', span: 1 },
                  ].map(({ key, label, placeholder, span }) => (
                    <div key={key} className="input-group" style={{ gridColumn: span === 2 ? 'span 2' : 'auto' }}>
                      <label className="input-label">{label}</label>
                      <input className="input" placeholder={placeholder} value={address[key]}
                        onChange={e => setAddress(a => ({ ...a, [key]: e.target.value }))} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 1: Shipping */}
            {step === 1 && (
              <div>
                <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Truck size={22} color="var(--primary-light)" /> Shipping Method
                </h2>
                {[
                  { id: 'standard', label: 'Standard Shipping', desc: '5-7 business days', price: subtotal() >= 100 ? 'FREE' : '$5.99' },
                  { id: 'express', label: 'Express Shipping', desc: '2-3 business days', price: subtotal() >= 100 ? '$10.00' : '$15.99' },
                ].map(opt => (
                  <div key={opt.id} onClick={() => setShipping(opt.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderRadius: 'var(--radius-lg)', border: `2px solid ${shipping === opt.id ? 'var(--primary)' : 'var(--border)'}`, background: shipping === opt.id ? 'rgba(16, 185, 129,0.08)' : 'transparent', cursor: 'pointer', marginBottom: 16, transition: 'var(--transition)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${shipping === opt.id ? 'var(--primary)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {shipping === opt.id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)' }} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{opt.label}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{opt.desc}</div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, color: opt.price === 'FREE' ? '#4ade80' : 'var(--primary-light)' }}>{opt.price}</span>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 2: Payment */}
            {step === 2 && (
              <div>
                <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <CreditCard size={22} color="var(--primary-light)" /> Payment
                </h2>
                <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
                  {[{ id: 'card', label: '💳 Credit Card' }, { id: 'paypal', label: '🅿️ PayPal' }, { id: 'apple', label: '🍎 Apple Pay' }].map(m => (
                    <button key={m.id} onClick={() => setPayment(m.id)} style={{ flex: 1, padding: '14px 12px', borderRadius: 'var(--radius-md)', border: `2px solid ${payment === m.id ? 'var(--primary)' : 'var(--border)'}`, background: payment === m.id ? 'rgba(16, 185, 129,0.08)' : 'transparent', color: payment === m.id ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'var(--transition)' }}>
                      {m.label}
                    </button>
                  ))}
                </div>
                {payment === 'card' && (
                  <div style={{ display: 'grid', gap: 16 }}>
                    <div className="input-group">
                      <label className="input-label">Cardholder Name</label>
                      <input className="input" placeholder="John Doe" value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Card Number</label>
                      <input className="input" placeholder="4242 4242 4242 4242" maxLength={19}
                        value={card.number}
                        onChange={e => setCard(c => ({ ...c, number: e.target.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim() }))} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div className="input-group">
                        <label className="input-label">Expiry</label>
                        <input className="input" placeholder="MM/YY" maxLength={5} value={card.expiry} onChange={e => setCard(c => ({ ...c, expiry: e.target.value }))} />
                      </div>
                      <div className="input-group">
                        <label className="input-label">CVV</label>
                        <input className="input" placeholder="•••" maxLength={4} type="password" value={card.cvv} onChange={e => setCard(c => ({ ...c, cvv: e.target.value }))} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '12px 16px', background: 'rgba(16, 185, 129,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129,0.2)', marginTop: 4 }}>
                      <span>🔒</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>This is a demo. No real charge will be made. Use any card number.</span>
                    </div>
                  </div>
                )}
                {payment !== 'card' && (
                  <div style={{ padding: 32, textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                    <p style={{ fontSize: 16 }}>You'll be redirected to {payment === 'paypal' ? 'PayPal' : 'Apple Pay'} after confirming your order.</p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Review */}
            {step === 3 && (
              <div>
                <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, marginBottom: 28 }}>Review Order</h2>
                {/* Address summary */}
                <div style={{ padding: 20, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                    <span>Delivery Address</span>
                    <button style={{ fontSize: 12, color: 'var(--primary-light)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }} onClick={() => setStep(0)}>Edit</button>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                    {address.full_name}<br />{address.street}<br />{address.city}, {address.state} {address.zip_code}
                  </p>
                </div>
                {/* Items */}
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                    <img src={item.product.images?.[0]} alt="" style={{ width: 64, height: 80, objectFit: 'cover', borderRadius: 8 }} onError={e => e.target.style.display='none'} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600 }}>{item.product.name}</p>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Size: {item.size} · Color: {item.color} · Qty: {item.quantity}</p>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
              {step > 0 ? (
                <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)}>
                  <ArrowLeft size={16} /> Back
                </button>
              ) : <div />}
              {step < 3 ? (
                <button className="btn btn-primary" onClick={handleNext}>
                  Continue <ArrowRight size={16} />
                </button>
              ) : (
                <button className="btn btn-primary btn-lg" onClick={handlePlaceOrder} disabled={loading}>
                  {loading ? 'Placing Order...' : '🎉 Place Order'}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div style={{ position: 'sticky', top: 'calc(var(--navbar-height) + 20px)' }}>
            <div className="glass" style={{ borderRadius: 'var(--radius-xl)', padding: 24 }}>
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 20 }}>Order Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {items.slice(0, 3).map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <img src={item.product.images?.[0]} alt="" style={{ width: 44, height: 56, objectFit: 'cover', borderRadius: 6 }} onError={e => e.target.style.display='none'} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>×{item.quantity}</p>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary-light)' }}>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                {items.length > 3 && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>+{items.length - 3} more items</p>}
              </div>
              <div className="divider" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)' }}>
                  <span>Subtotal</span><span>${subtotal().toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)' }}>
                  <span>Shipping</span>
                  <span style={{ color: shippingCost === 0 ? '#4ade80' : 'inherit' }}>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="divider" />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Outfit', fontWeight: 800, fontSize: 20 }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--primary-light)' }}>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
