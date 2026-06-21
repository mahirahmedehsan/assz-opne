import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useCategories } from '../hooks/useCategories';

const announcements = [
  { text: '🎉 Free diagnostic on all repairs — book now!', link: '/repair-services' },
  { text: '📦 Free shipping on orders over ৳1,500', link: '/shop' },
  { text: '🔧 90-day warranty on every repair', link: '/repair-services' },
  { text: '💳 Cash on delivery available nationwide', link: '/shop' },
];

function getInitial(name) {
  if (!name) return '?';
  const s = name.trim();
  const cp = s.codePointAt(0);
  if (!cp) return '?';
  const firstIsLetter = /^\p{L}$/u.test(String.fromCodePoint(cp));
  if (!firstIsLetter) return s.length > 2 ? s.slice(0, 2) : s;
  const parts = s.split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return parts.slice(0, 2).map(p => p[0].toUpperCase()).join('');
}

function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [isPaused]);

  const prevSlide = () => setCurrent((prev) => (prev - 1 + announcements.length) % announcements.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % announcements.length);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-accent via-purple-500 to-accent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        <div className="flex items-center justify-between h-9 sm:h-10">
          <button onClick={prevSlide} className="hidden sm:flex items-center justify-center w-6 h-6 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0" aria-label="Previous">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex-1 flex items-center justify-center overflow-hidden mx-2">
            <div className="relative w-full h-9 sm:h-10 flex items-center justify-center">
              {announcements.map((a, i) => (
                <a
                  key={i}
                  href={a.link}
                  className={`absolute inset-0 flex items-center justify-center text-white text-xs sm:text-sm font-medium transition-all duration-500 whitespace-nowrap ${i === current ? 'opacity-100 translate-y-0' : i < current ? 'opacity-0 -translate-y-4' : 'opacity-0 translate-y-4'}`}
                >
                  <span className="truncate max-w-[90vw] sm:max-w-none">{a.text}</span>
                  <svg className="w-3.5 h-3.5 ml-1.5 shrink-0 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </a>
              ))}
            </div>
          </div>
          <button onClick={nextSlide} className="hidden sm:flex items-center justify-center w-6 h-6 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0" aria-label="Next">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <button onClick={() => setIsVisible(false)} className="flex items-center justify-center w-6 h-6 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors shrink-0 ml-1" aria-label="Close">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function DropdownMega({ label, children, align = 'left' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium hover:text-accent hover:bg-accent/5 transition-all"
      >
        {label}
        <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className={`absolute top-full pt-2 ${align === 'right' ? 'right-0' : 'left-0'} z-50`}>
          <div className="bg-surface border border-border rounded-xl shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden animate-fade-in-up">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState(() => {
    const stored = localStorage.getItem('assz_recent_searches');
    return stored ? JSON.parse(stored) : [];
  });
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      onClose();
      setQuery('');
    }
  };

  const saveSearch = (term) => {
    const updated = [term, ...recent.filter((r) => r !== term)].slice(0, 5);
    setRecent(updated);
    localStorage.setItem('assz_recent_searches', JSON.stringify(updated));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface shadow-xl">
        <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
          <form onSubmit={(e) => { handleSubmit(e); saveSearch(query.trim()); }}>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, repairs, accessories..."
                className="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-2xl border-2 border-accent/30 bg-bg text-sm sm:text-base focus:outline-none focus:border-accent transition-colors"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-bg transition-colors">
                  <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          </form>
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">Popular:</span>
            {['iPhone Repair', 'Screen Protector', 'MacBook Battery', 'AirPods'].map((tag) => (
              <button
                key={tag}
                onClick={() => { navigate(`/shop?search=${encodeURIComponent(tag)}`); onClose(); }}
                className="text-xs px-3 py-1.5 rounded-full bg-accent/5 text-accent hover:bg-accent/10 transition-colors font-medium"
              >
                {tag}
              </button>
            ))}
          </div>
          {recent.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">Recent:</span>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {recent.map((r) => (
                  <button
                    key={r}
                    onClick={() => { navigate(`/shop?search=${encodeURIComponent(r)}`); onClose(); }}
                    className="text-xs px-3 py-1.5 rounded-full bg-bg text-text-secondary hover:text-text-primary hover:bg-surface transition-colors border border-border"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1" onClick={onClose} />
    </div>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('assz_dark') === 'true');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: catData } = useCategories('product');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('assz_dark', dark);
  }, [dark]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!userMenuOpen) return;
    const close = (e) => {
      if (!e.target.closest('[data-user-menu]')) setUserMenuOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [userMenuOpen]);

  useEffect(() => {
    const id = setTimeout(() => setMenuOpen(false), 0);
    return () => clearTimeout(id);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const categories = catData?.categories || [];

  return (
    <>
      <AnnouncementBar />
      <header
        className={`bg-white dark:bg-[#0F1123] border-b border-border sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-lg shadow-black/5 dark:shadow-black/20' : 'shadow-none'}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 sm:h-[72px]">
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-sm group-hover:shadow-md transition-shadow">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-display text-lg sm:text-xl font-bold text-text-primary group-hover:text-accent transition-colors leading-none">
                  ASSZ
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono text-text-secondary font-normal tracking-[0.15em] uppercase leading-tight mt-0.5">
                  Apple Service Zone
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              <DropdownMega label="Shop">
                <div className="p-5 w-[500px] max-w-[90vw]">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest mb-3">Categories</p>
                      <div className="space-y-1">
                        {categories.slice(0, 8).map((c) => (
                          <Link key={c._id} to={`/shop/${c.slug}`} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-primary hover:bg-accent/5 hover:text-accent transition-all group/drop">
                            {c.icon && <span className="text-base">{c.icon}</span>}
                            <span>{c.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest mb-3">Quick Links</p>
                        <div className="space-y-1">
                          <Link to="/shop" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-primary hover:bg-accent/5 hover:text-accent transition-all">All Products</Link>
                          <Link to="/shop?sort=newest" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-primary hover:bg-accent/5 hover:text-accent transition-all">New Arrivals</Link>
                          <Link to="/shop?sort=popular" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-primary hover:bg-accent/5 hover:text-accent transition-all">Best Sellers</Link>
                          <Link to="/shop?discount=true" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-primary hover:bg-accent/5 hover:text-accent transition-all">Sale Items</Link>
                        </div>
                      </div>
                      <Link to="/shop" className="mt-4 flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-accent/10 to-purple-500/10 border border-accent/20 text-sm font-medium text-accent hover:from-accent/20 hover:to-purple-500/20 transition-all group/drop">
                        <span>Browse All Products</span>
                        <svg className="w-4 h-4 group-hover/drop:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </DropdownMega>

              <DropdownMega label="Repair">
                <div className="p-5 w-[320px] max-w-[90vw]">
                  <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest mb-3">Repair Services</p>
                  <div className="space-y-1">
                    <Link to="/repair-services" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-primary hover:bg-accent/5 hover:text-accent transition-all group/drop">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg></div>
                      <div><p className="font-medium">All Services</p><p className="text-xs text-text-secondary">Browse our full service catalog</p></div>
                    </Link>
                    <Link to="/repair-services#book-repair" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-primary hover:bg-accent/5 hover:text-accent transition-all group/drop">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                      <div><p className="font-medium">Book a Repair</p><p className="text-xs text-text-secondary">Schedule your device repair</p></div>
                    </Link>
                    <Link to="/track-repair" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-primary hover:bg-accent/5 hover:text-accent transition-all group/drop">
                      <div className="w-8 h-8 rounded-lg bg-mint-confirm/10 flex items-center justify-center text-mint-confirm shrink-0"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg></div>
                      <div><p className="font-medium">Track Repair</p><p className="text-xs text-text-secondary">Check your repair status</p></div>
                    </Link>
                  </div>
                  <Link to="/repair-services" className="mt-3 flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-accent/10 border border-amber-500/20 text-sm font-medium text-amber-600 hover:from-amber-500/20 hover:to-accent/20 transition-all group/drop">
                    <span>Free Diagnostic Available</span>
                    <svg className="w-4 h-4 group-hover/drop:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </DropdownMega>

              <Link to="/about" className="px-3 py-2 rounded-lg text-sm font-medium hover:text-accent hover:bg-accent/5 transition-all">About</Link>
              <Link to="/contact" className="px-3 py-2 rounded-lg text-sm font-medium hover:text-accent hover:bg-accent/5 transition-all">Contact</Link>
            </nav>

            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                onClick={() => setDark(!dark)}
                className="p-2 sm:p-2.5 rounded-xl hover:bg-accent/5 text-text-secondary hover:text-accent transition-all"
                aria-label={dark ? 'Light mode' : 'Dark mode'}
              >
                {dark ? (
                  <svg className="w-[18px] h-[18px] sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg className="w-[18px] h-[18px] sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </button>

              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 sm:p-2.5 rounded-xl hover:bg-accent/5 text-text-secondary hover:text-accent transition-all"
                aria-label="Search"
              >
                <svg className="w-[18px] h-[18px] sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              <a href="tel:+8801700000000" className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-text-secondary hover:text-accent hover:bg-accent/5 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="hidden xl:inline">+880 1700-000000</span>
              </a>

              <Link to="/cart" className="relative p-2 sm:p-2.5 rounded-xl hover:bg-accent/5 text-text-secondary hover:text-accent transition-all" aria-label="Cart">
                <svg className="w-[18px] h-[18px] sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center font-mono ring-2 ring-white dark:ring-[#0F1123]">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative" data-user-menu>
                  <button onClick={() => setUserMenuOpen((v) => !v)} className="p-1.5 sm:p-2 rounded-xl hover:bg-accent/5 transition-all" aria-label="Account">
                    <div className="w-[26px] h-[26px] sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-accent to-purple-500 text-white flex items-center justify-center text-[10px] sm:text-xs font-bold">
                      {getInitial(user.dbUser?.name || user.displayName || user.email || 'U')}
                    </div>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-60 bg-surface border border-border rounded-xl shadow-2xl shadow-black/5 dark:shadow-black/20 z-50 overflow-hidden animate-fade-in-up">
                      <div className="p-4 border-b border-border bg-gradient-to-r from-accent/5 to-purple-500/5">
                        <p className="text-sm font-semibold text-text-primary truncate">{user.dbUser?.name || user.displayName || 'User'}</p>
                        <p className="text-xs text-text-secondary truncate mt-0.5">{user.email}</p>
                      </div>
                      <div className="py-1.5">
                        <Link to="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent/5 transition-colors">
                          <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          My Account
                        </Link>
                        <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent/5 transition-colors">
                          <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                          My Orders
                        </Link>
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent/5 transition-colors">
                          <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          Admin Dashboard
                        </Link>
                        <div className="border-t border-border my-1.5 mx-3" />
                        <button onClick={() => { handleLogout(); setUserMenuOpen(false); }} className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="btn-primary text-xs sm:text-sm py-2 sm:py-2.5 px-3 sm:px-5 !rounded-xl !shadow-sm whitespace-nowrap">
                  Sign In
                </Link>
              )}

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 sm:p-2.5 rounded-xl hover:bg-accent/5 text-text-secondary hover:text-accent transition-all"
                aria-label="Menu"
              >
                <svg className="w-[18px] h-[18px] sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-[300px] max-w-[85vw] bg-surface shadow-2xl overflow-y-auto animate-slide-in-right">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-display text-base font-bold text-text-primary">Menu</span>
                <button onClick={() => setMenuOpen(false)} className="p-2 rounded-xl hover:bg-accent/5 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="py-2">
                <div className="px-4 py-2">
                  <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest mb-2">Shop</p>
                  <div className="space-y-0.5">
                    {categories.slice(0, 6).map((c) => (
                      <Link key={c._id} to={`/shop/${c.slug}`} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-accent/5 transition-colors">
                        {c.icon && <span className="text-base">{c.icon}</span>}
                        <span>{c.name}</span>
                      </Link>
                    ))}
                    <Link to="/shop" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-accent hover:bg-accent/5 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      All Products
                    </Link>
                  </div>
                </div>
                <div className="border-t border-border mx-4 my-2" />
                <div className="px-4 py-2">
                  <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest mb-2">Repair</p>
                  <div className="space-y-0.5">
                    <Link to="/repair-services" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-accent/5 transition-colors">
                      <div className="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center text-amber-500"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg></div>
                      All Services
                    </Link>
                    <Link to="/repair-services#book-repair" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-accent/5 transition-colors">
                      <div className="w-6 h-6 rounded bg-accent/10 flex items-center justify-center text-accent"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                      Book a Repair
                    </Link>
                    <Link to="/track-repair" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-accent/5 transition-colors">
                      <div className="w-6 h-6 rounded bg-mint-confirm/10 flex items-center justify-center text-mint-confirm"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg></div>
                      Track Repair
                    </Link>
                  </div>
                </div>
                <div className="border-t border-border mx-4 my-2" />
                <div className="px-4 py-2">
                  <Link to="/about" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-accent/5 transition-colors">
                    <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    About
                  </Link>
                  <Link to="/contact" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-accent/5 transition-colors">
                    <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Contact
                  </Link>
                </div>
                <div className="border-t border-border mx-4 my-2" />
                <div className="px-4 py-2">
                  <a href="tel:+8801700000000" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-accent/5 transition-colors">
                    <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    +880 1700-000000
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
