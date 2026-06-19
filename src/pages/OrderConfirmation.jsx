import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import TicketCard from '../components/TicketCard';
import StatusStamp from '../components/StatusStamp';
import Loader from '../components/Loader';

export default function OrderConfirmation() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get(`/orders/${id}`).then((r) => r.data),
  });

  if (isLoading) return <Loader />;
  if (error) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <p className="text-red-600 font-medium">Order not found.</p>
      <Link to="/account" className="btn-primary mt-6">My Orders</Link>
    </div>
  );

  const order = data.order;

  const steps = [
    { key: 'placed', label: 'Placed', date: order.createdAt },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
  ];
  const currentStepIdx = steps.findIndex((s) => s.key === order.orderStatus);
  const isCancelled = order.orderStatus === 'cancelled';

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <TicketCard className="mb-8">
        <div className="text-center mb-6">
          {isCancelled ? (
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-mint-confirm/10 text-mint-confirm flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
          )}
          <h1 className="font-display text-2xl font-bold text-text-primary">
            {isCancelled ? 'Order Cancelled' : 'Order Confirmed'}
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {order.orderNumber} — {new Date(order.createdAt).toLocaleString('en-BD', { dateStyle: 'full', timeStyle: 'short' })}
          </p>
        </div>

        <div className="border-t border-border pt-6 pb-2">
          <div className="flex items-center justify-between">
            {isCancelled ? (
              <div className="w-full text-center py-4">
                <StatusStamp status="cancelled" className="text-sm" />
                <p className="text-xs text-text-secondary mt-2">This order has been cancelled.</p>
              </div>
            ) : (
              steps.map((step, idx) => {
                const isPast = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div key={step.key} className="flex-1 flex flex-col items-center relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isPast ? 'bg-accent text-white shadow-sm' : 'bg-bg border-2 border-border text-text-secondary'
                    } ${isCurrent ? 'ring-4 ring-accent/20' : ''}`}>
                      {isPast ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <p className={`text-[11px] font-medium mt-1.5 ${isPast ? 'text-accent' : 'text-text-secondary'}`}>{step.label}</p>
                    {step.date && <p className="text-[9px] text-text-secondary mt-0.5">{new Date(step.date).toLocaleDateString('en-BD')}</p>}
                    {idx < steps.length - 1 && (
                      <div className={`absolute top-4 left-[60%] w-[calc(80%)] h-0.5 ${
                        idx < currentStepIdx ? 'bg-accent' : 'bg-border'
                      }`} />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="border-t border-border pt-5 mt-2">
          <h3 className="font-semibold text-xs text-text-secondary uppercase tracking-wider mb-3">Items Ordered</h3>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-bg border border-border overflow-hidden shrink-0 flex items-center justify-center">
                  {item.product?.images?.[0] ? (
                    <img src={item.product.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{item.name || item.product?.name}</p>
                  <p className="text-xs text-text-secondary">Qty: {item.qty} × ৳{item.priceAtPurchase?.toLocaleString()}</p>
                </div>
                <span className="text-sm font-mono font-semibold text-text-primary shrink-0">৳{(item.qty * item.priceAtPurchase).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border mt-5 pt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              <span className="capitalize">{order.paymentMethod}</span>
              <span className="mx-2">•</span>
              <span className={`${order.paymentStatus === 'paid' ? 'text-mint-confirm' : 'text-amber-500'}`}>{order.paymentStatus}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">Total</span>
              <span className="font-display text-xl font-bold text-accent">৳{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {order.shippingAddress && (
          <div className="border-t border-border mt-5 pt-4">
            <h3 className="font-semibold text-xs text-text-secondary uppercase tracking-wider mb-3">Delivery Details</h3>
            <div className="bg-bg/50 rounded-xl p-4 border border-border space-y-1.5 text-sm">
              <p className="font-medium text-text-primary">{order.shippingAddress.name}</p>
              <a href={`tel:${order.shippingAddress.phone}`} className="flex items-center gap-1.5 text-accent hover:underline">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                {order.shippingAddress.phone}
              </a>
              <p className="text-text-secondary">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
              {order.shippingAddress.note && (
                <div className="mt-2 p-2.5 bg-amber-50 dark:bg-amber-500/10 rounded-lg border border-amber-200/50">
                  <p className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-0.5">Note</p>
                  <p className="text-xs text-amber-600 dark:text-amber-300">{order.shippingAddress.note}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </TicketCard>

      <div className="flex gap-3 justify-center">
        <Link to="/shop" className="btn-primary">Continue Shopping</Link>
        <Link to="/account" className="btn-secondary">View All Orders</Link>
      </div>
    </div>
  );
}
