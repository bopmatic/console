import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Projects from '../pages/Projects';
import ProjectDetails from '../pages/ProjectDetails';
import Environments from '../pages/Environments';
import DashboardLayout from '../components/layout/DashboardLayout';
import AccessTokens from '../pages/AccessTokens';
import Logs from '../pages/Logs';
import Metrics from '../pages/Metrics';
import ServiceDetails from '../pages/ServiceDetails';
import DatabaseDetails from '../pages/DatabaseDetails';
import DatastoreDetails from '../pages/DatastoreDetails';
import DeploymentDetails from '../pages/DeploymentDetails';
import PackageDetails from '../pages/PackageDetails';
import Login from '../components/login/Login';
import ForgotPassword from '../components/login/ForgotPassword';
import RequestAccess from '../components/login/RequestAccess';
import ChangePassword from '../components/login/ChangePassword';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="request-access" element={<RequestAccess />} />
      {/* Define routes that use the DashboardLayout */}
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/projects" />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        <Route
          path="projects/:projectId/services/:serviceName"
          element={<ServiceDetails />}
        />
        <Route
          path="projects/:projectId/databases/:databaseName"
          element={<DatabaseDetails />}
        />
        <Route
          path="projects/:projectId/datastores/:datastoreName"
          element={<DatastoreDetails />}
        />
        <Route
          path="projects/:projectId/deployments/:deploymentId"
          element={<DeploymentDetails />}
        />
        <Route
          path="projects/:projectId/packages/:packageId"
          element={<PackageDetails />}
        />
        <Route path="environments" element={<Environments />} />
        <Route path="access-keys" element={<AccessTokens />} />
        <Route path="logs" element={<Logs />} />
        <Route path="metrics" element={<Metrics />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
