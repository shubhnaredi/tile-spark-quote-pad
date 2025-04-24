
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const ChitArchivePage = () => {
  const { isAdmin } = useAuth();
  
  // Only allow admin access
  if (!isAdmin()) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-6">
        Measurement Chits Archive
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Measurement Chits</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-12 text-gray-500">
            No measurement chits uploaded yet.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChitArchivePage;
