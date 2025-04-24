
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Tile, MOCK_TILES } from '@/types';
import { Search, Plus, Pencil } from "lucide-react";

export function TileCatalog() {
  const [tiles, setTiles] = useState<Tile[]>(MOCK_TILES);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTile, setEditingTile] = useState<Tile | null>(null);
  const { toast } = useToast();

  const filteredTiles = tiles.filter(tile => 
    tile.tileName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tile.tileSize.includes(searchQuery) ||
    tile.qrCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveTile = (tile: Tile) => {
    if (editingTile) {
      // Update existing tile
      setTiles(prev => prev.map(t => t.id === tile.id ? tile : t));
      toast({
        title: "Tile Updated",
        description: `${tile.tileName} has been updated successfully.`
      });
    } else {
      // Add new tile
      const newTile = {
        ...tile,
        id: `${tiles.length + 1}`, // In production this would be a UUID
      };
      setTiles(prev => [...prev, newTile]);
      toast({
        title: "Tile Added",
        description: `${tile.tileName} has been added to the catalog.`
      });
    }
    setEditingTile(null);
  };

  const toggleTileActive = (id: string) => {
    setTiles(prev => prev.map(tile => 
      tile.id === id ? { ...tile, isActive: !tile.isActive } : tile
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Tile Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Search tiles..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => setEditingTile(null)}
                  className="bg-primary"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Tile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <TileForm 
                  initialTile={{
                    id: '',
                    tileName: '',
                    tileSize: '',
                    ratePerSqft: 0,
                    piecesPerBox: 0,
                    sqftPerBox: 0,
                    qrCode: '',
                    isActive: true
                  }}
                  onSave={handleSaveTile}
                />
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-4">
            {filteredTiles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No matching tiles found
              </div>
            ) : (
              filteredTiles.map(tile => (
                <Card key={tile.id} className={`border ${!tile.isActive ? 'bg-gray-50' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {tile.imageURL && (
                          <img 
                            src={tile.imageURL} 
                            alt={tile.tileName} 
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <h3 className={`font-medium ${!tile.isActive ? 'text-gray-500' : ''}`}>
                            {tile.tileName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {tile.tileSize} cm • ₹{tile.ratePerSqft}/sq.ft • QR: {tile.qrCode}
                          </p>
                          <p className="text-xs text-gray-400">
                            {tile.piecesPerBox} pcs/box • {tile.sqftPerBox} sq.ft/box
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={tile.isActive} 
                          onCheckedChange={() => toggleTileActive(tile.id)} 
                        />
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingTile(tile)}
                            >
                              <Pencil size={14} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <TileForm 
                              initialTile={tile}
                              onSave={handleSaveTile}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface TileFormProps {
  initialTile: Tile;
  onSave: (tile: Tile) => void;
}

function TileForm({ initialTile, onSave }: TileFormProps) {
  const [tile, setTile] = useState<Tile>(initialTile);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setTile({
      ...tile,
      [name]: type === 'number' ? Number(value) : value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(tile);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {initialTile.id ? 'Edit Tile' : 'Add New Tile'}
        </DialogTitle>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tileName">Tile Name</Label>
            <Input
              id="tileName"
              name="tileName"
              value={tile.tileName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tileSize">Size (cm)</Label>
            <Input
              id="tileSize"
              name="tileSize"
              placeholder="e.g., 60x60"
              value={tile.tileSize}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ratePerSqft">Rate (₹/sq.ft)</Label>
            <Input
              id="ratePerSqft"
              name="ratePerSqft"
              type="number"
              min="0"
              step="0.01"
              value={tile.ratePerSqft}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="piecesPerBox">Pieces per Box</Label>
            <Input
              id="piecesPerBox"
              name="piecesPerBox"
              type="number"
              min="1"
              value={tile.piecesPerBox}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sqftPerBox">Sq.ft per Box</Label>
            <Input
              id="sqftPerBox"
              name="sqftPerBox"
              type="number"
              min="0.01"
              step="0.01"
              value={tile.sqftPerBox}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="qrCode">QR Code</Label>
            <Input
              id="qrCode"
              name="qrCode"
              value={tile.qrCode}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="imageURL">Image URL (Optional)</Label>
          <Input
            id="imageURL"
            name="imageURL"
            placeholder="https://..."
            value={tile.imageURL || ''}
            onChange={handleChange}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={tile.isActive}
            onCheckedChange={(checked) => 
              setTile(prev => ({ ...prev, isActive: checked }))
            }
          />
          <Label htmlFor="isActive">Active</Label>
        </div>
      </div>
      
      <DialogFooter>
        <Button type="submit" className="bg-primary">
          {initialTile.id ? 'Update Tile' : 'Add Tile'}
        </Button>
      </DialogFooter>
    </form>
  );
}
