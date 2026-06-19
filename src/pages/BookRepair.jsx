import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCreateBooking, useCreateGuestBooking } from '../hooks/useRepairBooking';
import { useRepairServices } from '../hooks/useCategories';
import TicketCard from '../components/TicketCard';
import Loader from '../components/Loader';

const STEPS = ['Device', 'Issue', 'Schedule', 'Contact', 'Confirm'];

const deviceTypes = ['Android Phone', 'iPhone', 'iPad', 'MacBook', 'Laptop', 'Apple Watch', 'AirPods', 'Other'];

const timeSlots = [
  { value: 'morning', label: 'Morning (10AM–12PM)' },
  { value: 'afternoon', label: 'Afternoon (12PM–5PM)' },
  { value: 'evening', label: 'Evening (5PM–8PM)' },
];

export default function BookRepair() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createBooking = useCreateBooking();
  const createGuestBooking = useCreateGuestBooking();
  const { data: servicesData } = useRepairServices();

  const allServices = servicesData?.services || [];

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    deviceType: '',
    deviceModel: '',
    services: [],
    issueDescription: '',
    preferredDate: '',
    preferredSlot: 'morning',
    customer: {
      name: user?.displayName || '',
      phone: '',
      email: user?.email || '',
    },
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const filteredServices = form.deviceType
    ? allServices.filter((s) => s.deviceType === form.deviceType)
    : allServices;

  const toggleService = (id) => {
    const current = form.services;
    const updated = current.includes(id) ? current.filter((s) => s !== id) : [...current, id];
    update('services', updated);
  };

  const canProceed = () => {
    switch (step) {
      case 0: return form.deviceType && form.deviceModel;
      case 1: return form.services.length > 0;
      case 2: return form.preferredDate && form.preferredSlot;
      case 3: return form.customer.name && form.customer.phone;
      case 4: return true;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    const payload = {
      deviceType: form.deviceType,
      deviceModel: form.deviceModel,
      services: form.services,
      issueDescription: form.issueDescription,
      preferredDate: new Date(form.preferredDate),
      preferredSlot: form.preferredSlot,
      customer: form.customer,
    };

    try {
      const mutation = user ? createBooking : createGuestBooking;
      const result = await mutation.mutateAsync(payload);
      navigate(`/track-repair/${result.booking.ticketNumber}`);
    } catch (err) {
      alert(err.response?.data?.error || 'Booking failed. Please try again.');
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-text-primary">Select Your Device</h2>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Device Type</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {deviceTypes.map((dt) => (
                  <button
                    key={dt}
                    onClick={() => { update('deviceType', dt); update('deviceModel', ''); }}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      form.deviceType === dt
                        ? 'border-accent bg-accent/5 text-accent'
                        : 'border-border text-text-secondary hover:border-accent/30'
                    }`}
                  >
                    {dt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Device Model</label>
              <input
                type="text"
                value={form.deviceModel}
                onChange={(e) => update('deviceModel', e.target.value)}
                placeholder="e.g. iPhone 14 Pro Max, MacBook Air M2"
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-text-primary">Describe the Issue</h2>
            {filteredServices.length === 0 ? (
              <p className="text-text-secondary text-sm">No services available for this device type. Please go back and select a different device.</p>
            ) : (
              <div className="space-y-2">
                {filteredServices.map((svc) => (
                  <label
                    key={svc._id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      form.services.includes(svc._id)
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-accent/30'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.services.includes(svc._id)}
                      onChange={() => toggleService(svc._id)}
                      className="text-accent"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">{svc.name}</p>
                      <p className="text-xs text-text-secondary">
                        ৳{svc.priceMin}–{svc.priceMax} • ~{svc.estTurnaroundMinutes}min
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Describe the problem (optional)</label>
              <textarea
                value={form.issueDescription}
                onChange={(e) => update('issueDescription', e.target.value)}
                rows={3}
                placeholder="e.g. Screen cracked, battery drains quickly..."
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-text-primary">Choose a Date & Time</h2>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Preferred Date</label>
              <input
                type="date"
                value={form.preferredDate}
                onChange={(e) => update('preferredDate', e.target.value)}
                min={minDate}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Preferred Time Slot</label>
              <div className="space-y-2">
                {timeSlots.map((slot) => (
                  <label
                    key={slot.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      form.preferredSlot === slot.value
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-accent/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="slot"
                      value={slot.value}
                      checked={form.preferredSlot === slot.value}
                      onChange={(e) => update('preferredSlot', e.target.value)}
                      className="text-accent"
                    />
                    <span className="text-sm">{slot.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-text-primary">Contact Information</h2>
            <p className="text-sm text-text-secondary">We'll use this info to confirm your booking and send updates.</p>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Full Name</label>
              <input
                type="text"
                required
                value={form.customer.name}
                onChange={(e) => setForm({ ...form, customer: { ...form.customer, name: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={form.customer.phone}
                onChange={(e) => setForm({ ...form, customer: { ...form.customer, phone: e.target.value } })}
                placeholder="e.g. 01700000000"
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Email (optional)</label>
              <input
                type="email"
                value={form.customer.email}
                onChange={(e) => setForm({ ...form, customer: { ...form.customer, email: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
          </div>
        );

      case 4:
        const selectedServices = filteredServices.filter((s) => form.services.includes(s._id));
        const estimatedCost = selectedServices.reduce((sum, s) => sum + s.priceMin, 0);
        return (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-text-primary">Confirm Your Booking</h2>
            <TicketCard>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-text-secondary">Device:</span>
                  <span className="ml-2 font-medium">{form.deviceType} — {form.deviceModel}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Services:</span>
                  <ul className="ml-4 mt-1 space-y-1">
                    {selectedServices.map((s) => (
                      <li key={s._id} className="list-disc text-text-secondary">{s.name}</li>
                    ))}
                  </ul>
                </div>
                {form.issueDescription && (
                  <div>
                    <span className="text-text-secondary">Issue:</span>
                    <p className="mt-1 text-text-primary">{form.issueDescription}</p>
                  </div>
                )}
                <div>
                  <span className="text-text-secondary">Date:</span>
                  <span className="ml-2 font-medium">
                    {new Date(form.preferredDate).toLocaleDateString('en-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary">Slot:</span>
                  <span className="ml-2 font-medium capitalize">{form.preferredSlot}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Contact:</span>
                  <span className="ml-2">{form.customer.name} — {form.customer.phone}</span>
                </div>
                <div className="border-t border-border pt-3">
                  <span className="text-text-secondary">Estimated Cost:</span>
                  <span className="ml-2 price-tag text-lg">৳{estimatedCost.toLocaleString()}+</span>
                </div>
              </div>
            </TicketCard>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-text-primary mb-8">Book a Repair</h1>

      <div className="flex items-center mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center">
            <div className={`flex items-center gap-2 ${i <= step ? 'text-accent' : 'text-text-secondary'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono font-semibold border-2 transition-colors ${
                i <= step ? 'border-accent bg-accent text-white' : 'border-text-secondary/30'
              }`}>
                {i + 1}
              </span>
              <span className="hidden md:inline text-xs font-medium">{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 md:w-12 h-0.5 mx-1 ${i < step ? 'bg-accent' : 'bg-text-secondary/20'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="ticket-stub p-6 mb-6">
        {renderStep()}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={createBooking.isPending || createGuestBooking.isPending}
            className="btn-primary"
          >
            {createBooking.isPending || createGuestBooking.isPending ? 'Booking...' : 'Confirm Booking'}
          </button>
        )}
      </div>
    </div>
  );
}
