
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
import { Tile } from '@/types';
import { Search, Plus, Pencil } from "lucide-react";
import { useTiles } from '@/hooks/useSupabaseQuery';

export function TileCatalog() {
  const { data: tiles = [], isLoading } = useTiles();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTile, setEditingTile] = useState<Tile | null>(null);
  const { toast } = useToast();

  const filteredTiles = tiles.filter(tile => 
    tile.tile_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tile.size.includes(searchQuery) ||
    (tile.barcode && tile.barcode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSaveTile = (tile: Tile) => {
    if (editingTile) {
      // Update existing tile
      // In a real app, this would call a Supabase mutation
      toast({
        title: "Tile Updated",
        description: `${tile.tile_name} has been updated successfully.`
      });
    } else {
      // Add new tile
      // In a real app, this would call a Supabase mutation
      toast({
        title: "Tile Added",
        description: `${tile.tile_name} has been added to the catalog.`
      });
    }
    setEditingTile(null);
  };

  const toggleTileActive = (id: string) => {
    // In a real app, this would call a Supabase mutation
    toast({
      title: "Tile Status Changed",
      description: "Tile status has been updated."
    });
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
                    tile_name: '',
                    size: '',
                    pieces_per_box: 0,
                    sqft_per_box: 0,
                    barcode: '',
                    is_active: true
                  }}
                  onSave={handleSaveTile}
                />
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                Loading tiles...
              </div>
            ) : filteredTiles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No matching tiles found
              </div>
            ) : (
              filteredTiles.map(tile => (
                <Card key={tile.id} className={`border ${!tile.is_active ? 'bg-gray-50' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {tile.image_url && (
                          <img 
                            src={tile.image_url} 
                            alt={tile.tile_name} 
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <h3 className={`font-medium ${!tile.is_active ? 'text-gray-500' : ''}`}>
                            {tile.tile_name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {tile.size} cm • QR: {tile.barcode}
                          </p>
                          <p className="text-xs text-gray-400">
                            {tile.pieces_per_box} pcs/box • {tile.sqft_per_box} sq.ft/box
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={tile.is_active} 
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
            <Label htmlFor="tile_name">Tile Name</Label>
            <Input
              id="tile_name"
              name="tile_name"
              value={tile.tile_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="size">Size (cm)</Label>
            <Input
              id="size"
              name="size"
              placeholder="e.g., 60x60"
              value={tile.size}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pieces_per_box">Pieces per Box</Label>
            <Input
              id="pieces_per_box"
              name="pieces_per_box"
              type="number"
              min="1"
              value={tile.pieces_per_box}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sqft_per_box">Sq.ft per Box</Label>
            <Input
              id="sqft_per_box"
              name="sqft_per_box"
              type="number"
              min="0.01"
              step="0.01"
              value={tile.sqft_per_box}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
            <Label htmlFor="barcode">QR Code</Label>
            <Input
              id="barcode"
              name="barcode"
              value={tile.barcode || ''}
              onChange={handleChange}
              required
            />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image_url">Image URL (Optional)</Label>
          <Input
            id="image_url"
            name="image_url"
            placeholder="https://..."
            value={tile.image_url || ''}
            onChange={handleChange}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={tile.is_active}
            onCheckedChange={(checked) => 
              setTile(prev => ({ ...prev, is_active: checked }))
            }
          />
          <Label htmlFor="is_active">Active</Label>
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
