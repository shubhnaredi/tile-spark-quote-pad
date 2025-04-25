
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Customer } from '@/types';
import { Search, Phone, MapPin, Calendar, User, ArrowRight } from "lucide-react";
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useCustomers } from '@/hooks/useSupabaseQuery';

export function CustomerList() {
  const { data: customers = [], isLoading } = useCustomers();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const filteredCustomers = searchQuery.trim() === '' 
    ? customers 
    : customers.filter(customer => 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        customer.phone.includes(searchQuery) ||
        customer.area.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const viewCustomerDetails = (customerId: string) => {
    // Navigate to customer details/edit page
    navigate(`/admin/customer/${customerId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">My Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search by name, phone, or area..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="recent">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="all">All Customers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent">
            <CustomerCards 
              customers={filteredCustomers.slice(0, 5)}
              onViewDetails={viewCustomerDetails}
            />
          </TabsContent>
          
          <TabsContent value="all">
            <CustomerCards 
              customers={filteredCustomers}
              onViewDetails={viewCustomerDetails}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface CustomerCardsProps {
  customers: Customer[];
  onViewDetails: (customerId: string) => void;
}

function CustomerCards({ customers, onViewDetails }: CustomerCardsProps) {
  if (customers.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No customers found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {customers.map(customer => (
        <Card key={customer.id} className="overflow-hidden">
          <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium">{customer.name}</h3>
                <Badge variant="outline" className="bg-gray-100">
                  {customer.visit_date === format(new Date(), 'yyyy-MM-dd') ? 'Today' : ''}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="w-3 h-3 mr-1" />
                  {customer.phone}
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-3 h-3 mr-1" />
                  {customer.area}
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(customer.visit_date).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              className="sm:self-center"
              onClick={() => onViewDetails(customer.id)}
            >
              Details
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
