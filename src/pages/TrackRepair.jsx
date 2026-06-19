import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTrackBooking } from '../hooks/useRepairBooking';
import TicketCard from '../components/TicketCard';
import StatusStamp from '../components/StatusStamp';
import Loader from '../components/Loader';

const STATUS_ORDER = ['pending', 'diagnosed', 'in_repair', 'ready', 'delivered'];

const statusDescriptions = {
  pending: 'We have received your booking and will begin diagnosis shortly.',
  diagnosed: 'Our technician has diagnosed the issue. You will receive a cost estimate.',
  in_repair: 'Your device is currently being repaired by our certified technician.',
  ready: 'Your device is ready for pickup. Visit our store during business hours.',
  delivered: 'Device has been delivered to you. Thank you for choosing ASSZ!',
};

export default function TrackRepair() {
  const { ticketId } = useParams();
  const [phone, setPhone] = useState('');
  const [verified, setVerified] = useState(false);

  const { data, isLoading, error } = useTrackBooking(ticketId, verified ? phone : '');

  const booking = data?.booking;

  const currentIndex = booking ? STATUS_ORDER.indexOf(booking.status) : -1;

  const handleVerify = (e) => {
    e.preventDefault();
    setVerified(true);
  };

  if (error && verified) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="font-display text-3xl font-bold text-text-primary mb-4">Booking Not Found</h1>
        <p className="text-text-secondary">No repair was found with ticket number <strong>{ticketId}</strong>. Please check the number and try again.</p>
      </div>
    );
  }

  if (isLoading) return <Loader />;

  if (!booking) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-text-primary mb-8">Track Your Repair</h1>
        <p className="text-text-secondary mb-6">
          Enter the phone number you used when booking to view your repair status.
        </p>
        <form onSubmit={handleVerify} className="ticket-stub p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Ticket Number</label>
            <p className="font-mono text-lg font-semibold text-accent">{ticketId}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01700000000"
              className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <button type="submit" className="btn-primary w-full">View Status</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-text-primary mb-8">Repair Status</h1>

      <TicketCard ticketNumber={booking.ticketNumber} status={booking.status} className="mb-8">
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <span className="text-text-secondary">Device</span>
            <p className="font-medium">{booking.deviceType} — {booking.deviceModel}</p>
          </div>
          <div>
            <span className="text-text-secondary">Customer</span>
            <p className="font-medium">{booking.customer.name}</p>
            <p className="text-xs text-text-secondary">{booking.customer.phone}</p>
          </div>
          <div>
            <span className="text-text-secondary">Booked for</span>
            <p className="font-medium">{new Date(booking.preferredDate).toLocaleDateString('en-BD')}</p>
            <p className="text-xs text-text-secondary capitalize">{booking.preferredSlot}</p>
          </div>
          <div>
            <span className="text-text-secondary">Estimated Cost</span>
            <p className="price-tag">৳{booking.estimatedCost.toLocaleString()}+</p>
          </div>
        </div>
        {booking.issueDescription && (
          <div className="border-t border-border pt-3 mt-3">
            <span className="text-text-secondary text-sm">Issue:</span>
            <p className="text-sm mt-1">{booking.issueDescription}</p>
          </div>
        )}
      </TicketCard>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-text-secondary/20" />
        <div className="space-y-8 relative">
          {STATUS_ORDER.map((status, i) => {
            const isReached = i <= currentIndex;
            return (
              <div key={status} className="flex gap-4 items-start">
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                  isReached
                    ? status === 'in_repair'
                      ? 'border-repair-amber bg-repair-amber'
                      : status === 'ready' || status === 'delivered'
                        ? 'border-mint-confirm bg-mint-confirm'
                        : 'border-accent bg-accent'
                    : 'border-text-secondary/30 bg-surface'
                }`}>
                  {isReached && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className={`flex-1 ${isReached ? '' : 'opacity-40'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <StatusStamp status={isReached ? status : 'pending'} />
                  </div>
                  <p className="text-sm text-text-secondary">{statusDescriptions[status]}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 ticket-stub p-6 text-center">
        <h2 className="font-display text-xl font-bold text-text-primary mb-2">Have Questions?</h2>
        <p className="text-text-secondary mb-4">Call or WhatsApp us for updates on your repair.</p>
        <div className="flex justify-center gap-4">
          <a href="tel:+8801700000000" className="btn-primary">Call Now</a>
          <a href="https://wa.me/8801700000000" target="_blank" rel="noopener noreferrer" className="btn-secondary">Chat on WhatsApp</a>
        </div>
      </div>
    </div>
  );
}
