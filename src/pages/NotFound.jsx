import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="text-8xl font-display font-bold text-text-secondary/20 mb-4">404</div>
      <div className="mb-6">
        <svg className="w-24 h-24 text-text-secondary/30 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="font-display text-3xl font-bold text-text-primary mb-4">Page Not Found</h1>
      <p className="text-text-secondary mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved. Maybe you mistyped the URL?
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/" className="btn-primary">Go Home</Link>
        <Link to="/shop" className="btn-secondary">Browse Shop</Link>
      </div>
    </div>
  );
}
