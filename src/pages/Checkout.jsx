import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import api from '../services/api';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Pabna',
    note: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({ product: i.product, qty: i.qty, priceAtPurchase: i.price })),
        shippingAddress: form,
        paymentMethod: 'cod',
      });
      clearCart();
      toast('Order placed successfully!');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to place order. Please try again.';
      setError(msg);
      toast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-text-primary mb-8">Checkout</h1>
      <div className="grid md:grid-cols-5 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Full Name</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Phone Number</label>
            <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Delivery Address</label>
            <textarea required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">City</label>
              <input type="text" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Note (optional)</label>
              <input type="text" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent" />
            </div>
          </div>
          <div className="ticket-stub p-4">
            <p className="font-semibold text-sm mb-2">Payment Method</p>
            <label className="flex items-center gap-3 p-3 rounded-lg bg-mint-confirm/5 border border-mint-confirm/20">
              <input type="radio" name="payment" checked readOnly className="text-mint-confirm" />
              <div>
                <p className="font-medium text-sm">Cash on Delivery</p>
                <p className="text-xs text-text-secondary">Pay when you receive your order</p>
              </div>
            </label>
            <div className="mt-2 space-y-1">
              {['bKash', 'Nagad', 'SSLCommerz'].map((method) => (
                <label key={method} className="flex items-center gap-3 p-3 rounded-lg opacity-40 cursor-not-allowed">
                  <input type="radio" name="payment" disabled className="text-text-secondary" />
                  <div>
                    <p className="font-medium text-sm">{method}</p>
                    <p className="text-xs text-text-secondary">Coming soon</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Processing...' : `Place Order — ৳${totalPrice.toLocaleString()}`}
          </button>
        </form>
        <div className="md:col-span-2">
          <div className="ticket-stub p-4">
            <h3 className="font-semibold text-sm mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              {items.map((item) => (
                <div key={item.product} className="flex justify-between">
                  <span className="text-text-secondary">{item.name} × {item.qty}</span>
                  <span className="font-mono">৳{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-3 pt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span className="price-tag">৳{totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
