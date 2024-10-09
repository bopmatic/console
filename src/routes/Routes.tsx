import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Projects from '../pages/Projects';
import ProjectDetails from '../pages/ProjectDetails';
import Environments from '../pages/Environments';
import DashboardLayout from '../components/layout/DashboardLayout';
import AccessTokens from '../pages/AccessTokens';
import Logs from '../pages/Logs';
import Metrics from '../pages/Metrics';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Define routes that use the DashboardLayout */}
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/projects" />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        <Route path="projects" element={<Projects />} />
        <Route path="environments" element={<Environments />} />
        <Route path="access-keys" element={<AccessTokens />} />
        <Route path="logs" element={<Logs />} />
        <Route path="metrics" element={<Metrics />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
