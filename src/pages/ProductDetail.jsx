import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProduct, useProducts } from '../hooks/useProducts';
import { useReviews } from '../hooks/useReviews';
import { useQueryClient } from '@tanstack/react-query';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import TicketCard from '../components/TicketCard';
import Loader from '../components/Loader';
import api from '../services/api';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useProduct(slug);
  const { addItem } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const queryClient = useQueryClient();
  const product = data?.product;
  const { data: reviewData } = useReviews('product', product?._id);
  const reviews = reviewData?.reviews || [];

  const { data: relatedData } = useProducts({ category: product?.category?._id, limit: 4, page: 1 });
  const relatedProducts = (relatedData?.products || []).filter((p) => p._id !== product?._id).slice(0, 4);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product?.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast('Link copied to clipboard!');
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (!user) {
      navigate(`/login?redirect=/product/${product.slug}`);
      return;
    }
    addItem(product._id, product.name, product.discountPrice || product.price, product.images?.[0] || '', qty, product.slug);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      await api.post('/reviews', { targetType: 'product', targetId: product._id, ...reviewForm });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'product', product._id] });
      queryClient.invalidateQueries({ queryKey: ['product', slug] });
      setReviewForm({ rating: 5, comment: '' });
      toast('Review submitted!');
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to submit review', 'error');
    }
    setSubmitting(false);
  };

  if (isLoading) return <Loader />;
  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <svg className="w-12 h-12 text-text-secondary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <p className="text-text-secondary">Product not found.</p>
      <Link to="/shop" className="btn-primary mt-6">Back to Shop</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-6">
        <Link to="/shop" className="hover:text-accent transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-text-primary font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div>
          <div className="aspect-square bg-bg dark:bg-surface dark:ring-1 dark:ring-white/10 rounded-xl border border-border flex items-center justify-center text-text-secondary overflow-hidden relative">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover dark:ring-1 dark:ring-white/10 dark:bg-surface" />
            ) : (
              <span className="text-sm">Product Image</span>
            )}
            {product.discountPrice && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                -{Math.round((1 - product.discountPrice / product.price) * 100)}% Off
              </span>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-4">
              {product.images.map((img, i) => (
                <div key={i} className="w-20 h-20 rounded-lg border border-border dark:ring-1 dark:ring-white/10 dark:bg-surface overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover dark:ring-1 dark:ring-white/10 dark:bg-surface" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <TicketCard>
            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">
              {product.brand} • {product.condition === 'new' ? 'New' : product.condition === 'used' ? 'Pre-owned' : 'Refurbished'}
              {product.isSecondHand ? ' • Second-Hand' : ''}
            </p>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-4">{product.name}</h1>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="price-tag text-3xl">৳{(product.discountPrice || product.price).toLocaleString()}</span>
              {product.discountPrice && <span className="text-lg text-text-secondary line-through">৳{product.price.toLocaleString()}</span>}
            </div>

            {product.stock > 0 ? (
              <p className="text-sm text-mint-confirm font-mono mb-4">✓ In Stock ({product.stock} available)</p>
            ) : (
              <p className="text-sm text-red-500 font-mono mb-4">Out of Stock</p>
            )}

            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center text-sm hover:bg-bg dark:hover:bg-surface/80 transition-colors">−</button>
                  <span className="w-10 h-10 flex items-center justify-center font-mono text-sm border-x border-border">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center text-sm hover:bg-bg dark:hover:bg-surface/80 transition-colors">+</button>
                </div>
              </div>
            )}

            <button onClick={handleAddToCart} disabled={product.stock === 0} className={`btn-primary w-full mb-4 ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {added ? 'Added to Cart!' : product.stock > 0 ? `Add to Cart — ৳${((product.discountPrice || product.price) * qty).toLocaleString()}` : 'Out of Stock'}
            </button>

            <button onClick={handleShare} className="text-xs text-text-secondary hover:text-accent transition-colors flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              Share
            </button>


            {product.description && <p className="text-sm text-text-secondary leading-relaxed mt-4 pt-4 border-t border-border">{product.description}</p>}

            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="border-t border-border pt-4 mt-4">
                <h3 className="font-semibold text-sm mb-2">Specifications</h3>
                <dl className="space-y-1 text-sm">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-1">
                      <dt className="text-text-secondary">{key}</dt>
                      <dd className="text-text-primary font-medium">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {product.ratingCount > 0 && (
              <div className="border-t border-border pt-4 mt-4 text-sm">
                <span className="text-repair-amber font-semibold">{'★'.repeat(Math.round(product.ratingAvg))}</span>
                <span className="text-text-secondary ml-2">({product.ratingCount} review{product.ratingCount !== 1 ? 's' : ''})</span>
              </div>
            )}
          </TicketCard>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold text-text-primary mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <Link key={p._id} to={`/product/${p.slug}`} className="group">
                <div className="bg-surface rounded-xl border border-border dark:ring-1 dark:ring-white/5 overflow-hidden hover:shadow-lg hover:border-accent/30 transition-all">
                  <div className="aspect-square bg-bg dark:bg-surface dark:ring-1 dark:ring-white/10 overflow-hidden">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover dark:ring-1 dark:ring-white/10 dark:bg-surface group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-secondary text-xs">No image</div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm text-text-primary group-hover:text-accent transition-colors line-clamp-2">{p.name}</h3>
                    <span className="price-tag text-sm mt-1 block">৳{(p.discountPrice || p.price).toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mb-12">
        <h2 className="font-display text-2xl font-bold text-text-primary mb-6">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-surface rounded-xl border border-border">
            <svg className="w-10 h-10 text-text-secondary mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            <p className="text-text-secondary text-sm">No reviews yet. Be the first to review this product.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-surface rounded-xl border border-border p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-blue-400 text-white flex items-center justify-center text-xs font-bold">{review.user?.name?.charAt(0) || 'A'}</div>
                  <span className="text-repair-amber text-sm">{'★'.repeat(review.rating)}</span>
                  <span className="text-xs text-text-secondary">{review.user?.name || 'Anonymous'}</span>
                </div>
                {review.comment && <p className="text-sm text-text-primary ml-10">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}

        {user ? (
          <form onSubmit={handleReview} className="mt-8 bg-surface rounded-xl border border-border p-6">
            <h3 className="font-semibold text-sm mb-4">Write a Review</h3>
            <div className="mb-4">
              <label className="block text-sm text-text-secondary mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: star })} className={`text-2xl ${star <= reviewForm.rating ? 'text-repair-amber' : 'text-text-secondary/30'} transition-colors hover:text-repair-amber`}>★</button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-text-secondary mb-1">Comment</label>
              <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} rows={3} className="w-full px-4 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary text-sm">{submitting ? 'Submitting...' : 'Submit Review'}</button>
          </form>
        ) : (
          <div className="mt-8 bg-bg rounded-xl p-6 text-center">
            <p className="text-sm text-text-secondary mb-3">Sign in to write a review.</p>
            <Link to="/login" className="btn-primary text-sm">Sign In</Link>
          </div>
        )}
      </div>
    </div>
  );
}
