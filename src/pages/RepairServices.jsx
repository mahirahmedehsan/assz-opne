import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRepairServices } from '../hooks/useCategories';
import { useCreateBooking, useCreateGuestBooking } from '../hooks/useRepairBooking';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Loader from '../components/Loader';

const deviceTypes = ['Android Phone', 'iPhone', 'iPad', 'MacBook', 'Laptop', 'Apple Watch', 'AirPods', 'Other'];

const timeSlots = [
  { value: 'morning', label: 'Morning (10AM–12PM)' },
  { value: 'afternoon', label: 'Afternoon (12PM–5PM)' },
  { value: 'evening', label: 'Evening (5PM–8PM)' },
];

export default function RepairServices() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState({});
  const { data, isLoading } = useRepairServices(filter);
  const services = data?.services || [];
  const createBooking = useCreateBooking();
  const createGuestBooking = useCreateGuestBooking();

  const [showBooking, setShowBooking] = useState(false);
  const [form, setForm] = useState({
    deviceType: '',
    deviceModel: '',
    services: [],
    issueDescription: '',
    preferredDate: '',
    preferredSlot: 'morning',
    customer: { name: user?.displayName || '', phone: '', email: user?.email || '' },
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        customer: { ...prev.customer, name: user.displayName || prev.customer.name, email: user.email || prev.customer.email },
      }));
    }
  }, [user]);

  const formatTurnaround = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  };

  const filteredServices = form.deviceType
    ? services.filter((s) => s.deviceType === form.deviceType)
    : services;

  const toggleService = (id) => {
    const current = form.services;
    const updated = current.includes(id) ? current.filter((s) => s !== id) : [...current, id];
    setForm({ ...form, services: updated });
  };

  const selectedServices = services.filter((s) => form.services.includes(s._id));
  const estimatedCost = selectedServices.reduce((sum, s) => sum + s.priceMin, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.deviceType || !form.deviceModel || form.services.length === 0 || !form.customer.name || !form.customer.phone) return;
    setSubmitting(true);
    try {
      const payload = {
        deviceType: form.deviceType,
        deviceModel: form.deviceModel,
        services: form.services,
        issueDescription: form.issueDescription,
        preferredDate: form.preferredDate ? new Date(form.preferredDate) : new Date(),
        preferredSlot: form.preferredSlot,
        customer: form.customer,
      };
      const result = user
        ? await createBooking.mutateAsync(payload)
        : await createGuestBooking.mutateAsync(payload);
      navigate(`/track-repair/${result.booking.ticketNumber}`);
    } catch (err) {
      toast(err.response?.data?.error || 'Booking failed. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div>
      <section className="bg-gradient-to-br from-[#0B1121] via-[#0F1629] to-[#1A1B3A] text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 glass-badge px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-repair-amber animate-pulse" />
              <span className="text-xs font-mono text-white/70 tracking-wider">Free diagnostic • 90-day warranty</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Professional Repair<br />
              <span className="text-accent">Services</span>
            </h1>
            <p className="text-lg text-text-secondary max-w-lg leading-relaxed">
              Screen repairs, battery replacements, software fixes, and more. Fast turnaround with genuine parts.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-text-primary">Our Services</h2>
            <p className="text-sm text-text-secondary mt-1">Select your device type to filter available services.</p>
          </div>
          <button onClick={() => { setShowBooking(true); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }} className="btn-primary mt-4 sm:mt-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Book a Repair
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setFilter({})} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!filter.deviceType && !filter.category ? 'bg-accent text-white shadow-sm' : 'bg-surface border border-border text-text-secondary hover:border-accent hover:text-accent'}`}>All</button>
          {deviceTypes.map((dt) => (
            <button key={dt} onClick={() => setFilter({ ...filter, deviceType: filter.deviceType === dt ? '' : dt })} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter.deviceType === dt ? 'bg-accent text-white shadow-sm' : 'bg-surface border border-border text-text-secondary hover:border-accent hover:text-accent'}`}>{dt}</button>
          ))}
        </div>

        {isLoading ? <Loader /> : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div key={service._id} className="bg-surface rounded-xl border border-border p-5 hover:shadow-lg hover:border-accent/30 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary bg-bg px-2.5 py-1 rounded-full">{service.deviceType}</span>
                  <span className="text-xs font-medium bg-accent/5 text-accent px-2.5 py-1 rounded-full capitalize">{service.category}</span>
                </div>
                <h3 className="font-display font-semibold text-lg text-text-primary mb-2">{service.name}</h3>
                {service.description && <p className="text-sm text-text-secondary mb-4 line-clamp-2">{service.description}</p>}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="price-tag text-base">৳{service.priceMin.toLocaleString()} – ৳{service.priceMax.toLocaleString()}</span>
                  <span className="text-xs text-text-secondary font-mono bg-bg px-2 py-0.5 rounded">{formatTurnaround(service.estTurnaroundMinutes)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && services.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-12 h-12 text-text-secondary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
            <p className="text-text-secondary">No repair services found for this filter.</p>
          </div>
        )}
      </section>

      <section id="book-repair" className={`max-w-4xl mx-auto px-4 pb-20 ${showBooking ? '' : 'hidden'}`}>
        <div className="bg-surface rounded-2xl border border-border shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-accent via-accent-hover to-purple-700 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-white">Book a Repair</h2>
                <p className="text-blue-100 text-sm mt-0.5">Fill in the details below and we'll take care of the rest.</p>
              </div>
              <button onClick={() => setShowBooking(false)} className="text-white/80 hover:text-white p-1">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Device Type *</label>
                <div className="grid grid-cols-3 gap-2">
                  {deviceTypes.map((dt) => (
                    <button key={dt} type="button" onClick={() => setForm({ ...form, deviceType: dt, services: [] })} className={`p-2.5 rounded-lg border text-sm font-medium transition-all ${form.deviceType === dt ? 'border-accent bg-accent/5 text-accent ring-2 ring-accent/20' : 'border-border text-text-secondary hover:border-accent/30'}`}>{dt}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Device Model *</label>
                <input type="text" required value={form.deviceModel} onChange={(e) => setForm({ ...form, deviceModel: e.target.value })} placeholder="e.g. iPhone 14 Pro Max, MacBook Air M2" className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Select Services *</label>
              {!form.deviceType ? (
                <p className="text-sm text-text-secondary bg-bg rounded-lg p-4 text-center">Please select a device type first to see available services.</p>
              ) : filteredServices.length === 0 ? (
                <p className="text-sm text-text-secondary bg-bg rounded-lg p-4 text-center">No services available for this device. Please select a different device.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-2">
                  {filteredServices.map((svc) => (
                    <label key={svc._id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${form.services.includes(svc._id) ? 'border-accent bg-accent/5 ring-1 ring-accent/20' : 'border-border hover:border-accent/30'}`}>
                      <input type="checkbox" checked={form.services.includes(svc._id)} onChange={() => toggleService(svc._id)} className="text-accent rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{svc.name}</p>
                        <p className="text-xs text-text-secondary">৳{svc.priceMin}–{svc.priceMax} • ~{formatTurnaround(svc.estTurnaroundMinutes)}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Describe the Issue <span className="text-text-secondary font-normal">(optional)</span></label>
              <textarea value={form.issueDescription} onChange={(e) => setForm({ ...form, issueDescription: e.target.value })} rows={3} placeholder="e.g. Screen cracked, battery drains quickly..." className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Preferred Date *</label>
                <input type="date" required value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} min={minDate} className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Preferred Time Slot</label>
                <div className="space-y-2">
                  {timeSlots.map((slot) => (
                    <label key={slot.value} className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${form.preferredSlot === slot.value ? 'border-accent bg-accent/5 ring-1 ring-accent/20' : 'border-border hover:border-accent/30'}`}>
                      <input type="radio" name="slot" value={slot.value} checked={form.preferredSlot === slot.value} onChange={(e) => setForm({ ...form, preferredSlot: e.target.value })} className="text-accent" />
                      <span className="text-sm">{slot.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-semibold text-sm text-text-primary mb-3">Contact Information</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-primary mb-1">Full Name *</label>
                  <input type="text" required value={form.customer.name} onChange={(e) => setForm({ ...form, customer: { ...form.customer, name: e.target.value } })} className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-primary mb-1">Phone *</label>
                  <input type="tel" required value={form.customer.phone} onChange={(e) => setForm({ ...form, customer: { ...form.customer, phone: e.target.value } })} placeholder="01700000000" className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-primary mb-1">Email <span className="text-text-secondary font-normal">(optional)</span></label>
                  <input type="email" value={form.customer.email} onChange={(e) => setForm({ ...form, customer: { ...form.customer, email: e.target.value } })} className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm" />
                </div>
              </div>
            </div>

            {form.services.length > 0 && (
              <div className="bg-bg rounded-xl p-4 border border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-text-primary">Estimated Cost:</span>
                  <span className="price-tag text-lg">৳{estimatedCost.toLocaleString()}+</span>
                </div>
                <p className="text-xs text-text-secondary mt-1">Final cost confirmed after diagnosis. You'll be notified before any charge.</p>
              </div>
            )}

            <button type="submit" disabled={submitting || !form.deviceType || !form.deviceModel || form.services.length === 0 || !form.customer.name || !form.customer.phone} className="btn-primary w-full text-base py-3 disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Booking...' : `Confirm Booking${estimatedCost > 0 ? ` — ৳${estimatedCost.toLocaleString()}+` : ''}`}
            </button>

            <p className="text-xs text-text-secondary text-center">Your info is safe with us. We'll only use it to confirm your booking and send updates.</p>
          </form>
        </div>
      </section>

      <section className="bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="font-display text-2xl font-bold text-text-primary mb-2">Don't Want to Book Online?</h2>
          <p className="text-text-secondary mb-6">Call or visit us directly. We're open Saturday–Thursday, 10 AM – 8 PM.</p>
          <div className="flex justify-center gap-4">
            <a href="tel:+8801700000000" className="btn-primary">Call Now</a>
            <a href="https://wa.me/8801700000000" target="_blank" rel="noopener noreferrer" className="btn-secondary">Chat on WhatsApp</a>
            <Link to="/contact" className="btn-secondary">Visit Our Store</Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-repair-amber/5 to-amber-50 rounded-2xl p-8 border border-repair-amber/10 text-center">
          <h2 className="font-display text-2xl font-bold text-text-primary mb-2">Track Your Repair</h2>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">Already booked a repair? Use your ticket number to check the status.</p>
          <Link to="/track-repair/demo" className="btn-primary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Track My Repair
          </Link>
        </div>
      </section>
    </div>
  );
}
