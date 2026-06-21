import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export function useRepairPageInfo() {
  return useQuery({
    queryKey: ['repairPageInfo'],
    queryFn: () => api.get('/repair-page-info').then((r) => r.data),
  });
}
