import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Heart, User, Search, Menu, X, LogOut, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { items: cartItems } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0)
  const wishCount = wishlistItems.length

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Men', to: '/catalog/men' },
    { label: 'Women', to: '/catalog/women' },
    { label: 'Kids', to: '/catalog/kids' },
    { label: 'Sale', to: '/catalog?sort=price_asc' },
  ]

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchVal.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchVal.trim())}`)
      setSearchOpen(false)
      setSearchVal('')
    }
  }

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">✦ ShopFusion</Link>

        <div className="navbar-nav">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className={`nav-link${isActive(l.to) && l.to !== '/' ? ' active' : location.pathname === '/' && l.to === '/' ? ' active' : ''}`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          {/* Search */}
          {searchOpen ? (
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                autoFocus
                className="input"
                style={{ width: 220, padding: '8px 14px', fontSize: 14 }}
                placeholder="Search products..."
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
              />
              <button type="button" className="navbar-icon-btn" onClick={() => setSearchOpen(false)}>
                <X size={18} />
              </button>
            </form>
          ) : (
            <button className="navbar-icon-btn" onClick={() => setSearchOpen(true)} title="Search">
              <Search size={20} />
            </button>
          )}

          {/* Wishlist */}
          {isAuthenticated() && (
            <button className="navbar-icon-btn" onClick={() => navigate('/wishlist')} title="Wishlist">
              <Heart size={20} />
              {wishCount > 0 && <span className="navbar-badge">{wishCount}</span>}
            </button>
          )}

          {/* Cart */}
          <button className="navbar-icon-btn" onClick={() => navigate(isAuthenticated() ? '/cart' : '/login')} title="Cart">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="navbar-badge">{cartCount}</span>}
          </button>

          {/* User */}
          {isAuthenticated() ? (
            <div style={{ position: 'relative' }}>
              <button className="navbar-user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="navbar-avatar">
                  {user?.full_name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.full_name?.split(' ')[0]}
                </span>
              </button>
              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: '110%', right: 0, width: 180,
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', overflow: 'hidden', zIndex: 100,
                  boxShadow: 'var(--shadow-card)'
                }}>
                  <Link to="/orders" className="footer-link" style={{ padding: '12px 16px', display: 'block' }} onClick={() => setDropdownOpen(false)}>
                    My Orders
                  </Link>
                  {user?.is_admin && (
                    <Link to="/admin" className="footer-link" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary-light)' }} onClick={() => setDropdownOpen(false)}>
                      <ShieldCheck size={15} /> Admin Dashboard
                    </Link>
                  )}
                  <Link to="/wishlist" className="footer-link" style={{ padding: '12px 16px', display: 'block' }} onClick={() => setDropdownOpen(false)}>
                    Wishlist
                  </Link>
                  <div className="divider" style={{ margin: '4px 0' }} />
                  <button onClick={handleLogout} style={{
                    width: '100%', textAlign: 'left', padding: '12px 16px',
                    background: 'none', color: 'var(--rose)', fontSize: 14,
                    display: 'flex', alignItems: 'center', gap: 8
                  }}>
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
