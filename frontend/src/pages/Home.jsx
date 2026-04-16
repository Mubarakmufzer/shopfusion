import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react'
import { productsAPI } from '../api'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const navigate = useNavigate()
  const [featured, setFeatured] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      productsAPI.getAll({ featured: true, limit: 4 }),
      productsAPI.getAll({ new_arrival: true, limit: 4 }),
    ]).then(([f, n]) => {
      setFeatured(f.data)
      setNewArrivals(n.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const categories = [
    { label: "Men's", count: '120+ styles', img: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800', to: '/catalog/men' },
    { label: "Women's", count: '200+ styles', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800', to: '/catalog/women' },
    { label: "Kids'", count: '80+ styles', img: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800', to: '/catalog/kids' },
  ]

  const perks = [
    { icon: <Truck size={22} />, title: 'Free Shipping', desc: 'On orders over $100' },
    { icon: <Shield size={22} />, title: 'Secure Payment', desc: '100% secure checkout' },
    { icon: <Zap size={22} />, title: 'Fast Delivery', desc: '2-5 business days' },
    { icon: <ArrowRight size={22} />, title: 'Easy Returns', desc: '30-day return policy' },
  ]

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-orb hero-bg-orb-1" />
        <div className="hero-bg-orb hero-bg-orb-2" />
        <div className="hero-bg-orb hero-bg-orb-3" />
        <div className="container" style={{ paddingTop: 'var(--navbar-height)', position: 'relative', zIndex: 1 }}>
          <div className="hero-content fade-in-up">
            <div className="hero-eyebrow">
              <div className="hero-eyebrow-line" />
              <span>New Season 2026</span>
            </div>
            <h1 className="hero-title">
              Style That<br />
              <span className="gradient-text">Defines</span><br />
              You
            </h1>
            <p className="hero-subtitle">
              Discover premium clothing curated for the modern wardrobe. From everyday essentials to statement pieces — all in one place.
            </p>
            <div className="hero-ctas">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/catalog')}>
                Shop Now <ArrowRight size={18} />
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => navigate('/catalog?new_arrival=true')}>
                New Arrivals
              </button>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-value">10K+</div>
                <div className="hero-stat-label">Happy Customers</div>
              </div>
              <div>
                <div className="hero-stat-value">500+</div>
                <div className="hero-stat-label">Premium Styles</div>
              </div>
              <div>
                <div className="hero-stat-value">4.9★</div>
                <div className="hero-stat-label">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
        {/* Hero image grid */}
        <div className="hero-image-grid">
          {[
            'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500',
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500',
            'https://images.unsplash.com/photo-1536766820879-059fec98ec0a?w=500',
            'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500',
          ].map((src, i) => (
            <img key={i} src={src} alt="" className="hero-img"
              onError={e => e.target.style.display='none'} />
          ))}
        </div>
      </section>

      {/* PERKS BAR */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '28px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {perks.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)', flexShrink: 0 }}>
                  {p.icon}
                </div>
                <div>
                  <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14 }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="section-heading">
            <h2>Shop by Category</h2>
            <div className="section-heading-line" />
          </div>
          <div className="category-cards">
            {categories.map((cat) => (
              <div key={cat.label} className="category-card" onClick={() => navigate(cat.to)}>
                <img src={cat.img} alt={cat.label} className="category-card-img"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800' }} />
                <div className="category-card-overlay">
                  <div className="category-card-label">{cat.label}</div>
                  <div className="category-card-count">{cat.count}</div>
                  <button className="btn btn-ghost btn-sm" style={{ marginTop: 16, width: 'fit-content' }}>
                    Explore <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="container">
          <div className="section-heading">
            <h2>Featured Picks</h2>
            <div className="section-heading-line" />
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/catalog?featured=true')}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : (
            <div className="products-grid">
              {featured.map((p, i) => (
                <ProductCard key={p.id} product={p} style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section style={{ padding: '0 0 80px', background: 'var(--bg-secondary)', paddingTop: 80 }}>
        <div className="container">
          <div className="section-heading">
            <h2>New Arrivals</h2>
            <div className="section-heading-line" />
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/catalog?new_arrival=true')}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : (
            <div className="products-grid">
              {newArrivals.map((p, i) => (
                <ProductCard key={p.id} product={p} style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PROMO BANNER */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{
            borderRadius: 'var(--radius-xl)', padding: '60px 48px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129,0.2), rgba(6,182,212,0.1))',
            border: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40
          }}>
            <div style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, background: 'var(--primary-glow)', borderRadius: '50%', filter: 'blur(60px)' }} />
            <div style={{ position: 'relative' }}>
              <div className="badge badge-rose" style={{ marginBottom: 16 }}>Limited Time</div>
              <h2 style={{ fontFamily: 'Outfit', fontSize: 40, fontWeight: 900, marginBottom: 12 }}>
                Get 20% Off<br />Your First Order
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 28 }}>
                Sign up today and unlock exclusive member-only deals and early access to new collections.
              </p>
              <button className="btn btn-rose btn-lg" onClick={() => navigate('/register')}>
                Claim Offer <ArrowRight size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
              {['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300'].map((src, i) => (
                <img key={i} src={src} alt="" style={{ width: 140, height: 200, objectFit: 'cover', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}
                  onError={e => e.target.style.display='none'} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
