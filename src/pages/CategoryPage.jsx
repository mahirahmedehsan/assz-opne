import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import TicketCard from '../components/TicketCard';
import Loader from '../components/Loader';

export default function CategoryPage() {
  const { category } = useParams();
  const [page, setPage] = useState(1);
  const { data: catData } = useCategories('product');
  const cat = catData?.categories?.find((c) => c.slug === category);
  const { data, isLoading } = useProducts({ category: cat?._id, page, limit: 20 });

  const products = data?.products || [];
  const pagination = data?.pagination;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {cat && (
        <div className="relative mb-10 rounded-2xl overflow-hidden bg-gradient-to-r from-gray-950 to-gray-900 text-white px-8 py-12">
          <div className="relative z-10">
            <p className="text-4xl mb-2">{cat.icon || '📦'}</p>
            <h1 className="font-display text-3xl font-bold">{cat.name}</h1>
            {cat.description && <p className="text-sm text-white/70 mt-2 max-w-xl">{cat.description}</p>}
          </div>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)' }} />
        </div>
      )}
      {!cat && (
        <h1 className="font-display text-3xl font-bold text-text-primary capitalize mb-8">
          {category?.replace(/-/g, ' ')}
        </h1>
      )}

      {isLoading ? (
        <Loader />
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-12 h-12 text-text-secondary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-text-secondary mb-4">No products in this category yet.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/shop" className="btn-primary">Browse All Products</Link>
            <Link to="/" className="btn-secondary">Go Home</Link>
          </div>
        </div>
      ) : (
        <>
          <p className="text-xs text-text-secondary mb-4">{pagination?.total || products.length} product{pagination?.total !== 1 ? 's' : ''} in this category</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link key={product._id} to={`/product/${product.slug}`} className="group">
                <TicketCard className="h-full hover:border-accent/30 hover:shadow-lg dark:ring-1 dark:ring-white/5 transition-all overflow-hidden">
                  <div className="aspect-square bg-bg dark:bg-surface dark:ring-1 dark:ring-white/10 rounded mb-3 flex items-center justify-center text-text-secondary text-sm overflow-hidden">
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
                  <p className="text-xs text-text-secondary mt-1 capitalize">{product.condition}</p>
                </TicketCard>
              </Link>
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 rounded-lg text-sm font-mono transition-colors ${page === p ? 'bg-accent text-white shadow-sm' : 'bg-surface border border-border text-text-secondary hover:border-accent'}`}>{p}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
