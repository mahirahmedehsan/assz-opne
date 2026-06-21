import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Loader from './components/Loader';

const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const RepairServices = lazy(() => import('./pages/RepairServices'));
const TrackRepair = lazy(() => import('./pages/TrackRepair'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Account = lazy(() => import('./pages/Account'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const SocialMedia = lazy(() => import('./pages/SocialMedia'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const location = useLocation();
  const hideHeader = location.pathname.startsWith('/admin');
  const hideFooter = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeader && <Header />}
      <main className="flex-1">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:category" element={<CategoryPage />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/repair-services" element={<RepairServices />} />
            <Route path="/book-repair" element={<Navigate to="/repair-services#book-repair" replace />} />
            <Route path="/track-repair/:ticketId" element={<TrackRepair />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/:id" element={<OrderConfirmation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/social-media" element={<SocialMedia />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!hideFooter && <Footer />}
      <FloatingWhatsApp />
    </div>
  );
}

export default App;
