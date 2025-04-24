
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from '@/components/ui/separator';
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Customer, MOCK_CUSTOMERS, Room, RoomSelection } from '@/types';
import { Search, Star, Clipboard, Truck, Check, X } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';

// Mock data for demonstration
const MOCK_ROOMS: Room[] = [
  {
    id: '1',
    customerId: '1',
    roomName: 'Master Bedroom',
    totalSqft: 180,
    createdBy: '1',
  },
  {
    id: '2',
    customerId: '1',
    roomName: 'Kitchen',
    totalSqft: 120,
    createdBy: '1',
  }
];

const MOCK_SELECTIONS: RoomSelection[] = [
  {
    id: '1',
    roomId: '1',
    tileId: '1',
    enteredRate: 85,
    calculatedBoxes: 12,
    estimatedPrice: 16320,
    starred: true,
    tile: {
      id: '1',
      tileName: 'Marble Elegance',
      tileSize: '60x60',
      ratePerSqft: 85,
      piecesPerBox: 4,
      sqftPerBox: 16,
      qrCode: 'ME6060',
      imageURL: 'https://via.placeholder.com/100?text=Marble',
      isActive: true
    }
  },
  {
    id: '2',
    roomId: '2',
    tileId: '3',
    enteredRate: 135,
    calculatedBoxes: 8,
    estimatedPrice: 16740,
    starred: true,
    tile: {
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
  }
];

interface AdminAdjustmentFormProps {
  selection: RoomSelection;
}

function AdminAdjustmentForm({ selection }: AdminAdjustmentFormProps) {
  const [adjustedBoxes, setAdjustedBoxes] = useState<number>(selection.calculatedBoxes);
  const [fillerQty, setFillerQty] = useState<number>(0);
  const [transport, setTransport] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [status, setStatus] = useState<'Draft' | 'Reviewed' | 'Billed'>('Draft');
  const { toast } = useToast();

  const handleSave = () => {
    // In production, this would save to Supabase
    toast({
      title: "Changes Saved",
      description: `Adjustments for ${selection.tile?.tileName} have been saved.`
    });
  };

  return (
    <Card className="mb-6 border-2 border-primary-100">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium flex items-center">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
              {selection.tile?.tileName}
            </h3>
            <p className="text-sm text-gray-500">
              {selection.tile?.tileSize} cm • Original calculation: {selection.calculatedBoxes} boxes
            </p>
          </div>
          <Badge 
            variant={
              status === 'Billed' ? 'default' : 
              status === 'Reviewed' ? 'secondary' : 'outline'
            }
          >
            {status}
          </Badge>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Adjusted Box Count
            </label>
            <Input 
              type="number"
              value={adjustedBoxes}
              onChange={(e) => setAdjustedBoxes(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Filler Quantity
            </label>
            <Input 
              type="number"
              value={fillerQty}
              onChange={(e) => setFillerQty(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Transport (₹)
            </label>
            <Input 
              type="number"
              value={transport}
              onChange={(e) => setTransport(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Status
            </label>
            <Select 
              value={status} 
              onValueChange={(value) => setStatus(value as 'Draft' | 'Reviewed' | 'Billed')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Reviewed">Reviewed</SelectItem>
                <SelectItem value="Billed">Billed via Sleek Bill</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block">
            Admin Notes
          </label>
          <Textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any special instructions or notes here..."
            className="min-h-[100px]"
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-primary">
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleCustomerSelect = (customerId: string) => {
    const customer = MOCK_CUSTOMERS.find(c => c.id === customerId);
    setSelectedCustomer(customer || null);
  };
  
  // Filtered customers based on search
  const filteredCustomers = searchQuery.trim() === '' 
    ? MOCK_CUSTOMERS 
    : MOCK_CUSTOMERS.filter(customer => 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        customer.phone.includes(searchQuery)
      );

  // Get selections for the selected customer
  const getSelectionsForCustomer = () => {
    if (!selectedCustomer) return [];
    
    // In a real app, we would filter based on the customer ID
    // Here we're just returning mock data
    return MOCK_SELECTIONS;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-primary">Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Search customers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No customers found
              </div>
            ) : (
              filteredCustomers.map(customer => (
                <Button
                  key={customer.id}
                  variant={selectedCustomer?.id === customer.id ? "secondary" : "outline"}
                  className="w-full justify-start h-auto py-3 px-4"
                  onClick={() => handleCustomerSelect(customer.id)}
                >
                  <div className="text-left">
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      {customer.phone}
                    </div>
                  </div>
                </Button>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-primary">
            {selectedCustomer ? `${selectedCustomer.name}'s Selections` : 'Select a Customer'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedCustomer ? (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-gray-600">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Area</p>
                  <p className="text-gray-600">{selectedCustomer.area}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Visit Date</p>
                  <p className="text-gray-600">{new Date(selectedCustomer.dateOfVisit).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Area</p>
                  <p className="text-gray-600">{selectedCustomer.totalSqft || 'Not specified'} sq.ft</p>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <h3 className="font-medium mb-4">Starred Selections</h3>
              
              {getSelectionsForCustomer().length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <div className="text-gray-500">No starred selections</div>
                </div>
              ) : (
                getSelectionsForCustomer().map(selection => (
                  <AdminAdjustmentForm key={selection.id} selection={selection} />
                ))
              )}
              
              <div className="mt-6 flex justify-between">
                <Button variant="outline">
                  <Clipboard className="mr-2 h-4 w-4" />
                  Preview Estimates
                </Button>
                
                <Button className="bg-primary">
                  <Check className="mr-2 h-4 w-4" />
                  Mark All as Billed
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Select a customer to view and edit their selections
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
