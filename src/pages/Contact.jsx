import { useState } from 'react';
import api from '../services/api';
import { useContactInfo } from '../hooks/useContactInfo';

const icons = {
  visit: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z',
  phone: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  email: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  chat: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z',
};

export default function Contact() {
  const { data } = useContactInfo();
  const info = data?.contactInfo;
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const contactMethods = info ? [
    {
      title: 'Visit Us',
      lines: info.address?.split(',').map(s => s.trim()) || [],
      icon: icons.visit,
    },
    {
      title: 'Call / WhatsApp',
      lines: [info.phone || '', 'Call us during business hours'],
      icon: icons.phone,
      action: { label: 'Call Now', href: `tel:${info.phone?.replace(/\s/g, '') || ''}` },
    },
    {
      title: 'Email Us',
      lines: [info.email || '', 'We reply within 24 hours'],
      icon: icons.email,
      action: { label: 'Send Email', href: `mailto:${info.email || ''}` },
    },
    {
      title: 'Chat on WhatsApp',
      lines: ['Click the button below', 'to start a conversation'],
      icon: icons.chat,
      action: { label: 'Chat Now', href: `https://wa.me/${info.whatsapp || ''}` },
    },
  ] : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/contact', form);
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message');
    }
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-gray-950 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-block glass-badge text-white px-4 py-2 rounded-full mb-6">
            <span className="ticket-number text-white/70">Get in Touch</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
            We'd Love to<br />
            <span className="text-accent">Hear From You</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-xl mx-auto">
            Have a question about a repair, product, or just want to say hello? We're here to help.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {contactMethods.map((m) => (
            <div key={m.title} className="card-hover bg-surface rounded-xl p-5 border border-border">
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={m.icon} />
                </svg>
              </div>
              <h3 className="font-semibold text-sm text-text-primary mb-1">{m.title}</h3>
              {m.lines.map((line) => (
                <p key={line} className="text-xs text-text-secondary">{line}</p>
              ))}
              {m.action && (
                <a href={m.action.href} target={m.action.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="inline-block mt-2 text-xs font-semibold text-accent hover:underline">
                  {m.action.label} &rarr;
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-3">
            <h2 className="font-display text-2xl font-bold text-text-primary mb-2">Send Us a Message</h2>
            <p className="text-sm text-text-secondary mb-6">We'll get back to you within 24 hours.</p>
            {submitted ? (
              <div className="bg-mint-confirm/5 border border-mint-confirm/20 rounded-xl p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-mint-confirm text-white flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="font-display text-xl font-bold text-text-primary mb-2">Message Sent!</h3>
                <p className="text-sm text-text-secondary mb-4">We'll get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="btn-primary text-sm">Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Full Name *</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-sm transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Email *</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-sm transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Phone</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-sm transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Subject</label>
                    <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-sm transition-colors">
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Repair Question">Repair Question</option>
                      <option value="Product Inquiry">Product Inquiry</option>
                      <option value="Order Issue">Order Issue</option>
                      <option value="Feedback">Feedback</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Message *</label>
                  <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-sm transition-colors" />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button type="submit" className="btn-primary">Send Message</button>
              </form>
            )}
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-surface rounded-xl border border-border overflow-hidden h-64">
              <div className="w-full h-full bg-bg dark:bg-surface flex items-center justify-center">
                <div className="text-center px-6">
                  <svg className="w-8 h-8 text-text-secondary mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <p className="text-sm font-medium text-text-primary">{info?.address?.split(',')[0] || 'A.K Zaman Plaza, Ataikula'}</p>
                  <p className="text-xs text-text-secondary mt-1">{info?.address?.split(',').slice(1).join(', ').trim() || 'Pabna, Bangladesh'}</p>
                  <a href={info?.mapLink || '#'} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs font-semibold text-accent hover:underline">
                    Open in Google Maps &rarr;
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-xl border border-border p-6">
              <h3 className="font-semibold text-sm text-text-primary mb-3">Business Hours</h3>
              <div className="space-y-2 text-sm">
                {(info?.days?.length ? info.days : [
                  { day: 'Saturday', isOpen: true, hours: '10:00 AM – 8:00 PM' },
                  { day: 'Sunday', isOpen: true, hours: '10:00 AM – 8:00 PM' },
                  { day: 'Monday', isOpen: true, hours: '10:00 AM – 8:00 PM' },
                  { day: 'Tuesday', isOpen: true, hours: '10:00 AM – 8:00 PM' },
                  { day: 'Wednesday', isOpen: true, hours: '10:00 AM – 8:00 PM' },
                  { day: 'Thursday', isOpen: true, hours: '10:00 AM – 8:00 PM' },
                  { day: 'Friday', isOpen: false, hours: 'Closed' },
                ]).map((d) => (
                  <div key={d.day} className="flex justify-between">
                    <span className="text-text-secondary">{d.day}</span>
                    {d.isOpen ? (
                      <span className="font-medium">{d.hours}</span>
                    ) : (
                      <span className="text-red-500 font-medium">{d.hours || 'Closed'}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-accent/5 rounded-xl border border-accent/10 p-6 text-center">
              <h3 className="font-semibold text-sm text-text-primary mb-2">Need Quick Help?</h3>
              <p className="text-xs text-text-secondary mb-4">Chat with us on WhatsApp — we respond within minutes.</p>
              <a href={`https://wa.me/${info?.whatsapp || '8801700000000'}`} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm !bg-[#25D366] hover:!bg-[#128C7E]">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
