import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export function useProducts(params = {}) {
  const queryString = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') queryString.set(k, v);
  });

  return useQuery({
    queryKey: ['products', params],
    queryFn: () => api.get(`/products?${queryString.toString()}`).then((r) => r.data),
  });
}

export function useProduct(slug) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/${slug}`).then((r) => r.data),
    enabled: !!slug,
  });
}
