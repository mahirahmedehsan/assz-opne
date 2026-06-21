import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useAdminHeroSlides, useCreateHeroSlide, useUpdateHeroSlide, useDeleteHeroSlide } from '../hooks/useHeroSlides';
import { useContactInfo } from '../hooks/useContactInfo';
import { useAboutInfo } from '../hooks/useAboutInfo';
import StatusStamp from '../components/StatusStamp';
import { useToast } from '../components/Toast';
import api from '../services/api';

const navItems = [
  { path: '/admin', label: 'Overview', end: true, icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { path: '/admin/products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { path: '/admin/categories', label: 'Categories', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { path: '/admin/orders', label: 'Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { path: '/admin/repair-bookings', label: 'Repairs', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { path: '/admin/customers', label: 'Customers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { path: '/admin/repair-services', label: 'Repair Services', icon: 'M11.42 15.17l-5.45-5.45a1 1 0 010-1.42l2.12-2.12a1 1 0 011.42 0l5.45 5.45a1 1 0 010 1.42l-2.12 2.12a1 1 0 01-1.42 0zm-5.45-5.45l-2.12 2.12a1 1 0 000 1.42l5.45 5.45a1 1 0 001.42 0l2.12-2.12a1 1 0 000-1.42l-5.45-5.45a1 1 0 00-1.42 0zM14 5l7 7m-7 7l7-7' },
  { path: '/admin/reviews', label: 'Reviews', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  { path: '/admin/messages', label: 'Messages', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { path: '/admin/hero-slides', label: 'Hero Slides', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { path: '/admin/contact-info', label: 'Contact Info', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { path: '/admin/about-info', label: 'About', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
];

function AdminSidebar() {
  const location = useLocation();
  return (
    <aside className="w-64 bg-surface border-r border-border min-h-screen p-4 flex-shrink-0 hidden lg:flex flex-col">
      <div className="mb-6 px-3">
        <h2 className="font-display text-lg font-bold text-text-primary">Admin Panel</h2>
        <p className="text-[10px] text-text-secondary font-mono uppercase tracking-wider mt-0.5">ASSZ Dashboard</p>
      </div>
      <nav className="space-y-0.5 flex-1">
        {navItems.map((item) => {
          const active = item.end ? location.pathname === item.path : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-secondary hover:bg-bg dark:hover:bg-surface/80 hover:text-text-primary'
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="pt-4 border-t border-border mt-4">
        <Link to="/" className="flex items-center gap-2 text-xs text-text-secondary hover:text-accent transition-colors px-3">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Site
        </Link>
      </div>
    </aside>
  );
}

function StatCard({ label, value, sub, icon, color }) {
  return (
    <div className="bg-surface rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-text-secondary uppercase tracking-wider font-medium">{label}</p>
          <p className="font-display text-2xl font-bold mt-1 text-text-primary">{value}</p>
          {sub && <p className="text-xs text-text-secondary mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
      </div>
    </div>
  );
}

function AdminOverview() {
  const { data: ordersData } = useQuery({ queryKey: ['admin-orders-overview'], queryFn: () => api.get('/orders/admin?limit=1000').then((r) => r.data) });
  const { data: recentOrders } = useQuery({ queryKey: ['admin-orders-recent'], queryFn: () => api.get('/orders/admin?limit=5').then((r) => r.data) });
  const { data: bookings } = useQuery({ queryKey: ['admin-bookings-recent'], queryFn: () => api.get('/repair-bookings/admin?limit=5').then((r) => r.data) });
  const { data: messages } = useQuery({ queryKey: ['admin-messages'], queryFn: () => api.get('/contact/admin').then((r) => r.data) });
  const { data: usersData } = useQuery({ queryKey: ['admin-users-count'], queryFn: () => api.get('/users/admin?limit=1').then((r) => r.data) });

  const allOrders = ordersData?.orders || [];
  const totalRevenue = allOrders.reduce((s, o) => s + (o.orderStatus !== 'cancelled' ? o.total : 0), 0) || 0;
  const totalOrders = ordersData?.pagination?.total || allOrders.length;
  const pendingOrders = allOrders.filter((o) => o.orderStatus === 'placed').length;
  const activeRepairs = bookings?.bookings?.filter((b) => ['pending', 'diagnosed', 'in_repair'].includes(b.status)).length || 0;
  const unreadMessages = messages?.messages?.filter((m) => !m.isRead).length || 0;
  const totalCustomers = usersData?.pagination?.total || usersData?.users?.length || 0;

  const statuses = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'];
  const statusCounts = statuses.map((s) => ({ status: s, count: allOrders.filter((o) => o.orderStatus === s).length }));
  const maxStatusCount = Math.max(...statusCounts.map((s) => s.count), 1);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const dayTotal = allOrders
      .filter((o) => o.createdAt?.slice(0, 10) === key && o.orderStatus !== 'cancelled')
      .reduce((s, o) => s + o.total, 0);
    const label = d.toLocaleDateString('en-BD', { weekday: 'short' });
    return { label, total: dayTotal };
  });
  const maxDayRevenue = Math.max(...last7Days.map((d) => d.total), 1);

  const recentActivity = [
    ...(recentOrders?.orders || []).map((o) => ({ type: 'order', id: o._id, ref: o.orderNumber, name: o.shippingAddress?.name || 'Guest', amount: o.total, status: o.orderStatus, date: o.createdAt })),
    ...(bookings?.bookings || []).map((b) => ({ type: 'booking', id: b._id, ref: `#${b.ticketNumber}`, name: b.customer?.name, device: b.deviceType, status: b.status, date: b.createdAt })),
    ...(messages?.messages || []).filter((m) => !m.isRead).slice(0, 3).map((m) => ({ type: 'message', id: m._id, name: m.name, subject: m.subject, date: m.createdAt })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

  const today = new Date().toLocaleDateString('en-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-secondary mt-1">{today}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-mint-confirm animate-pulse" />
          <span className="text-xs text-text-secondary font-mono">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <StatCard label="Total Revenue" value={`৳${totalRevenue.toLocaleString()}`} sub={`From ${totalOrders} orders`} icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" color="bg-emerald-500/10 text-emerald-500" />
        <StatCard label="Total Orders" value={totalOrders} sub={`${statusCounts.find((s) => s.status === 'delivered')?.count || 0} delivered`} icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" color="bg-blue-500/10 text-blue-500" />
        <StatCard label="Pending" value={pendingOrders} sub="Awaiting processing" icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" color="bg-amber-500/10 text-amber-500" />
        <StatCard label="Active Repairs" value={activeRepairs} sub="In progress" icon="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" color="bg-violet-500/10 text-violet-500" />
        <StatCard label="Customers" value={totalCustomers} sub="Registered users" icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" color="bg-sky-500/10 text-sky-500" />
        <StatCard label="Unread Messages" value={unreadMessages} sub="Need reply" icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" color="bg-rose-500/10 text-rose-500" />
      </div>

      <div className="grid lg:grid-cols-7 gap-6 mb-6">
        <div className="lg:col-span-4 bg-surface rounded-xl border border-border shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-sm text-text-primary">Revenue (Last 7 Days)</h2>
            <span className="text-xs text-text-secondary">Non-cancelled orders</span>
          </div>
          <div className="flex items-end justify-between gap-2 h-32">
            {last7Days.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-mono text-text-secondary font-medium">৳{d.total.toLocaleString()}</span>
                <div
                  className="w-full rounded-md bg-gradient-to-t from-accent to-accent/60 hover:from-accent/80 hover:to-accent transition-all duration-300 cursor-pointer"
                  style={{ height: `${Math.max((d.total / maxDayRevenue) * 100, 4)}%` }}
                />
                <span className="text-[10px] font-mono text-text-secondary">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 bg-surface rounded-xl border border-border shadow-sm p-5">
          <h2 className="font-semibold text-sm text-text-primary mb-4">Order Status</h2>
          <div className="space-y-3">
            {statusCounts.map(({ status, count }) => (
              <div key={status}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="capitalize text-text-primary font-medium">{status}</span>
                  <span className="font-mono text-text-secondary">{count}</span>
                </div>
                <div className="w-full h-2 bg-bg rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      status === 'placed' ? 'bg-amber-400' :
                      status === 'processing' ? 'bg-blue-400' :
                      status === 'shipped' ? 'bg-violet-400' :
                      status === 'delivered' ? 'bg-emerald-400' :
                      'bg-red-400'
                    }`}
                    style={{ width: `${(count / maxStatusCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-7 gap-6">
        <div className="lg:col-span-4 bg-surface rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-sm text-text-primary">Recent Activity</h2>
          </div>
          <div className="divide-y divide-border/50">
            {recentActivity.length > 0 ? recentActivity.map((a) => (
              <div key={`${a.type}-${a.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-bg/40 transition-colors">
                <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                  a.type === 'order' ? 'bg-blue-500/10 text-blue-500' :
                  a.type === 'booking' ? 'bg-violet-500/10 text-violet-500' :
                  'bg-rose-500/10 text-rose-500'
                }`}>
                  {a.type === 'order' ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  ) : a.type === 'booking' ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary truncate">
                    {a.type === 'order' && <><span className="font-medium">{a.name}</span> <span className="text-text-secondary">placed order</span> <span className="font-mono text-xs">{a.ref}</span></>}
                    {a.type === 'booking' && <><span className="font-medium">{a.name}</span> <span className="text-text-secondary">booked</span> <span className="text-xs text-text-secondary">{a.device}</span></>}
                    {a.type === 'message' && <><span className="font-medium">{a.name}</span> <span className="text-text-secondary">sent a message</span></>}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusStamp status={a.status || 'message'} />
                    <span className="text-[10px] text-text-secondary">{new Date(a.date).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                {a.type === 'order' && <span className="text-sm font-mono font-medium text-text-primary shrink-0">৳{(a.amount || 0).toLocaleString()}</span>}
              </div>
            )) : <p className="text-sm text-text-secondary text-center py-10">No recent activity.</p>}
          </div>
        </div>

        <div className="lg:col-span-3 bg-surface rounded-xl border border-border shadow-sm p-5">
          <h2 className="font-semibold text-sm text-text-primary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/admin/products" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 hover:border-blue-500/20 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              <span className="text-xs font-medium text-text-primary">Products</span>
            </Link>
            <Link to="/admin/orders" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <span className="text-xs font-medium text-text-primary">Orders</span>
            </Link>
            <Link to="/admin/customers" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-sky-500/5 border border-sky-500/10 hover:bg-sky-500/10 hover:border-sky-500/20 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              </div>
              <span className="text-xs font-medium text-text-primary">Add User</span>
            </Link>
            <Link to="/admin/messages" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <span className="text-xs font-medium text-text-primary">Messages</span>
            </Link>
          </div>
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-accent/5 to-violet-500/5 border border-accent/10">
            <p className="text-xs font-semibold text-text-primary mb-1">Need help?</p>
            <p className="text-[11px] text-text-secondary leading-relaxed">Check the repair bookings or contact support for assistance with orders.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalForm({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-display text-lg font-bold text-text-primary">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-bg dark:hover:bg-surface/80 text-text-secondary hover:text-text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function AdminProducts() {
  const { confirm } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProducts({ page, limit: 20 });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', category: '', brand: '', price: '', discountPrice: '', stock: '', condition: 'new', description: '', imageUrl: '' });
  const { data: catData } = useCategories('product');

  const saveMutation = useMutation({
    mutationFn: (data) => editing ? api.put(`/products/${editing}`, data) : api.post('/products', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['products'] }); setShowForm(false); setEditing(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/products/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const featureMutation = useMutation({
    mutationFn: ({ id, isFeatured }) => api.put(`/products/${id}`, { isFeatured }),
    onMutate: async ({ id, isFeatured }) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const snapshot = queryClient.getQueriesData({ queryKey: ['products'] });
      snapshot.forEach(([key]) => {
        queryClient.setQueryData(key, (old) => {
          if (!old?.products) return old;
          return { ...old, products: old.products.map((p) => (p._id === id ? { ...p, isFeatured } : p)) };
        });
      });
      return { snapshot };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot) ctx.snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const openEdit = (product) => {
    setEditing(product._id);
    setForm({
      name: product.name, slug: product.slug, category: product.category?._id || '',
      brand: product.brand || '', price: product.price, discountPrice: product.discountPrice || '',
      stock: product.stock, condition: product.condition, description: product.description || '',
      imageUrl: product.images?.[0] || '',
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const images = form.imageUrl ? [form.imageUrl] : [];
    saveMutation.mutate({ ...form, images, price: Number(form.price), discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined, stock: Number(form.stock) });
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Products</h1>
          <p className="text-sm text-text-secondary mt-0.5">Manage your product catalog.</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ name: '', slug: '', category: '', brand: '', price: '', discountPrice: '', stock: '', condition: 'new', description: '', imageUrl: '' }); setShowForm(true); }} className="btn-primary text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Product
        </button>
      </div>

      {showForm && (
        <ModalForm title={editing ? 'Edit Product' : 'New Product'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Slug</label>
                <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50">
                  <option value="">Select</option>
                  {catData?.categories?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Brand</label>
                <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Price (৳)</label>
                <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Discount (৳)</label>
                <input type="number" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Stock</label>
                <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Condition</label>
                <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50">
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1.5">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1.5">Image URL</label>
              <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://example.com/product.jpg" className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              {form.imageUrl && (
                <img src={form.imageUrl} alt="" className="mt-2 w-16 h-16 object-cover rounded-lg border border-border" onError={(e) => { e.target.style.display = 'none' }} />
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary text-sm">{saveMutation.isPending ? 'Saving...' : 'Save Product'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </form>
        </ModalForm>
      )}

      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg/80">
                <th className="text-left px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Image</th>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-right px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Price</th>
                <th className="text-right px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Stock</th>
                <th className="text-center px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider hidden md:table-cell">Featured</th>
                <th className="text-center px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider hidden md:table-cell">Condition</th>
                <th className="text-right px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.products?.map((p, i) => (
                <tr key={p._id} className={`border-t border-border/50 hover:bg-bg/30 transition-colors ${i % 2 === 0 ? 'bg-surface' : 'bg-bg/20'}`}>
                  <td className="px-4 py-3">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt="" className="w-10 h-10 object-cover dark:ring-1 dark:ring-white/10 dark:bg-surface rounded-lg" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-bg dark:bg-surface dark:ring-1 dark:ring-white/10 flex items-center justify-center"><span className="text-xs text-text-secondary">—</span></div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-text-primary">{p.name}</td>
                  <td className="px-4 py-3 text-text-secondary text-xs hidden md:table-cell">{p.category?.name || '—'}</td>
                  <td className="px-4 py-3 text-right font-mono">৳{p.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right"><span className={`${p.stock > 0 ? 'text-mint-confirm' : 'text-red-500'} font-mono text-xs`}>{p.stock}</span></td>
                  <td className="px-4 py-3 text-center hidden md:table-cell">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!p.isFeatured}
                        onChange={(e) => featureMutation.mutate({ id: p._id, isFeatured: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="relative w-9 h-5 bg-text-secondary/30 peer-checked:bg-repair-amber rounded-full after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </td>
                  <td className="px-4 py-3 text-center hidden md:table-cell"><span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${p.condition === 'new' ? 'bg-mint-confirm/10 text-mint-confirm' : p.condition === 'used' ? 'bg-repair-amber/10 text-repair-amber' : 'bg-accent/10 text-accent'}`}>{p.condition}</span></td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(p)} className="text-accent text-xs font-medium hover:underline mr-3">Edit</button>
                    <button onClick={async () => { if (await confirm('Delete this product?')) deleteMutation.mutate(p._id); }} className="text-red-500 text-xs font-medium hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data?.pagination?.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg text-xs font-mono transition-all ${page === p ? 'bg-accent text-white shadow-sm' : 'border border-border text-text-secondary hover:border-accent'}`}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminCategories() {
  const { confirm } = useToast();
  const queryClient = useQueryClient();
  const { data } = useCategories();
  const [form, setForm] = useState({ name: '', slug: '', type: 'product', icon: '' });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const saveMutation = useMutation({
    mutationFn: (data) => editing ? api.put(`/categories/${editing}`, data) : api.post('/categories', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); setShowForm(false); setEditing(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/categories/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Categories</h1>
          <p className="text-sm text-text-secondary mt-0.5">Organize your products and services.</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ name: '', slug: '', type: 'product', icon: '' }); setShowForm(true); }} className="btn-primary text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Category
        </button>
      </div>

      {showForm && (
        <ModalForm title={editing ? 'Edit Category' : 'New Category'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Slug</label>
                <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50">
                  <option value="product">Product</option>
                  <option value="repair">Repair</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Icon (emoji)</label>
                <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary text-sm">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </form>
        </ModalForm>
      )}

      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg/80">
                <th className="text-left px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Icon</th>
                <th className="text-right px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.categories?.map((c, i) => (
                <tr key={c._id} className={`border-t border-border/50 hover:bg-bg/30 transition-colors ${i % 2 === 0 ? 'bg-surface' : 'bg-bg/20'}`}>
                  <td className="px-4 py-3 font-medium text-text-primary">{c.name}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${c.type === 'product' ? 'bg-accent/10 text-accent' : 'bg-repair-amber/10 text-repair-amber'}`}>{c.type}</span></td>
                  <td className="px-4 py-3 text-lg">{c.icon || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => { setEditing(c._id); setForm({ name: c.name, slug: c.slug, type: c.type, icon: c.icon || '' }); setShowForm(true); }} className="text-accent text-xs font-medium hover:underline mr-3">Edit</button>
                    <button onClick={async () => { if (await confirm('Delete this category?')) deleteMutation.mutate(c._id); }} className="text-red-500 text-xs font-medium hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminOrders() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { data } = useQuery({ queryKey: ['admin-orders', page], queryFn: () => api.get(`/orders/admin?page=${page}&limit=20`).then((r) => r.data) });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/orders/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
  });

  const order = selectedOrder ? data?.orders?.find((o) => o._id === selectedOrder) : null;

  if (order) {
    return (
      <div className="p-6 md:p-8">
        <button onClick={() => setSelectedOrder(null)} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors mb-6">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Orders
        </button>

        <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden max-w-5xl">
          <div className="border-b border-border px-6 py-5">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-display text-xl font-bold text-text-primary">{order.orderNumber}</h1>
                <p className="text-xs text-text-secondary mt-0.5">
                  Placed on {new Date(order.createdAt).toLocaleString('en-BD', { dateStyle: 'full', timeStyle: 'short' })}
                </p>
              </div>
              <StatusStamp status={order.orderStatus} className="text-sm" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-0">
            <div className="md:col-span-2 p-6 border-b md:border-b-0 md:border-r border-border">
              <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">Items Ordered</h2>
              <div className="space-y-4">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-bg dark:bg-surface border border-border overflow-hidden shrink-0 flex items-center justify-center">
                      {item.product?.images?.[0] ? (
                        <img src={item.product.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">{item.name}</p>
                      <p className="text-xs text-text-secondary">Qty: {item.qty} × ৳{item.priceAtPurchase?.toLocaleString()}</p>
                    </div>
                    <span className="text-sm font-mono font-semibold text-text-primary shrink-0">৳{(item.qty * item.priceAtPurchase).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-sm font-semibold text-text-primary">Total</span>
                <span className="font-display text-xl font-bold text-accent">৳{order.total?.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Customer</h2>
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-text-primary">{order.shippingAddress?.name || 'Guest'}</p>
                  {order.user?.email ? (
                    <a href={`mailto:${order.user.email}`} className="flex items-center gap-1.5 text-xs text-accent hover:underline">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      {order.user.email}
                    </a>
                  ) : (
                    <p className="text-xs text-text-secondary">Guest checkout (no email)</p>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Shipping Address</h2>
                <div className="space-y-1 text-sm text-text-primary">
                  {order.shippingAddress?.phone && (
                    <a href={`tel:${order.shippingAddress.phone}`} className="flex items-center gap-1.5 text-accent hover:underline">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      {order.shippingAddress.phone}
                    </a>
                  )}
                  {order.shippingAddress?.address && <p>{order.shippingAddress.address}</p>}
                  {order.shippingAddress?.city && <p className="text-text-secondary">{order.shippingAddress.city}</p>}
                  {order.shippingAddress?.note && (
                    <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-500/5 rounded-lg border border-amber-200/50">
                      <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">Note</p>
                      <p className="text-xs text-amber-600 dark:text-amber-300">{order.shippingAddress.note}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Payment</h2>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Method</span>
                    <span className="font-medium uppercase text-text-primary">{order.paymentMethod}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Status</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      order.paymentStatus === 'paid' ? 'bg-mint-confirm/10 text-mint-confirm' :
                      order.paymentStatus === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                      order.paymentStatus === 'failed' ? 'bg-red-500/10 text-red-500' :
                      'bg-text-secondary/10 text-text-secondary'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Update Status</h2>
                <select
                  value={order.orderStatus}
                  onChange={(e) => {
                    updateMutation.mutate({ id: order._id, data: { orderStatus: e.target.value } });
                    setSelectedOrder(null);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 bg-surface text-text-primary"
                >
                  {['placed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-text-primary">Orders</h1>
        <p className="text-sm text-text-secondary mt-0.5">Manage customer orders and fulfillment.</p>
      </div>
      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg/80">
                <th className="text-left px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Order #</th>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider hidden lg:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider hidden md:table-cell">Items</th>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-right px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Total</th>
                <th className="text-center px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider hidden md:table-cell">Payment</th>
                <th className="text-center px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Status</th>
                <th className="text-center px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Update</th>
              </tr>
            </thead>
            <tbody>
              {data?.orders?.map((o, i) => (
                <tr
                  key={o._id}
                  onClick={() => setSelectedOrder(o._id)}
                  className={`border-t border-border/50 hover:bg-bg/30 transition-colors cursor-pointer ${i % 2 === 0 ? 'bg-surface' : 'bg-bg/20'}`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-text-secondary">{o.orderNumber}</td>
                  <td className="px-4 py-3 font-medium text-text-primary">{o.shippingAddress?.name || 'Guest'}</td>
                  <td className="px-4 py-3 text-xs text-text-secondary hidden lg:table-cell">{o.user?.email || '—'}</td>
                  <td className="px-4 py-3 text-xs text-text-secondary hidden md:table-cell max-w-[180px] truncate">{o.items?.map((it) => it.name).join(', ') || '—'}</td>
                  <td className="px-4 py-3 text-xs text-text-secondary hidden md:table-cell">{new Date(o.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' })}</td>
                  <td className="px-4 py-3 text-right font-mono">৳{o.total.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center hidden md:table-cell"><span className="text-xs font-medium uppercase">{o.paymentMethod}</span></td>
                  <td className="px-4 py-3 text-center"><StatusStamp status={o.orderStatus} /></td>
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={o.orderStatus}
                      onChange={(e) => updateMutation.mutate({ id: o._id, data: { orderStatus: e.target.value } })}
                      className="text-xs border border-border rounded-lg px-3 py-1.5 bg-surface focus:outline-none focus:ring-2 focus:ring-accent/50"
                    >
                      {['placed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {data?.pagination?.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg text-xs font-mono transition-all ${page === p ? 'bg-accent text-white shadow-sm' : 'border border-border text-text-secondary hover:border-accent'}`}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminRepairBookings() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const { data } = useQuery({ queryKey: ['admin-bookings', page], queryFn: () => api.get(`/repair-bookings/admin?page=${page}&limit=20`).then((r) => r.data) });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/repair-bookings/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-bookings'] }),
  });

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-text-primary">Repair Bookings</h1>
        <p className="text-sm text-text-secondary mt-0.5">Track and manage repair service requests.</p>
      </div>
      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg/80">
                <th className="text-left px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Ticket</th>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider hidden md:table-cell">Device</th>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-center px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Status</th>
                <th className="text-center px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Update</th>
              </tr>
            </thead>
            <tbody>
              {data?.bookings?.map((b, i) => (
                <tr key={b._id} className={`border-t border-border/50 hover:bg-bg/30 transition-colors ${i % 2 === 0 ? 'bg-surface' : 'bg-bg/20'}`}>
                  <td className="px-4 py-3 font-mono text-xs text-text-secondary">#{b.ticketNumber}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-text-primary">{b.customer?.name}</p>
                    <p className="text-xs text-text-secondary">{b.customer?.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-xs hidden md:table-cell">{b.deviceType} — {b.deviceModel}</td>
                  <td className="px-4 py-3 text-xs text-text-secondary hidden md:table-cell">{new Date(b.preferredDate).toLocaleDateString('en-BD')}</td>
                  <td className="px-4 py-3 text-center"><StatusStamp status={b.status} /></td>
                  <td className="px-4 py-3 text-center">
                    <select
                      value={b.status}
                      onChange={(e) => updateMutation.mutate({ id: b._id, data: { status: e.target.value } })}
                      className="text-xs border border-border rounded-lg px-3 py-1.5 bg-surface focus:outline-none focus:ring-2 focus:ring-accent/50"
                    >
                      {['pending', 'diagnosed', 'in_repair', 'ready', 'delivered', 'cancelled'].map((s) => (
                        <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminCustomers() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ['admin-customers'], queryFn: () => api.get('/users/admin').then((r) => r.data) });
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', phone: '', role: 'customer' });
  const [confirmDelete, setConfirmDelete] = useState(null);

  const createMutation = useMutation({
    mutationFn: (body) => api.post('/users/admin', body),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-customers'] }); setShowCreate(false); setCreateForm({ name: '', email: '', password: '', phone: '', role: 'customer' }); },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }) => api.put(`/users/admin/${id}`, { role }),
    onMutate: async ({ id, role }) => {
      await queryClient.cancelQueries({ queryKey: ['admin-customers'] });
      const prev = queryClient.getQueryData(['admin-customers']);
      queryClient.setQueryData(['admin-customers'], (old) => {
        if (!old) return old;
        return { ...old, users: old.users.map((u) => u._id === id ? { ...u, role } : u) };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['admin-customers'], ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['admin-customers'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/users/admin/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-customers'] }); setConfirmDelete(null); },
  });

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Customers</h1>
          <p className="text-sm text-text-secondary mt-0.5">Manage registered users — create, promote to admin, or remove.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          Add User
        </button>
      </div>

      {showCreate && (
        <ModalForm title="Create User" onClose={() => setShowCreate(false)}>
          <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(createForm); }} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1.5">Full Name *</label>
              <input required value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 bg-surface text-text-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1.5">Email *</label>
              <input type="email" required value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 bg-surface text-text-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1.5">Password *</label>
              <input type="password" required minLength={6} value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 bg-surface text-text-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Phone</label>
                <input value={createForm.phone} onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 bg-surface text-text-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Role</label>
                <select value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 bg-surface text-text-primary">
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            {createMutation.isError && <p className="text-red-500 text-xs">{createMutation.error?.response?.data?.error || 'Failed to create user'}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary text-sm !py-2">Cancel</button>
              <button type="submit" disabled={createMutation.isPending} className="btn-primary text-sm !py-2">{createMutation.isPending ? 'Creating...' : 'Create User'}</button>
            </div>
          </form>
        </ModalForm>
      )}

      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg/80">
                <th className="text-left px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider hidden md:table-cell">Phone</th>
                <th className="text-center px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Role</th>
                <th className="text-right px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.users?.map((u, i) => (
                <tr key={u._id} className={`border-t border-border/50 hover:bg-bg/30 transition-colors ${i % 2 === 0 ? 'bg-surface' : 'bg-bg/20'}`}>
                  <td className="px-4 py-3 font-medium text-text-primary">{u.name || '—'}</td>
                  <td className="px-4 py-3 text-text-secondary text-xs">{u.email}</td>
                  <td className="px-4 py-3 text-xs text-text-secondary hidden md:table-cell">{u.phone || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => updateRoleMutation.mutate({ id: u._id, role: u.role === 'admin' ? 'customer' : 'admin' })}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer transition-all hover:scale-105 ${u.role === 'admin' ? 'bg-accent/10 text-accent' : 'bg-text-secondary/10 text-text-secondary'}`}
                      title="Click to toggle role"
                    >
                      {u.role}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {confirmDelete === u._id ? (
                        <>
                          <button onClick={() => deleteMutation.mutate(u._id)} className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">Confirm</button>
                          <button onClick={() => setConfirmDelete(null)} className="text-xs text-text-secondary hover:text-text-primary transition-colors">Cancel</button>
                        </>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(u._id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-text-secondary hover:text-red-500 transition-colors"
                          title="Delete user"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {data?.users?.length === 0 && <p className="text-center text-sm text-text-secondary py-12">No users found.</p>}
    </div>
  );
}

function AdminReviews() {
  const { confirm } = useToast();
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ['admin-reviews'], queryFn: () => api.get('/reviews/admin').then((r) => r.data) });

  const approveMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/reviews/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-reviews'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/reviews/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-reviews'] }),
  });

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-text-primary">Reviews</h1>
        <p className="text-sm text-text-secondary mt-0.5">Manage customer reviews and feedback.</p>
      </div>
      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg/80">
                <th className="text-left px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">User</th>
                <th className="text-center px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Rating</th>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Comment</th>
                <th className="text-center px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Approved</th>
                <th className="text-right px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.reviews?.map((r, i) => (
                <tr key={r._id} className={`border-t border-border/50 hover:bg-bg/30 transition-colors ${i % 2 === 0 ? 'bg-surface' : 'bg-bg/20'}`}>
                  <td className="px-4 py-3 text-xs font-medium text-text-primary">{r.user?.name || '—'}</td>
                  <td className="px-4 py-3 text-center text-repair-amber text-sm">{'★'.repeat(r.rating)}</td>
                  <td className="px-4 py-3 text-xs text-text-secondary max-w-xs truncate">{r.comment || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={r.isApproved}
                        onChange={(e) => approveMutation.mutate({ id: r._id, data: { isApproved: e.target.checked } })}
                        className="sr-only peer"
                      />
                      <div className="relative w-9 h-5 bg-text-secondary/30 peer-checked:bg-mint-confirm rounded-full after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={async () => { if (await confirm('Delete this review?')) deleteMutation.mutate(r._id); }} className="text-red-500 text-xs font-medium hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminRepairServices() {
  const { confirm } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-repair-services'],
    queryFn: () => api.get('/repair-services').then((r) => r.data),
  });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', slug: '', deviceType: 'iPhone', category: 'screen',
    description: '', priceMin: '', priceMax: '', estTurnaroundMinutes: 60, isActive: true,
  });

  const deviceTypes = ['Android Phone', 'iPhone', 'iPad', 'MacBook', 'Laptop', 'Apple Watch', 'AirPods', 'Other'];
  const categories = [
    'screen', 'display', 'glass', 'oled', 'lcd',
    'battery', 'charging-port', 'charging-ic', 'wireless-charging', 'power-management',
    'front-camera', 'rear-camera', 'camera-lens',
    'speaker', 'microphone', 'ear-speaker', 'audio-ic',
    'power-button', 'volume-button', 'home-button', 'fingerprint-sensor', 'face-id',
    'wifi', 'bluetooth', 'network', 'sim-card', 'antenna', 'gps',
    'water-damage', 'liquid-damage', 'corrosion', 'deep-cleaning',
    'motherboard', 'ic-soldering', 'pcb', 'chip-level',
    'software', 'os-reinstall', 'virus-removal', 'data-recovery',
    'unlock', 'firmware', 'bios',
    'back-glass', 'housing', 'frame',
    'screen-protector', 'diagnostic', 'data-transfer',
    'fan', 'keyboard', 'trackpad', 'hinge', 'thermal-paste', 'display-hinge',
  ];

  const saveMutation = useMutation({
    mutationFn: (data) => editing ? api.put(`/repair-services/${editing}`, data) : api.post('/repair-services', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-repair-services'] }); setShowForm(false); setEditing(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/repair-services/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-repair-services'] }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate({
      ...form,
      priceMin: Number(form.priceMin),
      priceMax: Number(form.priceMax),
      estTurnaroundMinutes: Number(form.estTurnaroundMinutes),
    });
  };

  const openEdit = (svc) => {
    setEditing(svc._id);
    setForm({
      name: svc.name, slug: svc.slug, deviceType: svc.deviceType, category: svc.category,
      description: svc.description || '', priceMin: svc.priceMin, priceMax: svc.priceMax,
      estTurnaroundMinutes: svc.estTurnaroundMinutes, isActive: svc.isActive,
    });
    setShowForm(true);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Repair Services</h1>
          <p className="text-sm text-text-secondary mt-0.5">Manage the repair services offered to customers.</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ name: '', slug: '', deviceType: 'iPhone', category: 'screen', description: '', priceMin: '', priceMax: '', estTurnaroundMinutes: 60, isActive: true }); setShowForm(true); }} className="btn-primary text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Service
        </button>
      </div>

      {showForm && (
        <ModalForm title={editing ? 'Edit Service' : 'New Service'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Slug</label>
                <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Device Type</label>
                <select value={form.deviceType} onChange={(e) => setForm({ ...form, deviceType: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50">
                  {deviceTypes.map((dt) => <option key={dt} value={dt}>{dt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50">
                  {categories.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1.5">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Min Price (৳)</label>
                <input type="number" required value={form.priceMin} onChange={(e) => setForm({ ...form, priceMin: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Max Price (৳)</label>
                <input type="number" required value={form.priceMax} onChange={(e) => setForm({ ...form, priceMax: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Turnaround (min)</label>
                <input type="number" value={form.estTurnaroundMinutes} onChange={(e) => setForm({ ...form, estTurnaroundMinutes: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="text-accent rounded" />
              <span className="font-medium text-text-primary">Active</span>
            </label>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saveMutation.isPending} className="btn-primary text-sm">{saveMutation.isPending ? 'Saving...' : 'Save Service'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </form>
        </ModalForm>
      )}

      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg/80">
                <th className="text-left px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider hidden md:table-cell">Device</th>
                <th className="text-left px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-right px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Price Range</th>
                <th className="text-center px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider hidden md:table-cell">Turnaround</th>
                <th className="text-center px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Active</th>
                <th className="text-right px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.services?.map((svc, i) => (
                <tr key={svc._id} className={`border-t border-border/50 hover:bg-bg/30 transition-colors ${i % 2 === 0 ? 'bg-surface' : 'bg-bg/20'}`}>
                  <td className="px-4 py-3 font-medium text-text-primary">{svc.name}</td>
                  <td className="px-4 py-3 text-xs hidden md:table-cell"><span className="bg-accent/5 text-accent px-2 py-0.5 rounded-full text-xs">{svc.deviceType}</span></td>
                  <td className="px-4 py-3 text-xs capitalize hidden md:table-cell">{svc.category}</td>
                  <td className="px-4 py-3 text-right font-mono">৳{svc.priceMin.toLocaleString()} – ৳{svc.priceMax.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-xs text-text-secondary hidden md:table-cell">{svc.estTurnaroundMinutes < 60 ? `${svc.estTurnaroundMinutes}m` : `${Math.floor(svc.estTurnaroundMinutes / 60)}h`}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${svc.isActive ? 'bg-mint-confirm' : 'bg-red-400'}`} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(svc)} className="text-accent text-xs font-medium hover:underline mr-3">Edit</button>
                    <button onClick={async () => { if (await confirm('Delete this repair service?')) deleteMutation.mutate(svc._id); }} className="text-red-500 text-xs font-medium hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && data?.services?.length === 0 && <p className="text-center text-sm text-text-secondary py-12">No repair services found. Add one to get started.</p>}
      </div>
    </div>
  );
}

function AdminMessages() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const { data } = useQuery({ queryKey: ['admin-messages'], queryFn: () => api.get('/contact/admin').then((r) => r.data) });

  const readMutation = useMutation({
    mutationFn: (id) => api.put(`/contact/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-messages'] }),
  });

  const messages = data?.messages || [];
  const selected = messages.find((m) => m._id === selectedId);

  const openMessage = (m) => {
    setSelectedId(m._id);
    setShowDetail(true);
    if (!m.isRead) readMutation.mutate(m._id);
  };

  if (showDetail && selected) {
    return (
      <div className="p-6 md:p-8">
        <button onClick={() => setShowDetail(false)} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors mb-6">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Inbox
        </button>

        <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden max-w-4xl">
          <div className="border-b border-border px-6 py-5">
            <h1 className="font-display text-xl font-bold text-text-primary mb-1">{selected.subject || 'No Subject'}</h1>
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <span className={`inline-block w-2 h-2 rounded-full ${selected.isRead ? 'bg-text-secondary/30' : 'bg-accent'}`} />
              <span>{selected.isRead ? 'Read' : 'New'}</span>
              <span className="text-text-secondary/40">•</span>
              <span>{new Date(selected.createdAt).toLocaleString('en-BD', { dateStyle: 'full', timeStyle: 'short' })}</span>
            </div>
          </div>

          <div className="px-6 py-4 border-b border-border bg-bg/30">
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <span className="text-text-secondary font-medium">From</span>
              <div>
                <span className="font-semibold text-text-primary">{selected.name}</span>
                <span className="text-text-secondary ml-2">&lt;{selected.email}&gt;</span>
              </div>
              {selected.phone && (
                <>
                  <span className="text-text-secondary font-medium">Phone</span>
                  <a href={`tel:${selected.phone}`} className="text-accent hover:underline">{selected.phone}</a>
                </>
              )}
              <span className="text-text-secondary font-medium">Subject</span>
              <span className="text-text-primary">{selected.subject || '—'}</span>
              <span className="text-text-secondary font-medium">Date</span>
              <span className="text-text-primary">{new Date(selected.createdAt).toLocaleString('en-BD', { dateStyle: 'full', timeStyle: 'medium' })}</span>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="prose prose-sm max-w-none text-text-primary leading-relaxed whitespace-pre-wrap">
              {selected.message}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-border bg-bg/30 flex items-center gap-3">
            <a
              href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message'}`}
              className="btn-primary text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Reply via Email
            </a>
            {selected.phone && (
              <a href={`tel:${selected.phone}`} className="btn-secondary text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Call {selected.phone}
              </a>
            )}
            <a
              href={`https://wa.me/${selected.phone?.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm ml-auto"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-text-primary">Messages</h1>
        <p className="text-sm text-text-secondary mt-0.5">Contact form submissions from visitors.</p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border p-12 text-center">
          <svg className="w-8 h-8 text-text-secondary mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          <p className="text-sm text-text-secondary">No messages yet.</p>
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="divide-y divide-border/60">
            {messages.map((m) => (
              <button
                key={m._id}
                onClick={() => openMessage(m)}
                className={`w-full text-left px-5 py-4 transition-colors hover:bg-bg/50 ${!m.isRead ? 'bg-accent/[0.02]' : ''} ${selectedId === m._id ? 'bg-accent/5' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0 mt-0.5">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${!m.isRead ? 'bg-accent text-white' : 'bg-bg text-text-secondary'}`}>
                      {m.name ? m.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    {!m.isRead && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full border-2 border-surface" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-0.5">
                      <span className={`text-sm truncate ${!m.isRead ? 'font-bold text-text-primary' : 'font-medium text-text-primary'}`}>
                        {m.name}
                      </span>
                      <span className="text-xs text-text-secondary shrink-0 font-mono">
                        {new Date(m.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className={`text-xs truncate mb-1 ${!m.isRead ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>
                      {m.subject || 'No Subject'}
                    </p>
                    <p className="text-xs text-text-secondary truncate">
                      {m.message}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AdminHeroSlides() {
  const { confirm } = useToast();
  const { data } = useAdminHeroSlides();
  const slides = data?.slides || [];

  const createMutation = useCreateHeroSlide();
  const updateMutation = useUpdateHeroSlide();
  const deleteMutation = useDeleteHeroSlide();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    titleLine1: '', titleLine2: '', accent: '', accentColor: 'text-accent',
    badge: '', description: '', primaryText: '', primaryHref: '/repair-services',
    secondaryText: '', secondaryHref: '/shop', image: '',
    gradient: 'from-[#0B1121] via-[#0F1629] to-[#1A1B3A]', glow: 'from-accent',
  });

  const colorOptions = [
    { value: 'text-accent', label: 'Indigo', preview: 'bg-accent' },
    { value: 'text-repair-amber', label: 'Amber', preview: 'bg-repair-amber' },
    { value: 'text-mint-confirm', label: 'Mint', preview: 'bg-mint-confirm' },
  ];

  const glowOptions = [
    { value: 'from-accent', label: 'Indigo', preview: 'bg-accent' },
    { value: 'from-repair-amber', label: 'Amber', preview: 'bg-repair-amber' },
    { value: 'from-mint-confirm', label: 'Mint', preview: 'bg-mint-confirm' },
  ];

  const gradientOptions = [
    { value: 'from-[#0B1121] via-[#0F1629] to-[#1A1B3A]', label: 'Dark Blue' },
    { value: 'from-[#0B1121] via-[#1A1B3A] to-[#2D1B00]', label: 'Dark Amber' },
    { value: 'from-[#0B1121] via-[#0F1A1A] to-[#0A1F1A]', label: 'Dark Mint' },
    { value: 'from-[#0B1121] via-[#0F1629] to-[#3B0764]', label: 'Dark Purple' },
  ];

  const openAdd = () => {
    setEditing(null);
    setForm({
      titleLine1: '', titleLine2: '', accent: '', accentColor: 'text-accent',
      badge: '', description: '', primaryText: '', primaryHref: '/repair-services',
      secondaryText: '', secondaryHref: '/shop', image: '',
      gradient: 'from-[#0B1121] via-[#0F1629] to-[#1A1B3A]', glow: 'from-accent',
    });
    setShowForm(true);
  };

  const openEdit = (slide) => {
    setEditing(slide._id);
    setForm({
      titleLine1: slide.titleLine1 || '',
      titleLine2: slide.titleLine2 || '',
      accent: slide.accent || '',
      accentColor: slide.accentColor || 'text-accent',
      badge: slide.badge || '',
      description: slide.description || '',
      primaryText: slide.primaryText || '',
      primaryHref: slide.primaryHref || '/repair-services',
      secondaryText: slide.secondaryText || '',
      secondaryHref: slide.secondaryHref || '/shop',
      image: slide.image || '',
      gradient: slide.gradient || 'from-[#0B1121] via-[#0F1629] to-[#1A1B3A]',
      glow: slide.glow || 'from-accent',
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ id: editing, data: form });
    } else {
      createMutation.mutate(form);
    }
    setShowForm(false);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const ids = slides.map((s) => s._id);
    [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]];
  };

  const moveDown = (index) => {
    if (index === slides.length - 1) return;
    const ids = slides.map((s) => s._id);
    [ids[index], ids[index + 1]] = [ids[index + 1], ids[index]];
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Hero Slides</h1>
          <p className="text-sm text-text-secondary mt-0.5">Manage the homepage hero carousel slides.</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Slide
        </button>
      </div>

      {slides.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border p-12 text-center">
          <svg className="w-8 h-8 text-text-secondary mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <p className="text-sm text-text-secondary">No hero slides yet. Add your first slide!</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {slides.map((slide, i) => (
            <div key={slide._id} className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-56 h-36 shrink-0 bg-bg relative overflow-hidden">
                  {slide.image ? (
                    <img src={slide.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-secondary text-xs">No image</div>
                  )}
                  <div className={`absolute inset-0 ${slide.isActive ? 'opacity-0' : 'bg-black/50 flex items-center justify-center'}`}>
                    {!slide.isActive && <span className="text-white text-xs font-semibold px-2 py-1 bg-black/60 rounded">Inactive</span>}
                  </div>
                </div>
                <div className="flex-1 p-5 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${slide.isActive ? 'bg-mint-confirm' : 'bg-text-secondary/30'}`} />
                        <span className="text-xs font-mono text-text-secondary">#{slide.order + 1}</span>
                        {slide.badge && <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bg text-text-secondary truncate">{slide.badge}</span>}
                      </div>
                      <h3 className="font-display text-base font-bold text-text-primary truncate">
                        {slide.titleLine1 || 'Untitled'}
                      </h3>
                      <p className="text-xs text-text-secondary line-clamp-2 mt-0.5">{slide.description || '—'}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => moveUp(i)} disabled={i === 0} className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                      </button>
                      <button onClick={() => moveDown(i)} disabled={i === slides.length - 1} className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      <div className="w-px h-6 bg-border mx-1" />
                      <button onClick={() => openEdit(slide)} className="p-1.5 rounded-lg text-text-secondary hover:text-accent hover:bg-bg transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button
                        onClick={async () => { if (await confirm('Delete this slide?')) deleteMutation.mutate(slide._id); }}
                        className="p-1.5 rounded-lg text-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-10 pb-10 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="bg-surface rounded-2xl border border-border shadow-2xl w-full max-w-2xl mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-display text-lg font-bold text-text-primary">{editing ? 'Edit Slide' : 'Add Slide'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Badge Text</label>
                  <input type="text" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Free diagnostic • 15 min avg." className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Title Line 1 *</label>
                  <input type="text" value={form.titleLine1} onChange={(e) => setForm({ ...form, titleLine1: e.target.value })} required placeholder="Your Apple Device" className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Title Line 2</label>
                  <input type="text" value={form.titleLine2} onChange={(e) => setForm({ ...form, titleLine2: e.target.value })} placeholder="Deserves Expert Care" className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Accent Text</label>
                  <input type="text" value={form.accent} onChange={(e) => setForm({ ...form, accent: e.target.value })} placeholder="Deserves Expert Care" className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Accent Color</label>
                  <select value={form.accentColor} onChange={(e) => setForm({ ...form, accentColor: e.target.value })} className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none">
                    {colorOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Describe the slide content..." className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Primary Button Text</label>
                  <input type="text" value={form.primaryText} onChange={(e) => setForm({ ...form, primaryText: e.target.value })} placeholder="Book a Repair" className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Primary Button Link</label>
                  <input type="text" value={form.primaryHref} onChange={(e) => setForm({ ...form, primaryHref: e.target.value })} placeholder="/repair-services" className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Secondary Button Text</label>
                  <input type="text" value={form.secondaryText} onChange={(e) => setForm({ ...form, secondaryText: e.target.value })} placeholder="Shop Accessories" className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Secondary Button Link</label>
                  <input type="text" value={form.secondaryHref} onChange={(e) => setForm({ ...form, secondaryHref: e.target.value })} placeholder="/shop" className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Image URL</label>
                  <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://images.unsplash.com/photo-..." className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none" />
                  {form.image && (
                    <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden bg-bg border border-border">
                      <img src={form.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Gradient</label>
                  <select value={form.gradient} onChange={(e) => setForm({ ...form, gradient: e.target.value })} className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none">
                    {gradientOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Glow Color</label>
                  <select value={form.glow} onChange={(e) => setForm({ ...form, glow: e.target.value })} className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none">
                    {glowOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-border">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
                <button type="submit" className="btn-primary text-sm" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editing ? 'Update Slide' : 'Create Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminAboutInfo() {
  const queryClient = useQueryClient();
  const { data } = useAboutInfo();
  const defaultData = {
    heroTitle: "Pabna's Most Trusted Apple Device Service Center",
    heroDescription: "We're a team of passionate technicians, retailers, and customer service professionals dedicated to keeping Apple devices running at their best.",
    stats: [
      { value: '5+', label: 'Years Experience' },
      { value: '2,000+', label: 'Devices Repaired' },
      { value: '98%', label: 'Customer Satisfaction' },
      { value: '90-Day', label: 'Warranty on All Repairs' },
    ],
    missionTitle: 'Our Mission',
    missionDescription: "To provide fast, reliable, and affordable Apple device service with the transparency and precision of a professional workshop — right here in Pabna.",
    values: [
      { title: 'Quality Parts', desc: 'We use genuine or high-grade replacement parts sourced from trusted suppliers.', icon: '🛡️' },
      { title: 'Certified Technicians', desc: 'Every repair is performed by trained professionals with years of hands-on experience.', icon: '🔧' },
      { title: 'Transparent Pricing', desc: 'You get a detailed quote before any work begins. No hidden fees, no surprises.', icon: '💰' },
      { title: 'Fast Service', desc: 'Most repairs completed within 24 hours. Same-day service available for common issues.', icon: '⚡' },
    ],
    timeline: [
      { year: '2019', event: 'ASSZ founded in Pabna with a single repair bench' },
      { year: '2020', event: 'Expanded to accessories retail; launched online presence' },
      { year: '2021', event: 'Became authorized service partner for major brands' },
      { year: '2023', event: 'Opened second location; 2,000+ devices served' },
      { year: '2025', event: 'Launched full e-commerce platform with nationwide delivery' },
    ],
    team: [
      { name: 'Mahir Ahmed Ehsan', role: 'Founder & Lead Technician', initials: 'ME' },
      { name: 'Fatima Akter', role: 'Customer Relations Manager', initials: 'FA' },
      { name: 'Rakib Hasan', role: 'Senior Repair Technician', initials: 'RH' },
      { name: 'Nusrat Jahan', role: 'Sales & Inventory Lead', initials: 'NJ' },
    ],
    ctaTitle: 'Ready to Get Started?',
    ctaDescription: 'Book a repair, shop accessories, or just stop by for a free diagnostic.',
    ctaPrimaryLabel: 'Book a Repair',
    ctaPrimaryLink: '/repair-services',
    ctaSecondaryLabel: 'Visit Our Store',
    ctaSecondaryLink: '/contact',
  };
  const [form, setForm] = useState(defaultData);
  const [activeTab, setActiveTab] = useState('hero');

  const saveMutation = useMutation({
    mutationFn: (data) => api.put('/about-info', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aboutInfo'] });
    },
  });

  useEffect(() => {
    if (data?.aboutInfo) {
      const c = data.aboutInfo;
      setForm({
        heroTitle: c.heroTitle || defaultData.heroTitle,
        heroDescription: c.heroDescription || defaultData.heroDescription,
        stats: c.stats?.length ? c.stats : defaultData.stats,
        missionTitle: c.missionTitle || defaultData.missionTitle,
        missionDescription: c.missionDescription || defaultData.missionDescription,
        values: c.values?.length ? c.values : defaultData.values,
        timeline: c.timeline?.length ? c.timeline : defaultData.timeline,
        team: c.team?.length ? c.team : defaultData.team,
        ctaTitle: c.ctaTitle || defaultData.ctaTitle,
        ctaDescription: c.ctaDescription || defaultData.ctaDescription,
        ctaPrimaryLabel: c.ctaPrimaryLabel || defaultData.ctaPrimaryLabel,
        ctaPrimaryLink: c.ctaPrimaryLink || defaultData.ctaPrimaryLink,
        ctaSecondaryLabel: c.ctaSecondaryLabel || defaultData.ctaSecondaryLabel,
        ctaSecondaryLink: c.ctaSecondaryLink || defaultData.ctaSecondaryLink,
      });
    }
  }, [data]);

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const updateArrayItem = (key, idx, field, value) => {
    setForm((prev) => {
      const arr = prev[key].map((item, i) => i === idx ? { ...item, [field]: value } : item);
      return { ...prev, [key]: arr };
    });
  };

  const addArrayItem = (key, template) => {
    setForm((prev) => ({ ...prev, [key]: [...prev[key], { ...template }] }));
  };

  const removeArrayItem = (key, idx) => {
    setForm((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate({
      heroTitle: form.heroTitle,
      heroDescription: form.heroDescription,
      stats: form.stats,
      missionTitle: form.missionTitle,
      missionDescription: form.missionDescription,
      values: form.values,
      timeline: form.timeline,
      team: form.team,
      ctaTitle: form.ctaTitle,
      ctaDescription: form.ctaDescription,
      ctaPrimaryLabel: form.ctaPrimaryLabel,
      ctaPrimaryLink: form.ctaPrimaryLink,
      ctaSecondaryLabel: form.ctaSecondaryLabel,
      ctaSecondaryLink: form.ctaSecondaryLink,
    });
  };

  const tabs = [
    { key: 'hero', label: 'Hero' },
    { key: 'stats', label: 'Stats' },
    { key: 'mission', label: 'Mission & Values' },
    { key: 'timeline', label: 'Timeline' },
    { key: 'team', label: 'Team' },
    { key: 'cta', label: 'CTA' },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-text-primary">About Page</h1>
        <p className="text-sm text-text-secondary mt-0.5">Manage all content on the About page.</p>
      </div>

      <div className="flex gap-1 mb-6 flex-wrap">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.key ? 'bg-accent text-white' : 'bg-surface text-text-secondary border border-border hover:border-accent'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-surface rounded-xl border border-border shadow-sm max-w-2xl">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {activeTab === 'hero' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Hero Title</label>
                <textarea value={form.heroTitle} onChange={(e) => updateField('heroTitle', e.target.value)} rows={3} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
                <p className="text-xs text-text-secondary mt-1">Use &lt;br /&gt; for line breaks.</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Hero Description</label>
                <textarea value={form.heroDescription} onChange={(e) => updateField('heroDescription', e.target.value)} rows={3} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-3">
              <p className="text-xs text-text-secondary">Stats shown in the hero stats row.</p>
              {form.stats.map((s, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-bg/40">
                  <input value={s.value} onChange={(e) => updateArrayItem('stats', idx, 'value', e.target.value)} placeholder="5+" className="w-24 px-3 py-1.5 rounded-lg border border-border text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-accent/50" />
                  <input value={s.label} onChange={(e) => updateArrayItem('stats', idx, 'label', e.target.value)} placeholder="Years Experience" className="flex-1 px-3 py-1.5 rounded-lg border border-border text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-accent/50" />
                  <button type="button" onClick={() => removeArrayItem('stats', idx)} className="text-red-500 hover:text-red-700 p-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('stats', { value: '', label: '' })} className="text-xs text-accent font-medium hover:underline">+ Add Stat</button>
            </div>
          )}

          {activeTab === 'mission' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Mission Title</label>
                <input value={form.missionTitle} onChange={(e) => updateField('missionTitle', e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Mission Description</label>
                <textarea value={form.missionDescription} onChange={(e) => updateField('missionDescription', e.target.value)} rows={3} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-semibold text-text-primary mb-3">Values / Features</h4>
                {form.values.map((v, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-bg/40 mb-2">
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <input value={v.title} onChange={(e) => updateArrayItem('values', idx, 'title', e.target.value)} placeholder="Title" className="flex-1 px-3 py-1.5 rounded-lg border border-border text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-accent/50" />
                        <input value={v.icon} onChange={(e) => updateArrayItem('values', idx, 'icon', e.target.value)} placeholder="🛡️" className="w-16 px-3 py-1.5 rounded-lg border border-border text-sm bg-surface text-center focus:outline-none focus:ring-2 focus:ring-accent/50" />
                      </div>
                      <textarea value={v.desc} onChange={(e) => updateArrayItem('values', idx, 'desc', e.target.value)} placeholder="Description" rows={2} className="w-full px-3 py-1.5 rounded-lg border border-border text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-accent/50" />
                    </div>
                    <button type="button" onClick={() => removeArrayItem('values', idx)} className="text-red-500 hover:text-red-700 p-1 mt-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('values', { title: '', desc: '', icon: '' })} className="text-xs text-accent font-medium hover:underline">+ Add Value</button>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-3">
              <p className="text-xs text-text-secondary">Company journey timeline entries.</p>
              {form.timeline.map((t, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-bg/40">
                  <input value={t.year} onChange={(e) => updateArrayItem('timeline', idx, 'year', e.target.value)} placeholder="2019" className="w-20 px-3 py-1.5 rounded-lg border border-border text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-accent/50" />
                  <input value={t.event} onChange={(e) => updateArrayItem('timeline', idx, 'event', e.target.value)} placeholder="Event description" className="flex-1 px-3 py-1.5 rounded-lg border border-border text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-accent/50" />
                  <button type="button" onClick={() => removeArrayItem('timeline', idx)} className="text-red-500 hover:text-red-700 p-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('timeline', { year: '', event: '' })} className="text-xs text-accent font-medium hover:underline">+ Add Timeline Entry</button>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-3">
              <p className="text-xs text-text-secondary">Team member profiles.</p>
              {form.team.map((t, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-bg/40">
                  <input value={t.name} onChange={(e) => updateArrayItem('team', idx, 'name', e.target.value)} placeholder="Name" className="flex-1 px-3 py-1.5 rounded-lg border border-border text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-accent/50" />
                  <input value={t.role} onChange={(e) => updateArrayItem('team', idx, 'role', e.target.value)} placeholder="Role" className="flex-1 px-3 py-1.5 rounded-lg border border-border text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-accent/50" />
                  <input value={t.initials} onChange={(e) => updateArrayItem('team', idx, 'initials', e.target.value)} placeholder="ME" className="w-16 px-3 py-1.5 rounded-lg border border-border text-sm bg-surface text-center focus:outline-none focus:ring-2 focus:ring-accent/50" />
                  <button type="button" onClick={() => removeArrayItem('team', idx)} className="text-red-500 hover:text-red-700 p-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('team', { name: '', role: '', initials: '' })} className="text-xs text-accent font-medium hover:underline">+ Add Team Member</button>
            </div>
          )}

          {activeTab === 'cta' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">CTA Title</label>
                <input value={form.ctaTitle} onChange={(e) => updateField('ctaTitle', e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">CTA Description</label>
                <textarea value={form.ctaDescription} onChange={(e) => updateField('ctaDescription', e.target.value)} rows={2} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-primary mb-1.5">Primary Button Label</label>
                  <input value={form.ctaPrimaryLabel} onChange={(e) => updateField('ctaPrimaryLabel', e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-primary mb-1.5">Primary Button Link</label>
                  <input value={form.ctaPrimaryLink} onChange={(e) => updateField('ctaPrimaryLink', e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-primary mb-1.5">Secondary Button Label</label>
                  <input value={form.ctaSecondaryLabel} onChange={(e) => updateField('ctaSecondaryLabel', e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-primary mb-1.5">Secondary Button Link</label>
                  <input value={form.ctaSecondaryLink} onChange={(e) => updateField('ctaSecondaryLink', e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2 border-t border-border">
            <button type="submit" className="btn-primary text-sm" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const defaultDays = [
  { day: 'Saturday', isOpen: true, hours: '10:00 AM – 8:00 PM' },
  { day: 'Sunday', isOpen: true, hours: '10:00 AM – 8:00 PM' },
  { day: 'Monday', isOpen: true, hours: '10:00 AM – 8:00 PM' },
  { day: 'Tuesday', isOpen: true, hours: '10:00 AM – 8:00 PM' },
  { day: 'Wednesday', isOpen: true, hours: '10:00 AM – 8:00 PM' },
  { day: 'Thursday', isOpen: true, hours: '10:00 AM – 8:00 PM' },
  { day: 'Friday', isOpen: false, hours: 'Closed' },
];

function AdminContactInfo() {
  const queryClient = useQueryClient();
  const { data } = useContactInfo();
  const [form, setForm] = useState({ address: '', phone: '', email: '', whatsapp: '', mapLink: '', days: defaultDays });

  const saveMutation = useMutation({
    mutationFn: (data) => api.put('/contact-info', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactInfo'] });
    },
  });

  useEffect(() => {
    if (data?.contactInfo) {
      const c = data.contactInfo;
      setForm({
        address: c.address || '',
        phone: c.phone || '',
        email: c.email || '',
        whatsapp: c.whatsapp || '',
        mapLink: c.mapLink || '',
        days: c.days?.length ? c.days : defaultDays,
      });
    }
  }, [data]);

  const toggleDay = (idx) => {
    setForm((prev) => {
      const days = prev.days.map((d, i) => i === idx ? { ...d, isOpen: !d.isOpen } : d);
      return { ...prev, days };
    });
  };

  const updateDayHours = (idx, hours) => {
    setForm((prev) => {
      const days = prev.days.map((d, i) => i === idx ? { ...d, hours } : d);
      return { ...prev, days };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-text-primary">Contact Info</h1>
        <p className="text-sm text-text-secondary mt-0.5">Manage the contact details shown on the Contact page.</p>
      </div>

      <div className="bg-surface rounded-xl border border-border shadow-sm max-w-2xl">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-text-primary mb-1.5">Address</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1.5">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1.5">Email</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1.5">WhatsApp Number</label>
              <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="8801700000000" className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1.5">Google Maps Link</label>
              <input value={form.mapLink} onChange={(e) => setForm({ ...form, mapLink: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Business Hours — 7 Days</h3>
            <p className="text-xs text-text-secondary mb-4">Toggle each day open/closed and set custom hours.</p>
            <div className="space-y-2">
              {form.days.map((d, idx) => (
                <div key={d.day} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-bg/40">
                  <span className="w-28 text-sm font-medium text-text-primary shrink-0">{d.day}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={d.isOpen} onChange={() => toggleDay(idx)} className="sr-only peer" />
                    <div className="w-9 h-5 bg-text-secondary/30 rounded-full peer-checked:bg-mint-confirm after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                  </label>
                  <span className={`text-xs font-medium w-12 ${d.isOpen ? 'text-mint-confirm' : 'text-red-500'}`}>{d.isOpen ? 'Open' : 'Closed'}</span>
                  {d.isOpen && (
                    <input value={d.hours} onChange={(e) => updateDayHours(idx, e.target.value)} placeholder="10:00 AM – 8:00 PM" className="flex-1 px-3 py-1.5 rounded-lg border border-border text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-accent/50" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary text-sm" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Admin() {
  const location = useLocation();
  const { user } = useAuth();
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/users/me').then((r) => r.data),
    enabled: !!user,
    retry: 1,
  });
  const dbUser = profile?.user || user?.dbUser;
  const isAdmin = dbUser?.role === 'admin';

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="bg-surface rounded-xl border border-border p-12 max-w-md mx-auto shadow-sm">
          <svg className="w-12 h-12 text-text-secondary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          <h1 className="font-display text-2xl font-bold text-text-primary mb-2">Access Denied</h1>
          <p className="text-sm text-text-secondary mb-6">Please sign in to access the admin panel.</p>
          <a href="/login" className="btn-primary text-sm">Sign In</a>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="bg-surface rounded-xl border border-border p-12 max-w-md mx-auto shadow-sm">
          <svg className="w-12 h-12 text-text-secondary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
          <h1 className="font-display text-2xl font-bold text-text-primary mb-2">Access Denied</h1>
          <p className="text-sm text-text-secondary mb-6">You don't have admin permissions.</p>
          <a href="/" className="btn-primary text-sm">Back to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-bg min-h-screen">
        <div className="lg:hidden bg-surface border-b border-border px-4 py-3 flex gap-2 overflow-x-auto">
          {navItems.map((item) => {
            const active = item.end ? location.pathname === item.path : location.pathname.startsWith(item.path);
            return (
              <Link key={item.path} to={item.path} className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${active ? 'bg-accent text-white' : 'text-text-secondary hover:bg-bg dark:hover:bg-surface/80'}`}>
                {item.label}
              </Link>
            );
          })}
        </div>
        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="repair-bookings" element={<AdminRepairBookings />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="repair-services" element={<AdminRepairServices />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="hero-slides" element={<AdminHeroSlides />} />
          <Route path="contact-info" element={<AdminContactInfo />} />
          <Route path="about-info" element={<AdminAboutInfo />} />
        </Routes>
      </div>
    </div>
  );
}
