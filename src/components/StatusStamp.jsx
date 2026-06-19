const statusStyles = {
  pending: 'bg-text-secondary/10 text-text-secondary',
  diagnosed: 'bg-accent/10 text-accent',
  in_repair: 'bg-repair-amber/10 text-repair-amber',
  ready: 'bg-mint-confirm/10 text-mint-confirm',
  delivered: 'bg-text-primary/10 text-text-primary',
  cancelled: 'bg-red-50 text-red-600',
  placed: 'bg-text-secondary/10 text-text-secondary',
  processing: 'bg-accent/10 text-accent',
  shipped: 'bg-repair-amber/10 text-repair-amber',
  message: 'bg-rose-500/10 text-rose-500',
};

const statusLabels = {
  pending: 'Pending',
  diagnosed: 'Diagnosed',
  in_repair: 'In Repair',
  ready: 'Ready for Pickup',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  placed: 'Placed',
  processing: 'Processing',
  shipped: 'Shipped',
  message: 'Message',
};

export default function StatusStamp({ status, className = '' }) {
  return (
    <span className={`status-stamp ${statusStyles[status] || statusStyles.pending} ${className}`}>
      {statusLabels[status] || status}
    </span>
  );
}
