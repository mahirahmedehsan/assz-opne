import { Link } from 'react-router-dom';
import { useContactInfo } from '../hooks/useContactInfo';

const socialIcons = {
  facebook: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
  whatsapp: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z',
  email: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
};

const defaultInfo = {
  address: 'A.K Zaman Plaza, Ataikula, Pabna',
  phone: '+880 1700-000000',
  email: 'info@assz.com',
  whatsapp: '8801700000000',
  days: [
    { day: 'Saturday', isOpen: true, hours: '10:00 AM – 8:00 PM' },
    { day: 'Sunday', isOpen: true, hours: '10:00 AM – 8:00 PM' },
    { day: 'Monday', isOpen: true, hours: '10:00 AM – 8:00 PM' },
    { day: 'Tuesday', isOpen: true, hours: '10:00 AM – 8:00 PM' },
    { day: 'Wednesday', isOpen: true, hours: '10:00 AM – 8:00 PM' },
    { day: 'Thursday', isOpen: true, hours: '10:00 AM – 8:00 PM' },
    { day: 'Friday', isOpen: false, hours: 'Closed' },
  ],
};

function formatPhone(phone) {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 13) return `+${digits.slice(0,3)} ${digits.slice(3,7)}-${digits.slice(7)}`;
  if (digits.length === 11) return `+${digits[0]} ${digits.slice(1,5)}-${digits.slice(5)}`;
  return phone;
}

export default function Footer() {
  const { data } = useContactInfo();
  const info = data?.contactInfo || defaultInfo;

  const addressParts = (info.address || defaultInfo.address).split(',').map(s => s.trim());
  const openDays = (info.days?.length ? info.days : defaultInfo.days);
  const phoneClean = (info.phone || defaultInfo.phone).replace(/\s/g, '');
  const emailVal = info.email || defaultInfo.email;
  const waNumber = info.whatsapp || defaultInfo.whatsapp;

  const socialLinks = [
    { label: 'Facebook', href: '#', icon: socialIcons.facebook },
    { label: 'WhatsApp', href: `https://wa.me/${waNumber}`, icon: socialIcons.whatsapp },
    { label: 'Email', href: `mailto:${emailVal}`, icon: socialIcons.email },
  ];

  const todayName = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];
  const today = openDays.find(d => d.day === todayName);
  const todayStatus = today ? (today.isOpen ? `Open today: ${today.hours}` : 'Closed today') : '';

  const openHoursStr = openDays
    .filter(d => d.isOpen)
    .map(d => `${d.day.slice(0,3)} ${d.hours}`)
    .join(', ');

  return (
    <footer className="bg-slate-950 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: "Apple's Service Zone (ASSZ)",
            image: '',
            description: 'Trusted Apple Device Service Center — screen, battery, software & hardware repairs. Retailer of mobile and laptop accessories.',
            address: {
              '@type': 'PostalAddress',
              streetAddress: addressParts[0] || defaultInfo.address,
              addressLocality: addressParts[1]?.trim() || 'Pabna',
              addressCountry: 'BD',
            },
            telephone: phoneClean,
            openingHours: openHoursStr,
            url: 'https://assz.com',
          }),
        }}
      />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="font-display text-xl font-bold text-white hover:text-accent transition-colors">
              <span className="text-accent">ASSZ</span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed mt-3 max-w-xs">
              Apple's Service Zone — Pabna's trusted independent Apple device service center and electronics retailer. Certified technicians, genuine parts, 90-day warranty.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-text-secondary mb-4">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/shop/phone-accessories" className="text-text-secondary hover:text-white transition-colors">Phone Accessories</Link></li>
              <li><Link to="/shop/laptop-accessories" className="text-text-secondary hover:text-white transition-colors">Laptop Accessories</Link></li>
              <li><Link to="/shop/home-accessories" className="text-text-secondary hover:text-white transition-colors">Home Accessories</Link></li>
              <li><Link to="/shop/second-hand" className="text-text-secondary hover:text-white transition-colors">Second-Hand Phones</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-text-secondary mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/repair-services" className="text-text-secondary hover:text-white transition-colors">Screen Repair</Link></li>
              <li><Link to="/repair-services" className="text-text-secondary hover:text-white transition-colors">Battery Replacement</Link></li>
              <li><Link to="/repair-services" className="text-text-secondary hover:text-white transition-colors">Software Fixes</Link></li>
              <li><Link to="/book-repair" className="text-text-secondary hover:text-white transition-colors">Book a Repair</Link></li>
              <li><Link to="/track-repair/demo" className="text-text-secondary hover:text-white transition-colors">Track My Repair</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-text-secondary mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="text-text-secondary hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-text-secondary hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/shop" className="text-text-secondary hover:text-white transition-colors">All Products</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-text-secondary mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>{info.address || defaultInfo.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <a href={`tel:${phoneClean}`} className="hover:text-white transition-colors">{formatPhone(info.phone || defaultInfo.phone)}</a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <a href={`mailto:${emailVal}`} className="hover:text-white transition-colors">{emailVal}</a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{todayStatus || 'Sat–Thu: 10 AM – 8 PM'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-secondary">&copy; {new Date().getFullYear()} Apple's Service Zone (ASSZ). All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-text-secondary">
            <Link to="/shop" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/shop" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
