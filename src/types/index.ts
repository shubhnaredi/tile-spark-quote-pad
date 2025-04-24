
// Define the types for our app

export interface Tile {
  id: string;
  tileName: string;
  tileSize: string;
  ratePerSqft: number;
  piecesPerBox: number;
  sqftPerBox: number;
  qrCode: string;
  imageURL?: string;
  isActive: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  area: string;
  createdBy: string; // Salesperson ID
  chitPhotoURL?: string;
  totalSqft?: number;
  dateOfVisit: string;
}

export interface Room {
  id: string;
  customerId: string;
  roomName: string;
  totalSqft: number;
  createdBy: string;
  notes?: string;
}

export interface RoomSelection {
  id: string;
  roomId: string;
  tileId: string;
  enteredRate: number;
  calculatedBoxes: number;
  estimatedPrice: number;
  starred: boolean;
  tile?: Tile; // For joined data
}

export interface AdminAdjustment {
  roomSelectionId: string;
  adjustedBoxCount?: number;
  fillerQty?: number;
  transportCharge?: number;
  finalNotes?: string;
  status: 'Draft' | 'Reviewed' | 'Billed';
}

export interface Employee {
  id: string;
  name: string;
  role: 'sales' | 'admin';
  phone?: string;
}

// Mock data for development (in production this would come from Supabase)
export const MOCK_TILES: Tile[] = [
  {
    id: '1',
    tileName: 'Marble Elegance',
    tileSize: '60x60',
    ratePerSqft: 85,
    piecesPerBox: 4,
    sqftPerBox: 16,
    qrCode: 'ME6060',
    imageURL: 'https://via.placeholder.com/100?text=Marble',
    isActive: true
  },
  {
    id: '2',
    tileName: 'Wood Finish',
    tileSize: '20x120',
    ratePerSqft: 120,
    piecesPerBox: 6,
    sqftPerBox: 15.5,
    qrCode: 'WF20120',
    imageURL: 'https://via.placeholder.com/100?text=Wood',
    isActive: true
  },
  {
    id: '3',
    tileName: 'Modern Grey',
    tileSize: '60x120',
    ratePerSqft: 135,
    piecesPerBox: 2,
    sqftPerBox: 15.5,
    qrCode: 'MG60120',
    imageURL: 'https://via.placeholder.com/100?text=Grey',
    isActive: true
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    phone: '9876543210',
    area: 'Vijay Nagar',
    createdBy: '1', // Shubh
    totalSqft: 1200,
    dateOfVisit: '2025-04-20',
  },
  {
    id: '2',
    name: 'Priya Patel',
    phone: '9876543211',
    area: 'Scheme 54',
    createdBy: '1', // Shubh
    totalSqft: 950,
    dateOfVisit: '2025-04-22',
  }
];
