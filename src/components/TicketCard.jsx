export default function TicketCard({ ticketNumber, status, children, className = '' }) {
  const statusColors = {
    pending: 'status-stamp--pending',
    diagnosed: 'status-stamp--diagnosed',
    in_repair: 'status-stamp--in-repair',
    ready: 'status-stamp--ready',
    delivered: 'status-stamp--delivered',
    cancelled: 'status-stamp--pending',
  };

  const statusLabels = {
    pending: 'Pending',
    diagnosed: 'Diagnosed',
    in_repair: 'In Repair',
    ready: 'Ready for Pickup',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };

  return (
    <div className={`ticket-stub p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        {ticketNumber && (
          <span className="ticket-number">#{ticketNumber}</span>
        )}
        {status && (
          <span className={`status-stamp ${statusColors[status] || 'status-stamp--pending'}`}>
            {statusLabels[status] || status}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
