
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from '@/components/ui/separator';
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Customer, TileSelection } from '@/types';
import { Search, Star, Clipboard, Truck, Check, X, Phone } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import { useCustomers, useCustomerRooms, useRoomSelections } from '@/hooks/useSupabaseQuery';
import { useUpdateTileSelection } from '@/hooks/useSupabaseMutation';

interface AdminAdjustmentFormProps {
  selection: TileSelection;
}

function AdminAdjustmentForm({ selection }: AdminAdjustmentFormProps) {
  const [adjustedBoxes, setAdjustedBoxes] = useState<number>(selection.admin_adjusted_boxes || 
    Math.ceil(selection.sqft_required / (selection.tile?.sqft_per_box || 1)));
  const [fillerQty, setFillerQty] = useState<number>(selection.filler_quantity || 0);
  const [transport, setTransport] = useState<number>(selection.transport_charge || 0);
  const [notes, setNotes] = useState<string>(selection.admin_notes || '');
  const [status, setStatus] = useState<'Draft' | 'Reviewed' | 'Billed'>(
    selection.status as 'Draft' | 'Reviewed' | 'Billed'
  );
  const { toast } = useToast();
  const updateSelection = useUpdateTileSelection();

  const handleSave = () => {
    updateSelection.mutate({
      id: selection.id,
      admin_adjusted_boxes: adjustedBoxes,
      filler_quantity: fillerQty,
      transport_charge: transport,
      admin_notes: notes,
      status: status
    }, {
      onSuccess: () => {
        toast({
          title: "Changes Saved",
          description: `Adjustments for ${selection.tile?.tile_name} have been saved.`
        });
      },
      onError: (error) => {
        toast({
          title: "Error Saving Changes",
          description: error.message || "An error occurred while saving changes.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <Card className="mb-6 border-2 border-primary-100">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium flex items-center">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
              {selection.tile?.tile_name}
            </h3>
            <p className="text-sm text-gray-500">
              {selection.tile?.size} cm • Original calculation: {Math.ceil(selection.sqft_required / (selection.tile?.sqft_per_box || 1))} boxes
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
  const { data: customers = [], isLoading: isLoadingCustomers } = useCustomers();
  const { data: rooms = [] } = useCustomerRooms(selectedCustomer?.id || '');
  const roomIds = rooms.map(room => room.id);
  
  // This is a simplification - in a real app, you would fetch selections for each room
  const [activeRoomId, setActiveRoomId] = useState<string>('');
  const { data: selections = [] } = useRoomSelections(activeRoomId);

  const handleCustomerSelect = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    setSelectedCustomer(customer || null);
    
    // Reset room selections when changing customer
    setActiveRoomId('');
  };
  
  // Filtered customers based on search
  const filteredCustomers = searchQuery.trim() === '' 
    ? customers 
    : customers.filter(customer => 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        customer.phone.includes(searchQuery)
      );

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
            {isLoadingCustomers ? (
              <div className="text-center py-8 text-gray-500">
                Loading customers...
              </div>
            ) : filteredCustomers.length === 0 ? (
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
                  <p className="text-gray-600">{new Date(selectedCustomer.visit_date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <Separator className="my-6" />

              {rooms.length > 0 && (
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Select Room</label>
                  <Select
                    value={activeRoomId}
                    onValueChange={setActiveRoomId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a room" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map(room => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.room_name} ({room.total_sqft} sq.ft)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <h3 className="font-medium mb-4">Starred Selections</h3>
              
              {!activeRoomId ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <div className="text-gray-500">Select a room to view selections</div>
                </div>
              ) : selections.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <div className="text-gray-500">No selections for this room</div>
                </div>
              ) : (
                selections.filter(s => s.is_final_choice).map(selection => (
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
