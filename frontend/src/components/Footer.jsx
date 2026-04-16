import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="navbar-logo" style={{ fontSize: 24, display: 'inline-block', marginBottom: 16 }}>✦ ShopFusion</Link>
            <p className="footer-brand-desc">
              Premium clothing for every lifestyle. Curated collections for men, women, and kids — crafted with quality, delivered with care.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {['Instagram', 'Twitter', 'Pinterest'].map(s => (
                <div key={s} style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer',
                  transition: 'var(--transition)'
                }}>
                  {s[0]}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="footer-col-title">Shop</div>
            <Link to="/catalog/men" className="footer-link">Men's</Link>
            <Link to="/catalog/women" className="footer-link">Women's</Link>
            <Link to="/catalog/kids" className="footer-link">Kids'</Link>
            <Link to="/catalog?sort=price_asc" className="footer-link">Sale</Link>
          </div>
          <div>
            <div className="footer-col-title">Account</div>
            <Link to="/login" className="footer-link">Sign In</Link>
            <Link to="/register" className="footer-link">Register</Link>
            <Link to="/orders" className="footer-link">My Orders</Link>
            <Link to="/wishlist" className="footer-link">Wishlist</Link>
          </div>
          <div>
            <div className="footer-col-title">Help</div>
            <span className="footer-link" style={{ cursor: 'default' }}>Shipping & Returns</span>
            <span className="footer-link" style={{ cursor: 'default' }}>Size Guide</span>
            <span className="footer-link" style={{ cursor: 'default' }}>Contact Us</span>
            <span className="footer-link" style={{ cursor: 'default' }}>Privacy Policy</span>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ShopFusion. All rights reserved. Built with ♥</p>
        </div>
      </div>
    </footer>
  )
}
