import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'

export default function Register() {
  const navigate = useNavigate()
  const { register, loading, error, clearError } = useAuthStore()
  const { fetchCart } = useCartStore()
  const { fetchWishlist } = useWishlistStore()
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)

  const set = (k) => (e) => { clearError(); setForm(f => ({ ...f, [k]: e.target.value })) }

  const passwordStrength = (p) => {
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    return score
  }
  const strength = passwordStrength(form.password)
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColor = ['', 'var(--rose)', 'var(--gold)', 'var(--cyan)', '#4ade80'][strength]

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    if (form.password !== form.confirm) { return }
    const ok = await register(form.email, form.full_name, form.password)
    if (ok) {
      await Promise.all([fetchCart(), fetchWishlist()])
      navigate('/')
    }
  }

  const perks = ['Free shipping on orders over $100', 'Exclusive member discounts', 'Early access to new collections', 'Easy returns & tracking']

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px', background: 'var(--gradient-hero)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -80, left: -80, width: 400, height: 400, background: 'rgba(16,185,129,0.12)', borderRadius: '50%', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', bottom: -60, right: -60, width: 350, height: 350, background: 'rgba(244,63,94,0.08)', borderRadius: '50%', filter: 'blur(80px)' }} />

      <div style={{ width: '100%', maxWidth: 480, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link to="/" className="navbar-logo" style={{ fontSize: 28 }}>✦ ShopFusion</Link>
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 32, marginTop: 24, marginBottom: 8 }}>Create account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Join thousands of fashion lovers</p>
        </div>

        {/* Perks */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
          {perks.map(p => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <Check size={13} color="var(--primary-light)" />
              <span>{p}</span>
            </div>
          ))}
        </div>

        <div className="glass" style={{ borderRadius: 'var(--radius-xl)', padding: 36 }}>
          {error && (
            <div style={{ padding: '12px 16px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 'var(--radius-md)', marginBottom: 20, fontSize: 14, color: '#fb7185' }}>
              ⚠ {error}
            </div>
          )}
          {form.password && form.confirm && form.password !== form.confirm && (
            <div style={{ padding: '12px 16px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 'var(--radius-md)', marginBottom: 20, fontSize: 14, color: '#fb7185' }}>
              ⚠ Passwords do not match
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="reg-name" className="input" type="text" placeholder="John Doe" required
                  value={form.full_name} onChange={set('full_name')} style={{ paddingLeft: 42 }} />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="reg-email" className="input" type="email" placeholder="you@example.com" required
                  value={form.email} onChange={set('email')} style={{ paddingLeft: 42 }} />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="reg-password" className="input" type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" required minLength={6}
                  value={form.password} onChange={set('password')} style={{ paddingLeft: 42, paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Password strength */}
              {form.password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                    {[1,2,3,4].map(n => (
                      <div key={n} style={{ flex: 1, height: 4, borderRadius: 2, background: n <= strength ? strengthColor : 'var(--border)', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 12, color: strengthColor, fontWeight: 600 }}>{strengthLabel}</span>
                </div>
              )}
            </div>

            <div className="input-group">
              <label className="input-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="reg-confirm" className="input" type={showPass ? 'text' : 'password'} placeholder="Repeat password" required
                  value={form.confirm} onChange={set('confirm')} style={{ paddingLeft: 42, borderColor: form.confirm && form.password !== form.confirm ? 'var(--rose)' : undefined }} />
                {form.confirm && form.password === form.confirm && (
                  <Check size={16} color="#4ade80" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }} />
                )}
              </div>
            </div>

            <button id="reg-submit" type="submit" className="btn btn-primary" style={{ justifyContent: 'center', padding: '14px', marginTop: 4 }}
              disabled={loading || (form.confirm && form.password !== form.confirm)}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Creating account...
                </span>
              ) : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 700 }}>Sign in →</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
