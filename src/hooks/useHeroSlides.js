import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export function useHeroSlides() {
  return useQuery({
    queryKey: ['hero-slides', 'active'],
    queryFn: () => api.get('/hero-slides/active').then((r) => r.data),
  });
}

export function useAdminHeroSlides() {
  return useQuery({
    queryKey: ['hero-slides', 'admin'],
    queryFn: () => api.get('/hero-slides/admin').then((r) => r.data),
  });
}

export function useCreateHeroSlide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/hero-slides', data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
    },
  });
}

export function useUpdateHeroSlide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.put(`/hero-slides/${id}`, data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
    },
  });
}

export function useDeleteHeroSlide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/hero-slides/${id}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
    },
  });
}

export function useReorderHeroSlides() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids) => api.put('/hero-slides/reorder', { ids }).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
    },
  });
}
