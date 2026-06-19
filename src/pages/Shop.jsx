import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import TicketCard from '../components/TicketCard';
import Loader from '../components/Loader';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    page: 1, limit: 20,
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '-createdAt',
  });
  const { data, isLoading } = useProducts(filters);
  const { data: catData } = useCategories('product');

  const categories = catData?.categories || [];
  const products = data?.products || [];
  const pagination = data?.pagination;

  const updateFilter = (key, value) => {
    const next = { ...filters, [key]: value, page: key === 'page' ? value : 1 };
    setFilters(next);
    if (key === 'search') {
      const params = new URLSearchParams(searchParams);
      if (value) params.set('search', value); else params.delete('search');
      setSearchParams(params);
    }
  };

  const clearFilters = () => setFilters({ page: 1, limit: 20, search: '', sort: '-createdAt' });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary">All Products</h1>
          {filters.search && <p className="text-sm text-text-secondary mt-1">Search results for &ldquo;{filters.search}&rdquo;</p>}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" value={filters.search} onChange={(e) => updateFilter('search', e.target.value)} placeholder="Search products..." className="pl-9 pr-4 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 w-48 lg:w-56" />
          </div>
          <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)} className="px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 bg-surface">
            <option value="-createdAt">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A-Z</option>
            <option value="name_desc">Name: Z-A</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 space-y-6">
          <div>
            <h3 className="font-semibold text-sm text-text-primary mb-3 uppercase tracking-wider">Categories</h3>
            <div className="space-y-1">
              <button onClick={clearFilters} className="block text-sm text-text-secondary hover:text-accent transition-colors">All</button>
              {categories.map((cat) => (
                <button key={cat._id} onClick={() => updateFilter('category', cat._id)} className={`block text-sm transition-colors ${filters.category === cat._id ? 'text-accent font-medium' : 'text-text-secondary hover:text-accent'}`}>
                  {cat.icon && <span className="mr-1.5">{cat.icon}</span>}{cat.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-text-primary mb-3 uppercase tracking-wider">Condition</h3>
            <div className="space-y-1">
              {['new', 'used', 'refurbished'].map((c) => (
                <button key={c} onClick={() => updateFilter('condition', filters.condition === c ? '' : c)} className={`block text-sm capitalize transition-colors ${filters.condition === c ? 'text-accent font-medium' : 'text-text-secondary hover:text-accent'}`}>{c}</button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-text-primary mb-3 uppercase tracking-wider">Price Range</h3>
            <div className="flex gap-2 items-center">
              <input type="number" placeholder="Min" value={filters.minPrice || ''} onChange={(e) => updateFilter('minPrice', e.target.value)} className="w-full px-3 py-1.5 text-sm rounded border border-border focus:outline-none focus:ring-1 focus:ring-accent/50" />
              <span className="text-text-secondary">–</span>
              <input type="number" placeholder="Max" value={filters.maxPrice || ''} onChange={(e) => updateFilter('maxPrice', e.target.value)} className="w-full px-3 py-1.5 text-sm rounded border border-border focus:outline-none focus:ring-1 focus:ring-accent/50" />
            </div>
          </div>
          {(filters.category || filters.condition || filters.search || filters.sort !== '-createdAt') && (
            <button onClick={clearFilters} className="text-xs text-accent hover:underline font-medium">Clear all filters</button>
          )}
        </aside>

        <div className="md:col-span-3">
          {isLoading ? <Loader /> : products.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-12 h-12 text-text-secondary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <p className="text-text-secondary mb-4">No products found matching your filters.</p>
              <button onClick={clearFilters} className="btn-primary text-sm">Clear Filters</button>
            </div>
          ) : (
            <>
              <p className="text-xs text-text-secondary mb-4">{pagination?.total || products.length} product{pagination?.total !== 1 ? 's' : ''} found</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Link key={product._id} to={`/product/${product.slug}`} className="group">
                    <TicketCard className="h-full hover:border-accent/30 hover:shadow-lg dark:ring-1 dark:ring-white/5 transition-all overflow-hidden">
                      <div className="aspect-square bg-bg dark:bg-surface dark:ring-1 dark:ring-white/10 rounded mb-3 flex items-center justify-center text-text-secondary text-sm overflow-hidden relative">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover dark:ring-1 dark:ring-white/10 dark:bg-surface rounded group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <span className="text-xs">No image</span>
                        )}
                        {product.discountPrice && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            -{Math.round((1 - product.discountPrice / product.price) * 100)}%
                          </span>
                        )}
                      </div>
                      <h3 className="font-medium text-sm text-text-primary group-hover:text-accent transition-colors line-clamp-2">{product.name}</h3>
                      <p className="price-tag text-base mt-1">
                        ৳{(product.discountPrice || product.price).toLocaleString()}
                        {product.discountPrice && <span className="text-xs text-text-secondary line-through ml-2">৳{product.price.toLocaleString()}</span>}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-text-secondary">{product.condition === 'used' ? 'Pre-owned' : product.condition === 'refurbished' ? 'Refurbished' : 'New'}</p>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${product.stock > 0 ? 'bg-mint-confirm/10 text-mint-confirm' : 'bg-red-50 text-red-500'}`}>
                          {product.stock > 0 ? 'In Stock' : 'Sold Out'}
                        </span>
                      </div>
                    </TicketCard>
                  </Link>
                ))}
              </div>

              {pagination && pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => updateFilter('page', p)} className={`w-10 h-10 rounded-lg text-sm font-mono transition-colors ${pagination.page === p ? 'bg-accent text-white shadow-sm' : 'bg-surface border border-border text-text-secondary hover:border-accent'}`}>{p}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
