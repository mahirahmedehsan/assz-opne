import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';

export function useCreateBooking() {
  return useMutation({
    mutationFn: (bookingData) => api.post('/repair-bookings', bookingData).then((r) => r.data),
  });
}

export function useCreateGuestBooking() {
  return useMutation({
    mutationFn: (bookingData) => api.post('/repair-bookings/guest', bookingData).then((r) => r.data),
  });
}

export function useTrackBooking(ticketId, phone) {
  const params = phone ? `?phone=${encodeURIComponent(phone)}` : '';
  return useQuery({
    queryKey: ['trackBooking', ticketId, phone],
    queryFn: () => api.get(`/repair-bookings/${ticketId}${params}`).then((r) => r.data),
    enabled: !!ticketId,
  });
}
