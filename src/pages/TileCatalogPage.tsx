
import React from 'react';
import { TileCatalog } from '@/components/TileCatalog';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const TileCatalogPage = () => {
  const { isAdmin } = useAuth();
  
  // Only allow admin access
  if (!isAdmin()) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-6">
        Tile Catalog
      </h1>
      <TileCatalog />
    </div>
  );
};

export default TileCatalogPage;
