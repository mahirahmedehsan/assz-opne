import { useState, useEffect } from 'react';
import api from '../services/api';

const platformConfig = {
  youtube: { label: 'YouTube', color: 'bg-red-500/10 text-red-500', icon: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z' },
  tiktok: { label: 'TikTok', color: 'bg-pink-500/10 text-pink-500', icon: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.9 2.89 2.89 0 01-2.88-2.89 2.89 2.89 0 012.88-2.89c.46 0 .9.12 1.29.32V8.27a6.31 6.31 0 00-1.29-.16 6.32 6.32 0 00-6.32 6.32 6.32 6.32 0 006.32 6.32 6.32 6.32 0 006.32-6.32V7.1a8.27 8.27 0 004.53 2.59v-3.3z' },
  instagram: { label: 'Instagram', color: 'bg-purple-500/10 text-purple-500', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
  facebook: { label: 'Facebook', color: 'bg-blue-500/10 text-blue-500', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
};

export default function SocialMedia() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/social-media')
      .then((res) => setVideos(res.data.videos))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-3">Social Media</h1>
        <p className="text-text-secondary text-sm max-w-xl mx-auto">
          Follow us on YouTube, TikTok, Instagram, and Facebook for the latest tips, repairs, and tech content.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-xl border border-border overflow-hidden animate-pulse">
              <div className="aspect-[9/16] bg-bg" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-bg rounded w-3/4" />
                <div className="h-3 bg-bg rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">No Videos Yet</h2>
          <p className="text-text-secondary text-sm">Check back soon for new content!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => {
            const platform = platformConfig[video.platform] || platformConfig.youtube;
            return (
              <div key={video._id} className="group bg-surface rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-accent/30 transition-all duration-300">
                <div className="relative aspect-[9/16] bg-bg overflow-hidden">
                  <iframe
                    src={video.embedUrl}
                    title={video.title || 'Social Media Video'}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${platform.color}`}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d={platform.icon} /></svg>
                      {platform.label}
                    </span>
                    {video.isFeatured && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent">Featured</span>
                    )}
                  </div>
                  {video.title && (
                    <h3 className="font-semibold text-sm text-text-primary line-clamp-2">{video.title}</h3>
                  )}
                  {video.description && (
                    <p className="text-xs text-text-secondary mt-1 line-clamp-2">{video.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
