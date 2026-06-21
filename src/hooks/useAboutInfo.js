import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export function useAboutInfo() {
  return useQuery({
    queryKey: ['aboutInfo'],
    queryFn: () => api.get('/about-info').then((r) => r.data),
  });
}
