
import React from 'react';
import { AdminDashboard } from '@/components/AdminDashboard';

const AdminDashboardPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-6">
        Admin Dashboard
      </h1>
      <AdminDashboard />
    </div>
  );
};

export default AdminDashboardPage;
