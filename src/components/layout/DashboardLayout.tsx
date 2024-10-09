import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../header/Header';
import LeftNav from '../leftNav/LeftNav';

const DashboardLayout: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="flex justify-between">
        <LeftNav />
        <div className="flex-grow h-screen overflow-auto bg-bopgreybkg p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
