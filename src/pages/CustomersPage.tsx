
import React from 'react';
import { CustomerList } from '@/components/CustomerList';

const CustomersPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-6">
        My Customers
      </h1>
      <CustomerList />
    </div>
  );
};

export default CustomersPage;
