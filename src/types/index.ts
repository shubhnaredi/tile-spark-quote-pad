
export interface Salesperson {
  id: string;
  name: string;
  email: string;
  created_at?: string;
}

export interface Tile {
  id: string;
  tile_name: string;
  size: string;
  pieces_per_box: number;
  sqft_per_box: number;
  barcode: string;
  image_url?: string;
  is_active: boolean;
  created_at?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  area: string;
  has_chit_photo: boolean;
  chit_image_url?: string;
  salesperson_id: string;
  visit_date: string;
  created_at?: string;
}

export interface Room {
  id: string;
  customer_id: string;
  room_name: string;
  total_sqft: number;
  notes?: string;
  created_at?: string;
}

export interface TileSelection {
  id: string;
  room_id: string;
  tile_id: string;
  sqft_required: number;
  price_per_sqft?: number;
  is_final_choice: boolean;
  admin_adjusted_boxes?: number;
  filler_quantity: number;
  transport_charge: number;
  admin_notes?: string;
  status: 'Draft' | 'Reviewed' | 'Billed';
  created_at?: string;
  // Joined fields
  tile?: Tile;
}

// Helper functions for data management
export async function fetchCustomers(supabase: any) {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function fetchCustomerRooms(supabase: any, customerId: string) {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function fetchRoomSelections(supabase: any, roomId: string) {
  const { data, error } = await supabase
    .from('tile_selections')
    .select(`
      *,
      tile:tiles (*)
    `)
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function fetchTiles(supabase: any) {
  const { data, error } = await supabase
    .from('tiles')
    .select('*')
    .eq('is_active', true)
    .order('tile_name', { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function fetchTileByBarcode(supabase: any, barcode: string) {
  const { data, error } = await supabase
    .from('tiles')
    .select('*')
    .eq('barcode', barcode)
    .eq('is_active', true)
    .single();
  
  if (error) throw error;
  return data;
}
