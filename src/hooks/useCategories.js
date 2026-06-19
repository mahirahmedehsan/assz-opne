import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export function useCategories(type) {
  const params = type ? `?type=${type}` : '';
  return useQuery({
    queryKey: ['categories', type],
    queryFn: () => api.get(`/categories${params}`).then((r) => r.data),
  });
}

export function useRepairServices(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v) params.set(k, v);
  });
  const qs = params.toString();
  return useQuery({
    queryKey: ['repairServices', filters],
    queryFn: () => api.get(`/repair-services${qs ? `?${qs}` : ''}`).then((r) => r.data),
  });
}
