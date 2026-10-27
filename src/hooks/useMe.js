import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function useMe() {
  return useQuery({ queryKey: ['me'], retry: false, queryFn: async () => {
    try { return (await base44.auth.isAuthenticated()) ? await base44.auth.me() : null; }
    catch (error) { if ((error.status || error.response?.status) === 401) return null; throw error; }
  } });
}

export const ticketCode = () => Math.random().toString(36).slice(2, 10).toUpperCase();