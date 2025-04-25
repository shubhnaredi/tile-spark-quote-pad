
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Plus, Upload } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from '@/lib/utils';
import { Customer } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAddCustomer } from '@/hooks/useSupabaseMutation';

interface CustomerFormData {
  name: string;
  phone: string;
  area: string;
  has_chit_photo: boolean;
  chit_image_url?: string;
  visit_date: string;
  salesperson_id?: string;
}

export function CustomerIntakeForm() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CustomerFormData>();
  const [date, setDate] = useState<Date>(new Date());
  const [uploading, setUploading] = useState(false);
  const [hasChitPhoto, setHasChitPhoto] = useState(false);
  const [chitImageUrl, setChitImageUrl] = useState<string | undefined>(undefined);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const addCustomer = useAddCustomer();
  
  const onSubmit = async (data: CustomerFormData) => {
    try {
      // Convert form data to customer data
      const customerData: Omit<Customer, 'id' | 'created_at'> = {
        name: data.name,
        phone: data.phone,
        area: data.area,
        has_chit_photo: hasChitPhoto,
        chit_image_url: chitImageUrl,
        salesperson_id: user?.id || '',
        visit_date: format(date, 'yyyy-MM-dd')
      };
      
      // Use the mutation to add customer
      addCustomer.mutate(customerData, {
        onSuccess: () => {
          toast({
            title: "Customer Added Successfully",
            description: `New customer ${data.name} has been added.`,
          });
          
          // Navigate to room selection
          navigate('/rooms/new');
        },
        onError: (error) => {
          toast({
            title: "Error Adding Customer",
            description: error.message || "There was a problem adding the customer.",
            variant: "destructive",
          });
        }
      });
    } catch (error: any) {
      console.error("Error saving customer:", error);
      toast({
        title: "Error Adding Customer",
        description: "There was a problem adding the customer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = () => {
    setUploading(true);
    // Mock image upload
    setTimeout(() => {
      const imageUrl = 'https://via.placeholder.com/300?text=Measurement+Chit';
      setChitImageUrl(imageUrl);
      setHasChitPhoto(true);
      setUploading(false);
      toast({
        title: "Image Uploaded",
        description: "Measurement chit image has been uploaded.",
      });
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-primary">New Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Customer Name</Label>
            <Input 
              id="name" 
              placeholder="Full Name" 
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              placeholder="10-digit number" 
              {...register("phone", { 
                required: "Phone is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit phone number"
                }
              })}
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Area/Location</Label>
            <Input 
              id="area" 
              placeholder="e.g., Vijay Nagar" 
              {...register("area", { required: "Area is required" })}
            />
            {errors.area && (
              <p className="text-xs text-red-500">{errors.area.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Date of Visit</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                  className="p-3"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chitPhoto">Measurement Chit Photo</Label>
            <div className="flex items-center gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleImageUpload}
                disabled={uploading}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? "Uploading..." : "Upload Photo"}
              </Button>
            </div>
            {chitImageUrl && (
              <div className="mt-2 border rounded p-2 text-sm text-green-600">
                Image uploaded successfully
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="leadSource">Lead Source</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select source (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="walk-in">Walk-in</SelectItem>
                <SelectItem value="mistry">Mistry</SelectItem>
                <SelectItem value="architect">Architect</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />
          
          <Button type="submit" className="w-full bg-primary">
            <Plus className="mr-2 h-4 w-4" />
            Save & Proceed to Room Selection
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
