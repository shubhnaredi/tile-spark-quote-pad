
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Customer, Room, TileSelection } from '@/types';

export function useAddCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (customer: Omit<Customer, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('customers')
        .insert(customer)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });
}

export function useAddRoom() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (room: Omit<Room, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('rooms')
        .insert(room)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rooms', variables.customer_id] });
    }
  });
}

export function useAddTileSelection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (selection: Omit<TileSelection, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('tile_selections')
        .insert(selection)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['selections', variables.room_id] });
    }
  });
}

export function useUpdateTileSelection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      ...updates 
    }: Partial<TileSelection> & { id: string }) => {
      const { data, error } = await supabase
        .from('tile_selections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['selections'] });
    }
  });
}
