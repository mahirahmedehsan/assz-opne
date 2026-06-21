import { Link } from 'react-router-dom';
import { useAboutInfo } from '../hooks/useAboutInfo';

export default function About() {
  const { data } = useAboutInfo();
  const info = data?.aboutInfo;

  return (
    <div>
      <section className="bg-gradient-to-br from-gray-950 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-block glass-badge text-white px-4 py-2 rounded-full mb-6">
            <span className="ticket-number text-white/70">About Us</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {(info?.heroTitle || "Pabna's Most Trusted<br />Apple Device Service Center").split('<br />').map((s, i) => (
              <span key={i}>{i > 0 && <br />}{s}</span>
            ))}
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            {info?.heroDescription || "We're a team of passionate technicians, retailers, and customer service professionals dedicated to keeping Apple devices running at their best."}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(info?.stats?.length ? info.stats : [
            { value: '5+', label: 'Years Experience' },
            { value: '2,000+', label: 'Devices Repaired' },
            { value: '98%', label: 'Customer Satisfaction' },
            { value: '90-Day', label: 'Warranty on All Repairs' },
          ]).map((s) => (
            <div key={s.label} className="bg-surface rounded-xl p-6 text-center border border-border shadow-sm">
              <p className="font-display text-3xl font-bold text-accent">{s.value}</p>
              <p className="text-sm text-text-secondary mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-text-primary mb-4">{info?.missionTitle || 'Our Mission'}</h2>
          <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed">
            {info?.missionDescription || "To provide fast, reliable, and affordable Apple device service with the transparency and precision of a professional workshop — right here in Pabna."}
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {(info?.values?.length ? info.values : [
            { title: 'Quality Parts', desc: 'We use genuine or high-grade replacement parts sourced from trusted suppliers.', icon: '🛡️' },
            { title: 'Certified Technicians', desc: 'Every repair is performed by trained professionals with years of hands-on experience.', icon: '🔧' },
            { title: 'Transparent Pricing', desc: 'You get a detailed quote before any work begins. No hidden fees, no surprises.', icon: '💰' },
            { title: 'Fast Service', desc: 'Most repairs completed within 24 hours. Same-day service available for common issues.', icon: '⚡' },
          ]).map((v) => (
            <div key={v.title} className="bg-surface rounded-xl p-6 border border-border hover:border-accent/30 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent transition-colors text-lg">
                {v.icon}
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
            {(info?.timeline?.length ? info.timeline : [
              { year: '2019', event: 'ASSZ founded in Pabna with a single repair bench' },
              { year: '2020', event: 'Expanded to accessories retail; launched online presence' },
              { year: '2021', event: 'Became authorized service partner for major brands' },
              { year: '2023', event: 'Opened second location; 2,000+ devices served' },
              { year: '2025', event: 'Launched full e-commerce platform with nationwide delivery' },
            ]).map((t, i, arr) => (
              <div key={t.year} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-display font-bold text-sm shrink-0">
                    {t.year.slice(2)}
                  </div>
                  {i < arr.length - 1 && <div className="w-0.5 flex-1 bg-accent/20 mt-2" />}
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
          {(info?.team?.length ? info.team : [
            { name: 'Mahir Ahmed Ehsan', role: 'Founder & Lead Technician', initials: 'ME' },
            { name: 'Fatima Akter', role: 'Customer Relations Manager', initials: 'FA' },
            { name: 'Rakib Hasan', role: 'Senior Repair Technician', initials: 'RH' },
            { name: 'Nusrat Jahan', role: 'Sales & Inventory Lead', initials: 'NJ' },
          ]).map((t) => (
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
          <h2 className="font-display text-3xl font-bold mb-4">{info?.ctaTitle || 'Ready to Get Started?'}</h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">{info?.ctaDescription || 'Book a repair, shop accessories, or just stop by for a free diagnostic.'}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={info?.ctaPrimaryLink || '/repair-services'} className="btn-primary !bg-white !text-accent hover:!bg-blue-50 !border-0">{info?.ctaPrimaryLabel || 'Book a Repair'}</Link>
            <Link to={info?.ctaSecondaryLink || '/contact'} className="btn-secondary border-white text-white hover:bg-white hover:text-text-primary">{info?.ctaSecondaryLabel || 'Visit Our Store'}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
