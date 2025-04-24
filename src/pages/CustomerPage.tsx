
import React from 'react';
import { CustomerIntakeForm } from '@/components/CustomerIntakeForm';

const CustomerPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-6">
        New Customer
      </h1>
      <CustomerIntakeForm />
    </div>
  );
};

export default CustomerPage;
