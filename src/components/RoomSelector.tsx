
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import { Star, Scan, Plus, X } from "lucide-react";
import { QRScanner } from './QRScanner';
import { Tile, MOCK_TILES } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface RoomProps {
  roomName: string;
  sqft: number;
  onAddTile: () => void;
}

export function RoomTileSelector({ roomName, sqft, onAddTile }: RoomProps) {
  const [tileSelections, setTileSelections] = useState<{
    tile: Tile;
    starred: boolean;
    enteredRate?: number;
  }[]>([]);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedTiles, setSelectedTiles] = useState<Tile[]>([]);
  const { toast } = useToast();
  const { currentUser, isAdmin } = useAuth();
  
  const handleScanSuccess = (qrCode: string) => {
    setScannerOpen(false);
    
    // Find tile by QR code
    const tile = MOCK_TILES.find(t => t.qrCode === qrCode && t.isActive);
    
    if (tile) {
      addTileSelection(tile);
    } else {
      toast({
        title: "Tile Not Found",
        description: "No matching tile found for this QR code. Please try again or enter manually.",
        variant: "destructive"
      });
    }
  };

  const addTileSelection = (tile: Tile) => {
    setTileSelections(prev => [
      ...prev, 
      { 
        tile, 
        starred: false,
        enteredRate: isAdmin() ? tile.ratePerSqft : undefined 
      }
    ]);
    toast({
      title: "Tile Added",
      description: `${tile.tileName} (${tile.tileSize}) added to ${roomName}.`
    });
  };

  const handleManualSelect = (tile: Tile) => {
    addTileSelection(tile);
    setSelectedTiles([]);
  };

  const toggleStarred = (index: number) => {
    setTileSelections(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, starred: !item.starred } : item
      )
    );
  };

  const removeTile = (index: number) => {
    setTileSelections(prev => prev.filter((_, i) => i !== index));
  };

  const updateEnteredRate = (index: number, rate: number) => {
    if (isAdmin()) {
      setTileSelections(prev => 
        prev.map((item, i) => 
          i === index ? { ...item, enteredRate: rate } : item
        )
      );
    }
  };

  const calculateBoxes = (tileSqftPerBox: number) => {
    return Math.ceil(sqft / tileSqftPerBox);
  };

  const calculatePrice = (boxes: number, rate: number, sqftPerBox: number) => {
    return boxes * rate * sqftPerBox;
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">{roomName}</h3>
          <span className="text-sm bg-secondary-100 text-secondary-800 px-2 py-1 rounded">
            {sqft} sq.ft.
          </span>
        </div>

        <Separator className="my-4" />
        
        {tileSelections.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No tiles selected for this room</p>
            <div className="flex gap-2 justify-center">
              {/* QR Scan Button */}
              <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Scan className="mr-2 h-4 w-4" />
                    Scan QR Code
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Scan Tile QR Code</DialogTitle>
                  </DialogHeader>
                  <QRScanner 
                    onScanSuccess={handleScanSuccess} 
                    onClose={() => setScannerOpen(false)}
                  />
                </DialogContent>
              </Dialog>

              {/* Manual Select Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Manual Select</Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle>Select Tile</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-2 mt-4">
                    {MOCK_TILES.filter(t => t.isActive).map((tile) => (
                      <Button 
                        key={tile.id} 
                        variant="outline" 
                        className="justify-start h-auto py-3"
                        onClick={() => handleManualSelect(tile)}
                      >
                        <div className="flex items-center w-full">
                          {tile.imageURL && (
                            <img 
                              src={tile.imageURL} 
                              alt={tile.tileName} 
                              className="w-10 h-10 object-cover rounded mr-3"
                            />
                          )}
                          <div className="text-left">
                            <p className="font-medium">{tile.tileName}</p>
                            <p className="text-xs text-gray-500">{tile.tileSize} cm • {tile.sqftPerBox} sq.ft/box</p>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {tileSelections.map((selection, index) => (
              <div key={index} className="border rounded-lg p-3 relative">
                <button 
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                  onClick={() => removeTile(index)}
                >
                  <X size={18} />
                </button>
                
                <div className="flex items-start gap-3 mb-3">
                  {selection.tile.imageURL && (
                    <img 
                      src={selection.tile.imageURL} 
                      alt={selection.tile.tileName} 
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{selection.tile.tileName}</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={cn(
                          "h-8 w-8 p-0", 
                          selection.starred ? "text-yellow-500" : "text-gray-300"
                        )}
                        onClick={() => toggleStarred(index)}
                      >
                        <Star className="h-5 w-5 fill-current" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      {selection.tile.tileSize} cm • {selection.tile.sqftPerBox} sq.ft/box
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {isAdmin() && (
                    <div>
                      <Label htmlFor={`rate-${index}`} className="text-xs">
                        Rate (₹/sq.ft)
                      </Label>
                      <Input 
                        id={`rate-${index}`}
                        type="number" 
                        value={selection.enteredRate || ''}
                        onChange={(e) => updateEnteredRate(index, Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label className="text-xs">Estimated Boxes</Label>
                    <div className="mt-1 font-medium">
                      {calculateBoxes(selection.tile.sqftPerBox)}
                    </div>
                  </div>
                  
                  {selection.enteredRate && (
                    <div className="col-span-2">
                      <Label className="text-xs">Estimated Price (₹)</Label>
                      <div className="mt-1 font-medium">
                        {new Intl.NumberFormat('en-IN').format(
                          calculatePrice(
                            calculateBoxes(selection.tile.sqftPerBox),
                            selection.enteredRate,
                            selection.tile.sqftPerBox
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="flex justify-center mt-6">
              <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Tile Option
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Scan Tile QR Code</DialogTitle>
                  </DialogHeader>
                  <QRScanner 
                    onScanSuccess={handleScanSuccess} 
                    onClose={() => setScannerOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function RoomSelector() {
  const [rooms, setRooms] = useState<{ name: string; sqft: number }[]>([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomSqft, setNewRoomSqft] = useState<number | ''>('');
  const { toast } = useToast();

  const handleAddRoom = () => {
    if (!newRoomName) {
      toast({
        title: "Room name required",
        description: "Please enter a name for the room.",
        variant: "destructive"
      });
      return;
    }

    if (!newRoomSqft) {
      toast({
        title: "Room area required",
        description: "Please enter the area in square feet.",
        variant: "destructive"
      });
      return;
    }

    setRooms([...rooms, { name: newRoomName, sqft: Number(newRoomSqft) }]);
    setNewRoomName('');
    setNewRoomSqft('');
    
    toast({
      title: "Room Added",
      description: `${newRoomName} has been added successfully.`
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Add New Room</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="roomName">Room Name</Label>
              <Input 
                id="roomName" 
                placeholder="e.g., Master Bedroom" 
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="roomSqft">Area (sq.ft.)</Label>
              <Input 
                id="roomSqft" 
                type="number"
                placeholder="Area in sq.ft." 
                value={newRoomSqft}
                onChange={(e) => setNewRoomSqft(e.target.value ? Number(e.target.value) : '')}
              />
            </div>
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleAddRoom}
            disabled={!newRoomName || !newRoomSqft}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        </CardContent>
      </Card>

      {rooms.map((room, index) => (
        <RoomTileSelector 
          key={index}
          roomName={room.name}
          sqft={room.sqft}
          onAddTile={() => {}}
        />
      ))}
      
      {rooms.length > 0 && (
        <div className="flex justify-center mt-6">
          <Button className="bg-primary">
            Save Customer Selections
          </Button>
        </div>
      )}
    </div>
  );
}
