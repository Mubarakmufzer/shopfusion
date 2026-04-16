import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, ChevronDown, ChevronUp, Check } from 'lucide-react'
import { ordersAPI } from '../api'

const STATUS_STEPS = ['processing', 'shipped', 'delivered']
const STATUS_LABELS = { pending: 'Pending', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' }
const STATUS_ICONS = { pending: '⏳', processing: '📦', shipped: '🚚', delivered: '✅', cancelled: '❌' }
const STATUS_COLORS = { pending: 'var(--gold)', processing: 'var(--primary-light)', shipped: 'var(--cyan)', delivered: '#4ade80', cancelled: 'var(--rose)' }

export default function Orders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    ordersAPI.getAll().then(r => { setOrders(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <main className="page"><div className="container loading-center"><div className="spinner" /></div></main>

  if (orders.length === 0) {
    return (
      <main className="page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No orders yet</h3>
            <p>Once you place an order, you'll see it here.</p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/catalog')}>Start Shopping</button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 860 }}>
        <div className="page-header">
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 800 }}>My Orders</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>{orders.length} orders placed</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {orders.map(order => {
            const isOpen = expanded === order.id
            const statusIdx = STATUS_STEPS.indexOf(order.status)

            return (
              <div key={order.id} className="glass" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                {/* Order Header */}
                <div style={{ padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, cursor: 'pointer', borderBottom: isOpen ? '1px solid var(--border)' : 'none' }}
                  onClick={() => setExpanded(isOpen ? null : order.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: `${STATUS_COLORS[order.status]}20`, border: `1px solid ${STATUS_COLORS[order.status]}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                      {STATUS_ICONS[order.status]}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 16 }}>Order #{order.id}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: STATUS_COLORS[order.status], background: `${STATUS_COLORS[order.status]}15`, padding: '3px 10px', borderRadius: 'var(--radius-full)', border: `1px solid ${STATUS_COLORS[order.status]}30` }}>
                          {STATUS_LABELS[order.status]}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>
                        {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        {order.tracking_number && <span style={{ marginLeft: 12, color: 'var(--primary-light)', fontWeight: 600 }}>Track: {order.tracking_number}</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 20, color: 'var(--primary-light)' }}>${order.total.toFixed(2)}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{order.items.length} item{order.items.length > 1 ? 's' : ''}</div>
                    </div>
                    {isOpen ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                  </div>
                </div>

                {/* Expanded Content */}
                {isOpen && (
                  <div style={{ padding: '28px' }}>
                    {/* Timeline */}
                    {order.status !== 'cancelled' && (
                      <div style={{ marginBottom: 36 }}>
                        <h4 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 20, fontSize: 15 }}>Order Timeline</h4>
                        <div className="order-timeline">
                          {STATUS_STEPS.map((s, i) => {
                            const isDone = statusIdx > i
                            const isActive = statusIdx === i
                            return (
                              <div key={s} className={`timeline-step${isDone ? ' completed' : ''}${isActive ? ' active' : ''}`}>
                                <div className="timeline-dot">
                                  {isDone ? <Check size={14} /> : i + 1}
                                </div>
                                <div className="timeline-label">{STATUS_LABELS[s]}</div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Items */}
                    <h4 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Items</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
                      {order.items.map(item => (
                        <div key={item.id} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                          <img src={item.product_image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200'} alt={item.product_name}
                            style={{ width: 60, height: 78, objectFit: 'cover', borderRadius: 8 }}
                            onError={e => e.target.src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200'} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 600, marginBottom: 4 }}>{item.product_name}</p>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                              {[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`, `Qty: ${item.quantity}`].filter(Boolean).join(' · ')}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontWeight: 700, color: 'var(--primary-light)' }}>${(item.price * item.quantity).toFixed(2)}</p>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>${item.price.toFixed(2)} each</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Summary row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div style={{ padding: 20, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Delivery Address</div>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                          {order.shipping_address?.full_name}<br />
                          {order.shipping_address?.street}<br />
                          {order.shipping_address?.city}, {order.shipping_address?.state}
                        </p>
                      </div>
                      <div style={{ padding: 20, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Order Summary</div>
                        {[['Subtotal', `$${order.subtotal.toFixed(2)}`], ['Shipping', order.shipping_cost === 0 ? 'FREE' : `$${order.shipping_cost.toFixed(2)}`], ['Total', `$${order.total.toFixed(2)}`]].map(([k, v]) => (
                          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
                            <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                            <span style={{ fontWeight: k === 'Total' ? 800 : 500, color: k === 'Total' ? 'var(--primary-light)' : 'var(--text-secondary)' }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button className="btn btn-ghost btn-sm" style={{ marginTop: 20 }} onClick={() => navigate(`/product/${order.items[0]?.product_id}`)}>
                      <Package size={14} /> Buy Again
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
