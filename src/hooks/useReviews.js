import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export function useReviews(targetType, targetId) {
  return useQuery({
    queryKey: ['reviews', targetType, targetId],
    queryFn: () => api.get(`/reviews/${targetType}/${targetId}`).then((r) => r.data),
    enabled: !!targetType && !!targetId,
  });
}

export function useAllReviews() {
  return useQuery({
    queryKey: ['reviews', 'all'],
    queryFn: () => api.get('/reviews/all').then((r) => r.data),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/reviews', data).then((r) => r.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.targetType, variables.targetId] });
    },
  });
}
