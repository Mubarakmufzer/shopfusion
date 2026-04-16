import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { productsAPI } from '../api'
import ProductCard from '../components/ProductCard'

const SIZES_MEN = ['XS','S','M','L','XL','XXL']
const SIZES_WOMEN = ['XS','S','M','L','XL']
const SIZES_KIDS = ['2T','3T','4T','5','6','7','8','10','12']
const COLORS = [
  { name: 'Black', hex: '#1a1a1a' }, { name: 'White', hex: '#f5f5f5' },
  { name: 'Navy', hex: '#1e2b5a' }, { name: 'Red', hex: '#e53e3e' },
  { name: 'Green', hex: '#4caf50' }, { name: 'Pink', hex: '#ffb6c1' },
  { name: 'Camel', hex: '#c19a6b' }, { name: 'Grey', hex: '#9e9e9e' },
]

export default function Catalog() {
  const { category } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(true)

  // Filter state
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [priceRange, setPriceRange] = useState([0, 500])
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')

  const search = searchParams.get('search')
  const featured = searchParams.get('featured')
  const newArrival = searchParams.get('new_arrival')

  useEffect(() => {
    productsAPI.getBrands().then(r => setBrands(r.data))
  }, [])

  const fetchProducts = useCallback(() => {
    setLoading(true)
    const params = {
      sort,
      min_price: priceRange[0] || undefined,
      max_price: priceRange[1] < 500 ? priceRange[1] : undefined,
    }
    if (category) params.category = category
    if (search) params.search = search
    if (selectedBrand) params.brand = selectedBrand
    if (selectedColor) params.color = selectedColor
    if (selectedSizes.length === 1) params.size = selectedSizes[0]
    if (featured) params.featured = true
    if (newArrival) params.new_arrival = true

    productsAPI.getAll(params).then(r => {
      let data = r.data
      if (selectedSizes.length > 1) {
        data = data.filter(p => selectedSizes.some(s => p.sizes?.includes(s)))
      }
      setProducts(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [category, search, selectedBrand, selectedColor, selectedSizes, priceRange, sort, featured, newArrival])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const sizes = category === 'kids' ? SIZES_KIDS : category === 'women' ? SIZES_WOMEN : SIZES_MEN

  const toggleSize = (s) => setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  const clearAll = () => {
    setSelectedSizes([]); setSelectedColor(null); setSelectedBrand(null); setPriceRange([0, 500])
  }

  const title = category ? `${category.charAt(0).toUpperCase() + category.slice(1)}'s Collection` : search ? `Results for "${search}"` : featured ? 'Featured Picks' : newArrival ? 'New Arrivals' : 'All Products'

  return (
    <main className="page">
      <div className="container">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontFamily: 'Outfit', fontSize: 36, fontWeight: 800 }}>{title}</h1>
              <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>{products.length} products found</p>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setShowFilters(!showFilters)} style={{ gap: 8 }}>
                <SlidersHorizontal size={16} /> Filters {showFilters ? '▲' : '▼'}
              </button>
              <select className="input" value={sort} onChange={e => setSort(e.target.value)} style={{ width: 'auto', padding: '10px 16px' }}>
                <option value="newest">Newest</option>
                <option value="rating">Top Rated</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          {/* FILTER PANEL */}
          {showFilters && (
            <aside className="filter-panel" style={{ position: 'sticky', top: 'calc(var(--navbar-height) + 20px)', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 16 }}>Filters</span>
                <button className="btn btn-ghost btn-sm" onClick={clearAll}>Clear All</button>
              </div>

              {/* Category */}
              <div className="filter-section">
                <div className="filter-title">Category</div>
                {['men','women','kids'].map(c => (
                  <button key={c} className={`filter-chip${category === c ? ' active' : ''}`}
                    onClick={() => navigate(c === category ? '/catalog' : `/catalog/${c}`)}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>

              {/* Price */}
              <div className="filter-section">
                <div className="filter-title">Price Range</div>
                <p style={{ fontSize: 13, color: 'var(--primary-light)', marginBottom: 10, fontWeight: 600 }}>
                  $0 — ${priceRange[1] < 500 ? priceRange[1] : '500+'}
                </p>
                <input type="range" className="range-input" min={0} max={500} step={10}
                  value={priceRange[1]} onChange={e => setPriceRange([0, +e.target.value])} />
              </div>

              {/* Sizes */}
              <div className="filter-section">
                <div className="filter-title">Size</div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {sizes.map(s => (
                    <button key={s} className={`filter-chip${selectedSizes.includes(s) ? ' active' : ''}`} onClick={() => toggleSize(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="filter-section">
                <div className="filter-title">Color</div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {COLORS.map(c => (
                    <div key={c.name} className={`color-swatch${selectedColor === c.name ? ' active' : ''}`}
                      style={{ background: c.hex }} title={c.name}
                      onClick={() => setSelectedColor(selectedColor === c.name ? null : c.name)} />
                  ))}
                </div>
                {selectedColor && <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>Selected: {selectedColor}</p>}
              </div>

              {/* Brand */}
              <div className="filter-section">
                <div className="filter-title">Brand</div>
                {brands.map(b => (
                  <button key={b} className={`filter-chip${selectedBrand === b ? ' active' : ''}`}
                    onClick={() => setSelectedBrand(selectedBrand === b ? null : b)}>
                    {b}
                  </button>
                ))}
              </div>
            </aside>
          )}

          {/* PRODUCTS */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <div className="loading-center"><div className="spinner" /></div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query.</p>
                <button className="btn btn-primary" onClick={clearAll}>Clear Filters</button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((p, i) => (
                  <ProductCard key={p.id} product={p} style={{ animationDelay: `${(i % 8) * 0.05}s` }} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
