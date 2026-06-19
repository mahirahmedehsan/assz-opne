import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import TicketCard from '../components/TicketCard';
import StatusStamp from '../components/StatusStamp';
import Loader from '../components/Loader';

function getInitial(name) {
  if (!name) return '?';
  const s = name.trim();
  const cp = s.codePointAt(0);
  if (!cp) return '?';
  const firstIsLetter = /^\p{L}$/u.test(String.fromCodePoint(cp));
  if (!firstIsLetter) return s.length > 2 ? s.slice(0, 2) : s;
  const parts = s.split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return parts.slice(0, 2).map(p => p[0].toUpperCase()).join('');
}

export default function Account() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressIdx, setEditingAddressIdx] = useState(null);
  const [addressForm, setAddressForm] = useState({ label: 'Home', address: '', city: '', phone: '' });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/users/me').then((r) => r.data),
    enabled: !!user,
  });

  const { data: ordersData } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => api.get('/orders/my').then((r) => r.data),
    enabled: !!user,
  });

  const orders = ordersData?.orders || [];
  const p = profile?.user;

  const updateMutation = useMutation({
    mutationFn: (body) => api.put('/users/me', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setEditing(false);
    },
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const body = {};
    if (form.name !== p.name) body.name = form.name;
    if (form.phone !== (p.phone || '')) body.phone = form.phone;
    if (form.address !== (p.address || '')) body.address = form.address;
    if (Object.keys(body).length) updateMutation.mutate(body);
    else setEditing(false);
  };

  const startEditing = () => {
    setForm({ name: p?.name || '', phone: p?.phone || '', address: p?.address || '' });
    setEditing(true);
  };

  const handleSaveAddresses = (updatedAddresses) => {
    updateMutation.mutate({ addresses: updatedAddresses });
  };

  const addAddress = (e) => {
    e.preventDefault();
    const current = p?.addresses || [];
    if (editingAddressIdx !== null) {
      const updated = [...current];
      updated[editingAddressIdx] = addressForm;
      handleSaveAddresses(updated);
    } else {
      handleSaveAddresses([...current, addressForm]);
    }
    setAddressForm({ label: 'Home', address: '', city: '', phone: '' });
    setEditingAddressIdx(null);
    setShowAddressForm(false);
  };

  const removeAddress = (idx) => {
    const current = p?.addresses || [];
    handleSaveAddresses(current.filter((_, i) => i !== idx));
  };

  const editAddress = (idx) => {
    const addr = (p?.addresses || [])[idx];
    setAddressForm(addr);
    setEditingAddressIdx(idx);
    setShowAddressForm(true);
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-text-primary mb-4">Please Sign In</h1>
        <p className="text-text-secondary mb-6">You need to be logged in to view your account.</p>
        <Link to="/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-text-primary mb-8">My Account</h1>

      <div className="flex gap-1 mb-8 border-b border-border">
        <button onClick={() => setTab('profile')} className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'profile' ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
          Profile
        </button>
        <button onClick={() => setTab('orders')} className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'orders' ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
          Order History ({orders.length})
        </button>
      </div>

      {tab === 'profile' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <TicketCard>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Personal Information</h2>
                {!editing && (
                  <button onClick={startEditing} className="text-xs font-medium text-accent hover:underline">
                    Edit
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">Full Name</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">Email</label>
                    <input type="email" value={user.email} disabled className="w-full px-3 py-2 rounded-lg border border-border bg-bg/50 text-text-secondary text-sm cursor-not-allowed" />
                    <p className="text-[11px] text-text-secondary mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">Phone</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">Address</label>
                    <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm resize-none" />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button type="submit" disabled={updateMutation.isPending} className="btn-primary text-xs px-4 py-2">
                      {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" onClick={() => setEditing(false)} className="btn-secondary text-xs px-4 py-2">
                      Cancel
                    </button>
                  </div>
                  {updateMutation.isError && (
                    <p className="text-red-600 text-xs">{updateMutation.error.message}</p>
                  )}
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 pb-3 border-b border-border">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-purple-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {getInitial(p?.name || user.displayName || user.email || 'U')}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-text-primary">{p?.name || user.displayName || 'User'}</p>
                      <p className="text-xs text-text-secondary">{user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-text-secondary">Phone</p>
                      <p className="text-text-primary">{p?.phone || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary">Role</p>
                      <p className="text-text-primary capitalize">{p?.role || 'customer'}</p>
                    </div>
                  </div>
                  {p?.address && (
                    <div>
                      <p className="text-xs text-text-secondary">Address</p>
                      <p className="text-sm text-text-primary">{p.address}</p>
                    </div>
                  )}
                  <p className="text-xs text-text-secondary pt-1">
                    Joined {p?.createdAt ? new Date(p.createdAt).toLocaleDateString('en-BD') : '—'}
                  </p>
                </div>
              )}
            </TicketCard>

            <TicketCard>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Saved Addresses</h2>
                <button onClick={() => { setAddressForm({ label: 'Home', address: '', city: '', phone: '' }); setEditingAddressIdx(null); setShowAddressForm(true); }} className="text-xs font-medium text-accent hover:underline">
                  + Add Address
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={addAddress} className="mb-4 p-4 bg-bg/50 rounded-lg border border-border space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">Label</label>
                      <select value={addressForm.label} onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm">
                        <option>Home</option>
                        <option>Work</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">Phone</label>
                      <input type="tel" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">Address</label>
                    <input type="text" required value={addressForm.address} onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })} placeholder="Street, area, building" className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">City</label>
                    <input type="text" required value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm" />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="btn-primary text-xs px-4 py-2">
                      {editingAddressIdx !== null ? 'Update' : 'Add'} Address
                    </button>
                    <button type="button" onClick={() => { setShowAddressForm(false); setEditingAddressIdx(null); }} className="btn-secondary text-xs px-4 py-2">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {(!p?.addresses || p.addresses.length === 0) && !showAddressForm && (
                <p className="text-sm text-text-secondary text-center py-6">No saved addresses yet.</p>
              )}

              {p?.addresses?.length > 0 && (
                <div className="space-y-2">
                  {p.addresses.map((addr, idx) => (
                    <div key={idx} className="flex items-start justify-between p-3 rounded-lg border border-border bg-bg/30">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">{addr.label}</span>
                        </div>
                        <p className="text-sm text-text-primary">{addr.address}</p>
                        <p className="text-xs text-text-secondary">{addr.city}{addr.phone ? ` — ${addr.phone}` : ''}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => editAddress(idx)} className="text-xs text-accent hover:underline px-2 py-1">Edit</button>
                        <button onClick={() => removeAddress(idx)} className="text-xs text-red-500 hover:underline px-2 py-1">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TicketCard>
          </div>

          <div className="space-y-6">
            <TicketCard>
              <h2 className="font-semibold text-sm mb-2">Total Orders</h2>
              <p className="font-display text-3xl font-bold text-accent">{orders.length}</p>
              <p className="text-xs text-text-secondary mt-1">View your order history</p>
            </TicketCard>
            <TicketCard>
              <h2 className="font-semibold text-sm mb-2">Account Type</h2>
              <p className="font-display text-lg font-bold text-text-primary capitalize">{p?.role || 'customer'}</p>
              <p className="text-xs text-text-secondary mt-1">Joined {p?.createdAt ? new Date(p.createdAt).toLocaleDateString('en-BD') : '—'}</p>
            </TicketCard>
            {updateMutation.isSuccess && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-sm text-green-700 dark:text-green-400">
                Profile updated successfully
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-text-primary">Order History</h2>
            <span className="text-xs font-mono text-text-secondary bg-bg px-3 py-1.5 rounded-full border border-border">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</span>
          </div>
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-surface rounded-xl border border-border">
              <svg className="w-10 h-10 text-text-secondary mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              <p className="text-text-secondary mb-4">No orders yet.</p>
              <Link to="/shop" className="btn-primary text-sm">Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link key={order._id} to={`/order/${order._id}`} className="block group">
                  <div className="bg-surface rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-accent/20 transition-all duration-200">
                    <div className="px-5 py-4 bg-bg/30 border-b border-border flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">{order.orderNumber}</p>
                          <p className="text-[11px] text-text-secondary">{new Date(order.createdAt).toLocaleString('en-BD', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="price-tag text-base">৳{order.total.toLocaleString()}</span>
                        <StatusStamp status={order.orderStatus} />
                      </div>
                    </div>

                    <div className="px-5 py-4">
                      <div className="space-y-3">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-bg border border-border overflow-hidden shrink-0 flex items-center justify-center">
                              {item.product?.images?.[0] ? (
                                <img src={item.product.images[0]} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-text-primary truncate">{item.name}</p>
                              <p className="text-xs text-text-secondary">Qty: {item.qty} × ৳{item.priceAtPurchase?.toLocaleString()}</p>
                            </div>
                            <span className="text-sm font-mono font-semibold text-text-primary shrink-0">৳{(item.qty * item.priceAtPurchase).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="px-5 py-3 bg-bg/20 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-text-secondary">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                          {order.shippingAddress?.city || order.shippingAddress?.address || 'Address not set'}
                        </span>
                        <span className="flex items-center gap-1 text-text-secondary capitalize">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                          {order.paymentMethod}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-accent group-hover:gap-2 transition-all">
                        <span className="text-xs font-medium">View Details</span>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
