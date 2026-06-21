import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useAllReviews } from '../hooks/useReviews';
import { useHeroSlides } from '../hooks/useHeroSlides';
import { useInView } from '../hooks/useInView';
import api from '../services/api';

const quickLinks = [
  { label: 'Screen Repair', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'bg-accent/10 text-accent', href: '/repair-services' },
  { label: 'Battery', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'bg-repair-amber/10 text-repair-amber', href: '/repair-services' },
  { label: 'Phone Cases', icon: 'M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z', color: 'bg-mint-confirm/10 text-mint-confirm', href: '/shop/phone-accessories' },
  { label: 'Chargers', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'bg-accent/10 text-accent', href: '/shop/phone-accessories' },
  { label: 'Earbuds', icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z', color: 'bg-repair-amber/10 text-repair-amber', href: '/shop/phone-accessories' },
  { label: 'Second-Hand', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', color: 'bg-text-primary/10 text-text-primary', href: '/shop/second-hand' },
  { label: 'Laptop Acc.', icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11a3 3 0 10-.708 1.292', color: 'bg-mint-confirm/10 text-mint-confirm', href: '/shop/laptop-accessories' },
  { label: 'Home Acc.', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', color: 'bg-accent/10 text-accent', href: '/shop/home-accessories' },
];

const stats = [
  { value: '2,000+', label: 'Devices Repaired', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  { value: '5,000+', label: 'Happy Customers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { value: '98%', label: 'Satisfaction Rate', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { value: '90-Day', label: 'Warranty', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
];



const brands = [
  'Apple', 'Samsung', 'Xiaomi', 'OnePlus', 'Google', 'Sony',
];

const defaultHeroSlides = [
  {
    badge: 'Free diagnostic \u2022 15 min avg. \u2022 90-day warranty',
    title: ['Your Apple Device', 'Deserves Expert Care'],
    accent: 'Deserves Expert Care',
    accentColor: 'text-accent',
    desc: "Pabna's most trusted Apple device service center. Screen repairs, battery replacements, software fixes \u2014 fast, reliable, and affordable.",
    primary: { text: 'Book a Repair', href: '/repair-services' },
    secondary: { text: 'Shop Accessories', href: '/shop' },
    gradient: 'from-[#0B1121] via-[#0F1629] to-[#1A1B3A]',
    glow: 'from-accent',
    image: 'https://images.unsplash.com/photo-1598965402082-897c521d1c2d?w=600&h=600&fit=crop&auto=format',
  },
  {
    badge: 'Genuine parts \u2022 Fast shipping \u2022 7-day returns',
    title: ['Premium Accessories', 'for Your Devices'],
    accent: 'for Your Devices',
    accentColor: 'text-repair-amber',
    desc: 'Phone cases, chargers, earbuds, and more \u2014 all tested for quality and compatibility with Apple devices.',
    primary: { text: 'Shop Now', href: '/shop' },
    secondary: { text: 'View Categories', href: '/shop/phone-accessories' },
    gradient: 'from-[#0B1121] via-[#1A1B3A] to-[#2D1B00]',
    glow: 'from-repair-amber',
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop&auto=format',
  },
  {
    badge: 'Any make \u2022 Any condition \u2022 Instant quote',
    title: ['Trade In Your Old Device', '& Save Big'],
    accent: '& Save Big',
    accentColor: 'text-mint-confirm',
    desc: "Don\u2019t let your old device gather dust. Trade it in and get credit toward your next repair or purchase. We accept all makes and models.",
    primary: { text: 'Learn More', href: '/shop/second-hand' },
    secondary: { text: 'Book a Repair', href: '/repair-services' },
    gradient: 'from-[#0B1121] via-[#0F1A1A] to-[#0A1F1A]',
    glow: 'from-mint-confirm',
    image: 'https://images.unsplash.com/photo-1535303311164-664fc9ecb9b2?w=600&h=600&fit=crop&auto=format',
  },
];

const steps = [
  { num: '1', title: 'Describe the Issue', desc: 'Tell us what\'s wrong with your device online or in-store.' },
  { num: '2', title: 'Free Diagnosis', desc: 'We diagnose the problem — no charge, no obligation.' },
  { num: '3', title: 'Get a Quote', desc: 'We give you a transparent price before any work begins.' },
  { num: '4', title: 'Repair Complete', desc: 'Device fixed and tested. Pick up or we deliver.' },
];

function SocialMediaSection() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [smRef, smInView] = useInView();

  useEffect(() => {
    let mounted = true;
    api.get('/social-media/featured')
      .then((res) => { if (mounted) setVideos(res.data.videos); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  if (loading || videos.length === 0) return null;

  return (
    <section ref={smRef} className={`max-w-7xl mx-auto px-4 py-16 transition-all duration-700 ${smInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="text-center mb-10">
        <p className="section-subtitle">Social Media</p>
        <h2 className="section-title text-text-primary mt-1">Follow Us</h2>
        <p className="text-text-secondary text-sm max-w-xl mx-auto mt-2">Watch our latest videos on YouTube, TikTok, Instagram, and Facebook.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.slice(0, 4).map((video) => (
          <div key={video._id} className="group bg-surface rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-accent/30 transition-all duration-300">
            <div className="relative aspect-[9/16] bg-bg overflow-hidden">
              <iframe
                src={video.embedUrl}
                title={video.title || 'Video'}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
            {video.title && (
              <div className="p-3">
                <h3 className="font-semibold text-xs text-text-primary line-clamp-2">{video.title}</h3>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link to="/about#social-media" className="text-sm font-semibold text-accent hover:text-blue-700 transition-colors">
          Learn More About Us →
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  const { data: featuredData } = useProducts({ limit: 4, featured: 'true' });
  const featuredProducts = featuredData?.products || [];
  const { data: reviewsData } = useAllReviews();
  const reviews = reviewsData?.reviews || [];
  const { data: heroData } = useHeroSlides();

  const heroSlides = (heroData?.slides?.length > 0 ? heroData.slides : defaultHeroSlides).map((s) => ({
    badge: s.badge || '',
    title: [s.titleLine1 || '', s.titleLine2 || ''],
    accent: s.accent || '',
    accentColor: s.accentColor || 'text-accent',
    desc: s.description || '',
    primary: { text: s.primaryText || 'Book a Repair', href: s.primaryHref || '/repair-services' },
    secondary: { text: s.secondaryText || 'Shop Accessories', href: s.secondaryHref || '/shop' },
    image: s.image || '',
    gradient: s.gradient || 'from-[#0B1121] via-[#0F1629] to-[#1A1B3A]',
    glow: s.glow || 'from-accent',
  }));

  const [current, setCurrent] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);

  useEffect(() => {
    const maxIdx = Math.max(0, reviews.length - slidesPerView);
    if (current > maxIdx)
      setCurrent(maxIdx); // eslint-disable-line react-hooks/set-state-in-effect
  }, [reviews.length, slidesPerView, current]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) setSlidesPerView(1);
      else if (window.innerWidth < 1024) setSlidesPerView(2);
      else setSlidesPerView(3);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, reviews.length - slidesPerView);

  useEffect(() => {
    if (reviews.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [maxIndex, reviews.length]);

  const [heroIndex, setHeroIndex] = useState(0);

  const nextHero = useCallback(() => {
    setHeroIndex((prev) => (prev >= heroSlides.length - 1 ? 0 : prev + 1));
  }, []);

  useEffect(() => {
    if (heroSlides.length < 2) return;
    const timer = setInterval(nextHero, 5000);
    return () => clearInterval(timer);
  }, [nextHero, heroSlides.length]);

  const heroRef = useRef(null);
  const [quickRef, quickInView] = useInView();
  const [quickRef2, quickInView2] = useInView();
  const [statsRef, statsInView] = useInView();
  const [stepsRef, stepsInView] = useInView();
  const [productsRef, productsInView] = useInView();
  const [ctaRef, ctaInView] = useInView();
  const [brandsRef, brandsInView] = useInView();
  const [testimonialsRef, testimonialsInView] = useInView();
  const [storeRef, storeInView] = useInView();
  const [whatsappRef, whatsappInView] = useInView();


  return (
    <div>
      <section ref={heroRef} className="relative text-white overflow-hidden">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${slide.gradient} transition-opacity duration-700 ease-in-out ${
              i === heroIndex ? 'opacity-100 relative' : 'opacity-0 absolute inset-0'
            }`}
          >
            <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--${slide.glow === 'from-repair-amber' ? 'color-repair-amber' : slide.glow === 'from-mint-confirm' ? 'color-mint-confirm' : 'color-accent'})_0%,_transparent_60%)] opacity-25`} />
            <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--${slide.glow === 'from-repair-amber' ? 'color-repair-amber' : slide.glow === 'from-mint-confirm' ? 'color-mint-confirm' : 'color-accent'})_0%,_transparent_40%)] opacity-10`} />
            <div className={`max-w-7xl mx-auto px-4 py-20 md:py-28 ${i === heroIndex ? 'animate-fade-in-up' : ''}`}>
              <div className="md:flex md:items-center md:gap-12 lg:gap-16">
                <div className="max-w-2xl flex-1 shrink-0">
                  <div className="inline-flex items-center gap-2 glass-badge px-4 py-2 rounded-full mb-6">
                    <span className="w-2 h-2 rounded-full bg-mint-confirm animate-pulse" />
                    <span className="text-xs font-mono text-white/70 tracking-wider">{slide.badge}</span>
                  </div>
                  <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
                    {slide.title[0]}<br />
                    <span className={slide.accentColor}>{slide.accent}</span>
                  </h1>
                  <p className="text-base md:text-lg text-text-secondary mb-8 max-w-lg leading-relaxed">{slide.desc}</p>
                  <div className="flex flex-wrap gap-4">
                    <Link to={slide.primary.href} className="btn-primary text-base px-8 py-3 shadow-lg shadow-accent/25">
                      {slide.primary.text}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                    <Link to={slide.secondary.href} className="btn-secondary border-white text-white hover:bg-white hover:text-text-primary text-base px-8 py-3">
                      {slide.secondary.text}
                    </Link>
                  </div>
                  <div className="flex items-center gap-6 mt-10 text-xs text-text-secondary">
                    <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-mint-confirm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Certified Technicians</span>
                    <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-mint-confirm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Genuine Parts</span>
                    <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-mint-confirm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Same-Day Service</span>
                  </div>
                </div>
                <div className="hidden md:block flex-1 relative mt-10 md:mt-0">
                  <div className="relative w-full aspect-square max-w-md mx-auto">
                    <div className="absolute -inset-4 rounded-3xl blur-3xl" style={{ background: `linear-gradient(to bottom right, ${slide.glow === 'from-accent' ? 'var(--color-accent)' : slide.glow === 'from-repair-amber' ? 'var(--color-repair-amber)' : 'var(--color-mint-confirm)'}33, transparent)` }} />
                    <div className="absolute -top-3 -right-3 w-20 h-20 rounded-full bg-white/5 blur-2xl" />
                    <div className="absolute -bottom-4 -left-4 w-28 h-28 rounded-full bg-white/[0.03] blur-2xl" />
                    <img
                      src={slide.image}
                      alt={slide.accent}
                      className="relative w-full h-full object-cover rounded-2xl md:rounded-3xl shadow-2xl shadow-black/40 ring-1 ring-white/10"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 rounded-2xl md:rounded-3xl ring-1 ring-inset ring-white/10" />
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                    <svg className="w-7 h-7 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {heroSlides.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === heroIndex ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      <section ref={quickRef} className={`max-w-7xl mx-auto px-4 -mt-8 relative z-10 transition-all duration-700 ${quickInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks.slice(0, 4).map((item, i) => (
            <Link key={item.label} to={item.href} className={`card-hover flex items-center gap-3 p-4 bg-surface rounded-xl border border-border group stagger-${i + 1}`}>
              <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
              </div>
              <span className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section ref={quickRef2} className={`max-w-7xl mx-auto px-4 py-16 transition-all duration-700 ${quickInView2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks.slice(4).map((item, i) => (
            <Link key={item.label} to={item.href} className={`card-hover flex items-center gap-3 p-4 bg-surface rounded-xl border border-border group stagger-${i + 1}`}>
              <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
              </div>
              <span className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section ref={statsRef} className="relative bg-gradient-to-br from-accent via-accent-hover to-[#312E81] py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,_rgba(255,255,255,0.12)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,_var(--color-repair-amber)_0%,_transparent_30%)] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={s.label} className={`text-center text-white group transition-all duration-700 ${statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} /></svg>
                </div>
                <p className="font-display text-3xl md:text-4xl font-bold tracking-tight">{s.value}</p>
                <p className="text-sm text-blue-200/80 mt-1.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={stepsRef} className="max-w-7xl mx-auto px-4 py-20">
        <div className={`text-center mb-14 transition-all duration-700 ${stepsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="section-subtitle">How It Works</p>
          <h2 className="section-title text-text-primary mb-4">Repair in 4 Simple Steps</h2>
          <p className="text-text-secondary text-sm max-w-xl mx-auto leading-relaxed">From drop-off to pick-up, we make the process seamless and transparent.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={step.num} className={`relative text-center group transition-all duration-700 ${stepsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${idx * 150}ms` }}>
               <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-purple-600 text-white flex items-center justify-center font-display text-xl font-bold mx-auto mb-5 shadow-lg shadow-accent/20 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-accent/30 transition-all duration-300">
                {step.num}
              </div>
              {idx < steps.length - 1 && <div className="hidden md:block absolute top-8 left-[60%] w-[calc(80%)] h-0.5 bg-gradient-to-r from-accent/30 to-transparent" />}
              <h3 className="font-semibold text-sm text-text-primary mb-2">{step.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section ref={productsRef} className={`bg-surface border-y border-border py-16 transition-all duration-700 ${productsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="section-subtitle">Shop</p>
                <h2 className="section-title text-text-primary mt-1">New Arrivals</h2>
              </div>
              <Link to="/shop" className="text-sm font-semibold text-accent hover:text-blue-700 transition-colors">View All →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredProducts.map((p, i) => (
                <Link key={p._id} to={`/product/${encodeURIComponent(p.slug)}`} className={`block group transition-all duration-700 ${productsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="card-hover bg-surface rounded-xl border border-border dark:ring-1 dark:ring-white/5 overflow-hidden">
                    <div className="aspect-square bg-bg dark:bg-surface dark:ring-1 dark:ring-white/10 overflow-hidden">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover dark:ring-1 dark:ring-white/10 dark:bg-surface group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-secondary text-xs">No image</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-sm text-text-primary group-hover:text-accent transition-colors line-clamp-2">{p.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="price-tag text-base">৳{(p.discountPrice || p.price).toLocaleString()}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${p.stock > 0 ? 'bg-mint-confirm/10 text-mint-confirm' : 'bg-red-50 text-red-500'}`}>
                          {p.stock > 0 ? 'In Stock' : 'Sold Out'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8 sm:hidden">
              <Link to="/shop" className="btn-primary text-sm">View All Products</Link>
          </div>
        </div>
      </section>
      )}

      <section ref={ctaRef} className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          <div className={`card-hover relative overflow-hidden bg-gradient-to-br from-accent/5 to-indigo-50 dark:from-accent/10 dark:to-gray-800 rounded-2xl p-8 md:p-10 border border-accent/10 dark:border-accent/20 transition-all duration-700 ${ctaInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/[0.03] rounded-full translate-y-1/2 -translate-x-1/4" />
            <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-3 relative">Free Diagnostic Check</h2>
            <p className="text-text-secondary mb-6 relative text-sm leading-relaxed max-w-md">Bring in your device for a free diagnostic — no obligation, no charge. We'll tell you exactly what's wrong and what it costs to fix it.</p>
            <Link to="/repair-services" className="btn-primary !w-auto inline-flex text-sm">
              Book Now
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
          <div className={`card-hover relative overflow-hidden bg-gradient-to-br from-repair-amber/5 to-amber-50 dark:from-repair-amber/10 dark:to-gray-800 rounded-2xl p-8 md:p-10 border border-repair-amber/10 dark:border-repair-amber/20 transition-all duration-700 ${ctaInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="absolute top-0 right-0 w-48 h-48 bg-repair-amber/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-repair-amber/[0.03] rounded-full translate-y-1/2 -translate-x-1/4" />
            <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-3 relative">Trade In Your Old Phone</h2>
            <p className="text-text-secondary mb-6 relative text-sm leading-relaxed max-w-md">Get credit toward your next purchase or repair. We accept all makes and models — even if they're damaged.</p>
            <Link to="/shop/second-hand" className="btn-primary !w-auto inline-flex text-sm">
              Learn More
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      <section ref={brandsRef} className={`bg-surface/50 py-16 border-y border-border transition-all duration-700 ${brandsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs font-semibold text-text-secondary uppercase tracking-widest mb-8">We Service & Support</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
            {brands.map((b) => (
              <span key={b} className="text-xl font-bold text-text-primary/30 hover:text-text-primary/60 transition-all duration-300 hover:scale-110">{b}</span>
            ))}
          </div>
        </div>
      </section>

      <section ref={testimonialsRef} className={`max-w-7xl mx-auto px-4 py-20 transition-all duration-700 ${testimonialsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-center mb-14">
          <p className="section-subtitle">Testimonials</p>
          <h2 className="section-title text-text-primary mb-4">What Our Customers Say</h2>
          <p className="text-text-secondary text-sm max-w-xl mx-auto leading-relaxed">Real reviews from real people in Pabna and beyond.</p>
        </div>
        {reviews.length === 0 ? (
          <p className="text-center text-text-secondary text-sm">No reviews yet. Be the first to leave one!</p>
        ) : (
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${current * (100 / slidesPerView)}%)` }}
            >
              {reviews.map((r) => (
                <div
                  key={r._id}
                  className="px-3 shrink-0"
                  style={{ width: `${100 / slidesPerView}%` }}
                >
                  <div className="card-hover bg-surface rounded-xl p-6 border border-border h-full">
                    <div className="flex text-repair-amber text-sm mb-3">{'★'.repeat(r.rating)}</div>
                    <p className="text-sm text-text-primary leading-relaxed mb-4">&ldquo;{r.comment}&rdquo;</p>
                    <div className="flex items-center gap-3 mt-auto">
                      {r.user?.photoURL ? (
                        <img src={r.user.photoURL} alt={r.user.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-purple-500 text-white flex items-center justify-center font-display font-bold text-sm shrink-0">
                          {r.user?.name?.split(' ').map(n => n[0]).join('') || '?'}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{r.user?.name || 'Anonymous'}</p>
                        <p className="text-xs text-text-secondary capitalize">{r.targetType} review</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setCurrent(current === 0 ? maxIndex : current - 1)}
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface border border-border shadow-lg flex items-center justify-center text-text-primary hover:text-accent hover:border-accent transition-all z-10 hidden sm:flex"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={() => setCurrent(current === maxIndex ? 0 : current + 1)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface border border-border shadow-lg flex items-center justify-center text-text-primary hover:text-accent hover:border-accent transition-all z-10 hidden sm:flex"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 bg-accent' : 'w-2 bg-border hover:bg-text-secondary'
                }`}
              />
            ))}
          </div>
        </div>
        )}
      </section>

      <section ref={storeRef} className={`relative bg-gradient-to-br from-[#0B1121] to-[#1A1B3A] text-white py-20 transition-all duration-700 ${storeInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-accent)_0%,_transparent_60%)] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 text-center relative">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Visit Our Store</h2>
          <p className="text-text-secondary mb-8 max-w-lg mx-auto">A.K Zaman Plaza, Ataikula, Pabna — Open Saturday–Thursday, 10 AM – 8 PM</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://maps.google.com/?q=A.K+Zaman+Plaza+Ataikula+Pabna" target="_blank" rel="noopener noreferrer" className="btn-primary">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Get Directions
            </a>
            <a href="tel:+8801700000000" className="btn-secondary border-white text-white hover:bg-white hover:text-text-primary">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Call Now
            </a>
          </div>
        </div>
      </section>

      <SocialMediaSection />
      <section ref={whatsappRef} className={`max-w-7xl mx-auto px-4 py-16 transition-all duration-700 ${whatsappInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="bg-gradient-to-br from-accent via-accent-hover to-[#312E81] rounded-2xl p-10 md:p-14 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--color-repair-amber)_0%,_transparent_40%)] opacity-20" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Need Help Right Now?</h2>
            <p className="text-blue-100/80 mb-8 max-w-md mx-auto">Chat with us on WhatsApp — we respond within minutes during business hours.</p>
            <a href="https://wa.me/8801700000000" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-[#128C7E] transition-all duration-200 shadow-lg hover:shadow-[#25D366]/30 hover:-translate-y-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
