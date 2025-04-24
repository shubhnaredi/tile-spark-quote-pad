
import React from 'react';
import { RoomSelector } from '@/components/RoomSelector';

const RoomPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-6">
        Room Selections
      </h1>
      <RoomSelector />
    </div>
  );
};

export default RoomPage;
