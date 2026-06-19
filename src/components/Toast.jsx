import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'success', duration = 3000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, type: 'confirm', onResolve: resolve }]);
    });
  }, []);

  const handleConfirm = (id, value) => {
    setToasts((prev) => {
      const t = prev.find((t) => t.id === id);
      if (t?.onResolve) t.onResolve(value);
      return prev.filter((t) => t.id !== id);
    });
  };

  return (
    <ToastContext.Provider value={{ toast, confirm }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.filter((t) => t.type !== 'confirm').map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-slide-up backdrop-blur-sm ${
              t.type === 'success'
                ? 'bg-emerald-600/90 text-white'
                : t.type === 'error'
                ? 'bg-red-600/90 text-white'
                : 'bg-surface/90 text-text-primary border border-border'
            }`}
          >
            <div className="flex items-center gap-2">
              {t.type === 'success' && (
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              )}
              {t.type === 'error' && (
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
              {t.message}
            </div>
          </div>
        ))}
      </div>
      {toasts.filter((t) => t.type === 'confirm').map((t) => (
        <div key={t.id} className="fixed inset-0 z-[101] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 border border-border">
            <p className="text-sm text-text-primary mb-5">{t.message}</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => handleConfirm(t.id, false)} className="btn-secondary text-xs !px-4 !py-2">Cancel</button>
              <button onClick={() => handleConfirm(t.id, true)} className="btn-primary text-xs !px-4 !py-2">Confirm</button>
            </div>
          </div>
        </div>
      ))}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
