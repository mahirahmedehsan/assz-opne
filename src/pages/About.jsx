import { Link } from 'react-router-dom';

const stats = [
  { value: '5+', label: 'Years Experience' },
  { value: '2,000+', label: 'Devices Repaired' },
  { value: '98%', label: 'Customer Satisfaction' },
  { value: '90-Day', label: 'Warranty on All Repairs' },
];

const values = [
  { title: 'Quality Parts', desc: 'We use genuine or high-grade replacement parts sourced from trusted suppliers.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { title: 'Certified Technicians', desc: 'Every repair is performed by trained professionals with years of hands-on experience.', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  { title: 'Transparent Pricing', desc: 'You get a detailed quote before any work begins. No hidden fees, no surprises.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'Fast Service', desc: 'Most repairs completed within 24 hours. Same-day service available for common issues.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
];

const team = [
  { name: 'Mahir Ahmed Ehsan', role: 'Founder & Lead Technician', initials: 'ME' },
  { name: 'Fatima Akter', role: 'Customer Relations Manager', initials: 'FA' },
  { name: 'Rakib Hasan', role: 'Senior Repair Technician', initials: 'RH' },
  { name: 'Nusrat Jahan', role: 'Sales & Inventory Lead', initials: 'NJ' },
];

const timeline = [
  { year: '2019', event: 'ASSZ founded in Pabna with a single repair bench' },
  { year: '2020', event: 'Expanded to accessories retail; launched online presence' },
  { year: '2021', event: 'Became authorized service partner for major brands' },
  { year: '2023', event: 'Opened second location; 2,000+ devices served' },
  { year: '2025', event: 'Launched full e-commerce platform with nationwide delivery' },
];

export default function About() {
  return (
    <div>
      <section className="bg-gradient-to-br from-gray-950 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-block glass-badge text-white px-4 py-2 rounded-full mb-6">
            <span className="ticket-number text-white/70">About Us</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Pabna's Most Trusted<br />
            <span className="text-accent">Apple Device Service Center</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            We're a team of passionate technicians, retailers, and customer service professionals dedicated to keeping Apple devices running at their best.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface rounded-xl p-6 text-center border border-border shadow-sm">
              <p className="font-display text-3xl font-bold text-accent">{s.value}</p>
              <p className="text-sm text-text-secondary mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-text-primary mb-4">Our Mission</h2>
          <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed">
            To provide fast, reliable, and affordable Apple device service with the transparency and precision of a professional workshop — right here in Pabna.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {values.map((v) => (
            <div key={v.title} className="bg-surface rounded-xl p-6 border border-border hover:border-accent/30 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-colors">
                <svg className="w-5 h-5 text-accent group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={v.icon} />
                </svg>
              </div>
              <h3 className="font-semibold text-sm text-text-primary mb-2">{v.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-text-primary mb-4">Our Journey</h2>
            <p className="text-text-secondary max-w-xl mx-auto">From a single repair bench to Pabna's most trusted Apple service center.</p>
          </div>
          <div className="max-w-3xl mx-auto">
            {timeline.map((t, i) => (
              <div key={t.year} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-display font-bold text-sm shrink-0">
                    {t.year.slice(2)}
                  </div>
                  {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-accent/20 mt-2" />}
                </div>
                <div className="pb-8">
                  <p className="text-xs text-accent font-mono font-semibold mb-1">{t.year}</p>
                  <p className="text-sm text-text-primary">{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-text-primary mb-4">Meet Our Team</h2>
          <p className="text-text-secondary max-w-xl mx-auto">The people behind every successful repair and every satisfied customer.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {team.map((t) => (
            <div key={t.name} className="bg-surface rounded-xl p-6 text-center border border-border hover:border-accent/30 hover:shadow-md transition-all">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-blue-400 text-white flex items-center justify-center font-display font-bold text-xl mx-auto mb-4">
                {t.initials}
              </div>
              <h3 className="font-semibold text-sm text-text-primary">{t.name}</h3>
              <p className="text-xs text-text-secondary mt-1">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-accent to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">Book a repair, shop accessories, or just stop by for a free diagnostic.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/repair-services" className="btn-primary !bg-white !text-accent hover:!bg-blue-50 !border-0">Book a Repair</Link>
            <Link to="/contact" className="btn-secondary border-white text-white hover:bg-white hover:text-text-primary">Visit Our Store</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
