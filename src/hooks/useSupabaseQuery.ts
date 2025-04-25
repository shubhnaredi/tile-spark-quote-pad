
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  fetchCustomers, 
  fetchCustomerRooms, 
  fetchRoomSelections,
  fetchTiles,
  fetchTileByBarcode
} from '@/types';

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: () => fetchCustomers(supabase)
  });
}

export function useCustomerRooms(customerId: string) {
  return useQuery({
    queryKey: ['rooms', customerId],
    queryFn: () => fetchCustomerRooms(supabase, customerId),
    enabled: !!customerId
  });
}

export function useRoomSelections(roomId: string) {
  return useQuery({
    queryKey: ['selections', roomId],
    queryFn: () => fetchRoomSelections(supabase, roomId),
    enabled: !!roomId
  });
}

export function useTiles() {
  return useQuery({
    queryKey: ['tiles'],
    queryFn: () => fetchTiles(supabase)
  });
}

export function useTileByBarcode(barcode: string) {
  return useQuery({
    queryKey: ['tile', barcode],
    queryFn: () => fetchTileByBarcode(supabase, barcode),
    enabled: !!barcode
  });
}
