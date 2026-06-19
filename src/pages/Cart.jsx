import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, removeItem, updateQty, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <svg className="w-20 h-20 text-text-secondary/30 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <h1 className="font-display text-3xl font-bold text-text-primary mb-4">Your Cart is Empty</h1>
        <p className="text-text-secondary mb-8">Looks like you haven't added anything yet. Browse our shop to find great deals!</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/shop" className="btn-primary">Start Shopping</Link>
          <Link to="/repair-services" className="btn-secondary">Repair Services</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-text-primary mb-8">Shopping Cart ({items.length} item{items.length !== 1 ? 's' : ''})</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.product} className="bg-surface rounded-xl border border-border p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
            <div className="w-16 h-16 rounded-lg bg-bg dark:bg-surface dark:ring-1 dark:ring-white/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover dark:ring-1 dark:ring-white/10 dark:bg-surface" />
              ) : (
                <svg className="w-6 h-6 text-text-secondary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Link to={item.slug ? `/product/${item.slug}` : '#'} className="font-medium text-sm text-text-primary hover:text-accent transition-colors line-clamp-1">{item.name}</Link>
              <p className="price-tag text-sm mt-0.5">৳{item.price.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(item.product, item.qty - 1)} className="w-7 h-7 rounded border border-border flex items-center justify-center text-xs hover:bg-bg dark:hover:bg-surface/80 transition-colors" aria-label="Decrease quantity">−</button>
              <span className="font-mono w-8 text-center text-sm">{item.qty}</span>
              <button onClick={() => updateQty(item.product, item.qty + 1)} className="w-7 h-7 rounded border border-border flex items-center justify-center text-xs hover:bg-bg dark:hover:bg-surface/80 transition-colors" aria-label="Increase quantity">+</button>
            </div>
            <p className="price-tag text-sm w-20 text-right">৳{(item.price * item.qty).toLocaleString()}</p>
            <button onClick={() => removeItem(item.product)} className="text-text-secondary hover:text-red-600 transition-colors p-1" aria-label="Remove item">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-surface rounded-xl border border-border p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-text-secondary mb-1">Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</p>
          <p className="font-display text-2xl font-bold text-text-primary"><span className="price-tag">৳{totalPrice.toLocaleString()}</span></p>
          <p className="text-xs text-text-secondary mt-1">Cash on delivery — pay when you receive</p>
        </div>
        <Link to="/checkout" className="btn-primary text-sm">Proceed to Checkout</Link>
      </div>

      <div className="mt-6 text-center">
        <Link to="/shop" className="text-sm text-accent hover:underline font-medium">Continue Shopping</Link>
      </div>
    </div>
  );
}
