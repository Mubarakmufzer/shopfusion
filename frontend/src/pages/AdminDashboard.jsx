import React, { useState } from 'react'
import { Plus, Trash2, Image as ImageIcon, Check, Loader2, AlertCircle, Upload } from 'lucide-react'
import { productsAPI } from '../api'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'men',
    brand: '',
    price: 0,
    original_price: null,
    stock: 10,
    images: [''],
    sizes: 'S,M,L,XL',
    colors: [{ name: 'Black', hex: '#000000' }],
    tags: 'casual,new',
    is_featured: false,
    is_new_arrival: true
  })

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images]
    formData.images[index] = value
    setFormData({ ...formData, images: formData.images })
  }

  const handleFileUpload = async (index, file) => {
    if (!file) return
    setLoading(true)
    try {
      const res = await productsAPI.uploadFile(file)
      handleImageChange(index, res.data.url)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload image')
    } finally {
      setLoading(false)
    }
  }

  const addImageField = () => setFormData({ ...formData, images: [...formData.images, ''] })
  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index)
      setFormData({ ...formData, images: newImages })
    }
  }

  const handleColorChange = (index, field, value) => {
    const newColors = [...formData.colors]
    newColors[index][field] = value
    setFormData({ ...formData, colors: newColors })
  }

  const addColorField = () => setFormData({ ...formData, colors: [...formData.colors, { name: '', hex: '#000000' }] })
  const removeColorField = (index) => {
    if (formData.colors.length > 1) {
      const newColors = formData.colors.filter((_, i) => i !== index)
      setFormData({ ...formData, colors: newColors })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        stock: parseInt(formData.stock),
        sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s),
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        images: formData.images.filter(img => img.trim() !== '')
      }

      await productsAPI.create(payload)
      setSuccess(true)
      setFormData({
        name: '',
        description: '',
        category: 'men',
        brand: '',
        price: 0,
        original_price: null,
        stock: 10,
        images: [''],
        sizes: 'S,M,L,XL',
        colors: [{ name: 'Black', hex: '#000000' }],
        tags: 'casual,new',
        is_featured: false,
        is_new_arrival: true
      })
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', padding: '120px 24px 60px', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 32, marginBottom: 8 }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Add new products to the ShopFusion catalog</p>
        </div>

        <div className="glass" style={{ borderRadius: 'var(--radius-xl)', padding: 32, border: '1px solid var(--border)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* General Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="input-group">
                <label className="input-label">Product Name</label>
                <input className="input" placeholder="e.g. Classic Denim Jacket" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="input-group">
                <label className="input-label">Brand</label>
                <input className="input" placeholder="e.g. UrbanEdge" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} required />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Description</label>
              <textarea className="input" rows={3} placeholder="Tell us more about the product..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required style={{ resize: 'vertical' }} />
            </div>

            {/* Category & Pricing */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
              <div className="input-group">
                <label className="input-label">Category</label>
                <select className="input" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Price ($)</label>
                <input className="input" type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
              </div>
              <div className="input-group">
                <label className="input-label">Stock</label>
                <input className="input" type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} required />
              </div>
            </div>

            {/* Images */}
            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label className="input-label" style={{ marginBottom: 0 }}>Image URLs</label>
                <button type="button" onClick={addImageField} style={{ background: 'none', border: 'none', color: 'var(--primary-light)', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Plus size={14} /> Add Another
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {formData.images.map((url, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <ImageIcon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className="input" placeholder="https://unsplash.com/..." value={url} onChange={e => handleImageChange(idx, e.target.value)} style={{ paddingLeft: 42, paddingRight: 80 }} required />
                    <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 8 }}>
                      <label style={{ cursor: 'pointer', color: 'var(--primary-light)', display: 'flex', alignItems: 'center' }} title="Upload from system">
                        <Upload size={16} />
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileUpload(idx, e.target.files[0])} />
                      </label>
                      {formData.images.length > 1 && (
                        <button type="button" onClick={() => removeImageField(idx)} style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Colors & Sizes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label className="input-label" style={{ marginBottom: 0 }}>Colors</label>
                  <button type="button" onClick={addColorField} style={{ background: 'none', border: 'none', color: 'var(--primary-light)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    + Add Color
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {formData.colors.map((c, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 8 }}>
                      <input className="input" placeholder="Name" value={c.name} onChange={e => handleColorChange(idx, 'name', e.target.value)} required />
                      <input className="input" type="color" value={c.hex} onChange={e => handleColorChange(idx, 'hex', e.target.value)} style={{ width: 44, padding: 4, height: 44 }} />
                      {formData.colors.length > 1 && (
                        <button type="button" onClick={() => removeColorField(idx)} style={{ color: '#fb7185', background: 'none', border: 'none', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Sizes (Comma separated)</label>
                <input className="input" placeholder="S, M, L, XL" value={formData.sizes} onChange={e => setFormData({ ...formData, sizes: e.target.value })} required />
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Use commas to separate sizes</p>
              </div>
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: 24, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
                <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({ ...formData, is_featured: e.target.checked })} style={{ accentColor: 'var(--primary)' }} />
                Featured Product
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
                <input type="checkbox" checked={formData.is_new_arrival} onChange={e => setFormData({ ...formData, is_new_arrival: e.target.checked })} style={{ accentColor: 'var(--primary)' }} />
                New Arrival
              </label>
            </div>

            {/* Feedback Messages */}
            {error && (
              <div style={{ padding: '12px 16px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 'var(--radius-md)', fontSize: 14, color: '#fb7185', display: 'flex', alignItems: 'center', gap: 10 }}>
                <AlertCircle size={18} /> {error}
              </div>
            )}
            {success && (
              <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-md)', fontSize: 14, color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Check size={18} /> Product added successfully!
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center', padding: '16px' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Loader2 size={18} className="animate-spin" /> Adding Product...
                </span>
              ) : 'Publish Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
