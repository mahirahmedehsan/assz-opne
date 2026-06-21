import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export function useContactInfo() {
  return useQuery({
    queryKey: ['contactInfo'],
    queryFn: () => api.get('/contact-info').then((r) => r.data),
  });
}
