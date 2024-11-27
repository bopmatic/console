import React from 'react';
import { ColoredIconColumnType } from './utils';
import { CheckCircleOutline as CheckCircleOutlineIcon } from '@mui/icons-material';
import { DeploymentState, PackageState, ProjectState } from '../../client';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DoNotDisturbOnOutlinedIcon from '@mui/icons-material/DoNotDisturbOnOutlined';
import { ApiHealth } from '../../atoms';

type ColoredIconCellProps = {
  value: string;
  type: ColoredIconColumnType;
};

// return <CheckCircleOutlineIcon />;
export const getDeploymentStateIcon = (value: DeploymentState) => {
  switch (value) {
    case DeploymentState.Created:
      return <PendingOutlinedIcon />;
    case DeploymentState.DplyValidating:
      return <PendingOutlinedIcon />;
    case DeploymentState.InvalidDeployState:
      return <ErrorOutlineOutlinedIcon />;
    case DeploymentState.Deploying:
      return <PendingOutlinedIcon />;
    case DeploymentState.DplyBuilding:
      return <PendingOutlinedIcon />;
    case DeploymentState.Failed:
      return <ErrorOutlineOutlinedIcon />;
    case DeploymentState.Success:
      return <CheckCircleOutlineIcon />;
    case DeploymentState.UnknownDeployState:
      return <HelpOutlineOutlinedIcon />;
    default:
      return <HelpOutlineOutlinedIcon />;
  }
};

// bopsuccess
const getDeploymentStateTextColor = (value: DeploymentState) => {
  // TODO: Fix success - we are using this for testing
  switch (value) {
    case DeploymentState.Created:
      return 'text-bopgreytext';
    case DeploymentState.DplyValidating:
      return 'text-bopgreytext';
    case DeploymentState.InvalidDeployState:
      return 'text-boperror';
    case DeploymentState.Deploying:
      return 'text-bopgreytext';
    case DeploymentState.DplyBuilding:
      return 'text-bopgreytext';
    case DeploymentState.Failed:
      return 'text-boperror';
    case DeploymentState.Success:
      return 'text-bopsuccess';
    case DeploymentState.UnknownDeployState:
      return 'text-boperror';
    default:
      return 'text-bopgreytext';
  }
};

const getDeploymentStateText = (value: DeploymentState) => {
  switch (value) {
    case DeploymentState.Created:
      return 'Created...';
    case DeploymentState.DplyValidating:
      return 'Validating...';
    case DeploymentState.InvalidDeployState:
      return 'Invalid state';
    case DeploymentState.Deploying:
      return 'Deploying...';
    case DeploymentState.DplyBuilding:
      return 'Building...';
    case DeploymentState.Failed:
      return 'Deployment failed';
    case DeploymentState.Success:
      return 'Deployed';
    case DeploymentState.UnknownDeployState:
      return 'Unknown state';
    default:
      return value;
  }
};

const getPackageStateIcon = (value: PackageState) => {
  switch (value) {
    case PackageState.Built:
      return <CheckCircleOutlineIcon />;
    case PackageState.Invalid:
      return <ErrorOutlineOutlinedIcon />;
    case PackageState.InvalidPkgState:
      return <ErrorOutlineOutlinedIcon />;
    case PackageState.PkgBuilding:
      return <PendingOutlinedIcon />;
    case PackageState.PkgDeleted:
      return <DeleteOutlineOutlinedIcon />;
    case PackageState.PkgSupportNeeded:
      return <ErrorOutlineOutlinedIcon />;
    case PackageState.PkgValidating:
      return <CheckCircleOutlineIcon />;
    case PackageState.UnknownPkgState:
      return <HelpOutlineOutlinedIcon />;
    case PackageState.Uploaded:
      return <CloudUploadOutlinedIcon />;
    case PackageState.Uploading:
      return <CloudUploadOutlinedIcon />;
    default:
      return <HelpOutlineOutlinedIcon />;
  }
};

const getPackageStateTextColor = (value: PackageState) => {
  switch (value) {
    case PackageState.Built:
      return 'text-bopsuccess';
    case PackageState.Invalid:
      return 'text-boperror';
    case PackageState.InvalidPkgState:
      return 'text-boperror';
    case PackageState.PkgBuilding:
      return 'text-bopgreytext';
    case PackageState.PkgDeleted:
      return 'text-bopgreytext';
    case PackageState.PkgSupportNeeded:
      return 'text-boperror';
    case PackageState.PkgValidating:
      return 'text-bopgreytext';
    case PackageState.UnknownPkgState:
      return 'text-boperror';
    case PackageState.Uploaded:
      return 'text-bopgreytext';
    case PackageState.Uploading:
      return 'text-bopgreytext';
    default:
      return 'text-bopgreytext';
  }
};

const getPackageStateText = (value: PackageState) => {
  switch (value) {
    case PackageState.Built:
      return 'Built';
    case PackageState.Invalid:
      return 'Invalid';
    case PackageState.InvalidPkgState:
      return 'Invalid state';
    case PackageState.PkgBuilding:
      return 'Building...';
    case PackageState.PkgDeleted:
      return 'Deleted';
    case PackageState.PkgSupportNeeded:
      return 'Support needed';
    case PackageState.PkgValidating:
      return 'Validating...';
    case PackageState.UnknownPkgState:
      return 'Unknown';
    case PackageState.Uploaded:
      return 'Uploaded';
    case PackageState.Uploading:
      return 'Uploading...';
    default:
      return value;
  }
};

const getProjectStateIcon = (value: ProjectState) => {
  switch (value) {
    case ProjectState.Active:
      return <CheckCircleOutlineIcon />;
    case ProjectState.Inactive:
      return <DoNotDisturbOnOutlinedIcon />;
    case ProjectState.InvalidProjState:
      return <ErrorOutlineOutlinedIcon />;
    case ProjectState.ProjStateDeleted:
      return <DeleteOutlineOutlinedIcon />;
    case ProjectState.UnknownProjState:
      return <HelpOutlineOutlinedIcon />;
    default:
      return <HelpOutlineOutlinedIcon />;
  }
};

const getProjectStateTextColor = (value: ProjectState) => {
  switch (value) {
    case ProjectState.Active:
      return 'text-bopsuccess';
    case ProjectState.Inactive:
      return 'text-bopgreytext';
    case ProjectState.InvalidProjState:
      return 'text-boperror';
    case ProjectState.ProjStateDeleted:
      return 'text-bopgreytext';
    case ProjectState.UnknownProjState:
      return 'text-bopgreytext';
    default:
      return 'text-bopgreytext';
  }
};

const getProjectStateText = (value: ProjectState) => {
  switch (value) {
    case ProjectState.Active:
      return 'Active';
    case ProjectState.Inactive:
      return 'Inactive';
    case ProjectState.InvalidProjState:
      return 'Invalid state';
    case ProjectState.ProjStateDeleted:
      return 'Deleted';
    case ProjectState.UnknownProjState:
      return 'Unknown';
    default:
      return value;
  }
};

const getHealthIcon = (value: ApiHealth) => {
  switch (value) {
    case ApiHealth.HEALTHY:
      return <CheckCircleOutlineIcon />;
    case ApiHealth.DEGRADED:
      return <ErrorOutlineOutlinedIcon />;
    case ApiHealth.UNHEALTHY:
      return <ErrorOutlineOutlinedIcon />;
    case ApiHealth.UNKNOWN:
      return <HelpOutlineOutlinedIcon />;
    default:
      return <HelpOutlineOutlinedIcon />;
  }
};

const getHealthTextColor = (value: ApiHealth) => {
  switch (value) {
    case ApiHealth.HEALTHY:
      return 'text-bopsuccess';
    case ApiHealth.DEGRADED:
      return 'text-boperror';
    case ApiHealth.UNHEALTHY:
      return 'text-boperror';
    case ApiHealth.UNKNOWN:
      return 'text-bopgreytext';
    default:
      return 'text-bopgreytext';
  }
};

const getHealthText = (value: ApiHealth) => {
  switch (value) {
    case ApiHealth.HEALTHY:
      return 'Healthy';
    case ApiHealth.DEGRADED:
      return 'Degraded';
    case ApiHealth.UNHEALTHY:
      return 'Unhealthy';
    case ApiHealth.UNKNOWN:
      return 'Unknown';
    default:
      return 'Unknown';
  }
};

export const getIcon = (value: string, type: ColoredIconColumnType) => {
  switch (type) {
    case ColoredIconColumnType.DEPLOYMENT_STATE:
      return getDeploymentStateIcon(value as DeploymentState);
    case ColoredIconColumnType.PACKAGE_STATE:
      return getPackageStateIcon(value as PackageState);
    case ColoredIconColumnType.PROJECT_HEALTH:
      return getHealthIcon(value as ApiHealth);
    case ColoredIconColumnType.PROJECT_STATE:
      return getProjectStateIcon(value as ProjectState);
    default:
      return <CheckCircleOutlineIcon />;
  }
};

export const getTextColor = (value: string, type: ColoredIconColumnType) => {
  switch (type) {
    case ColoredIconColumnType.DEPLOYMENT_STATE:
      return getDeploymentStateTextColor(value as DeploymentState);
    case ColoredIconColumnType.PACKAGE_STATE:
      return getPackageStateTextColor(value as PackageState);
    case ColoredIconColumnType.PROJECT_HEALTH:
      return getHealthTextColor(value as ApiHealth);
    case ColoredIconColumnType.PROJECT_STATE:
      return getProjectStateTextColor(value as ProjectState);
    default:
      return 'text-bopsuccess';
  }
};

export const getText = (value: string, type: ColoredIconColumnType) => {
  switch (type) {
    case ColoredIconColumnType.DEPLOYMENT_STATE:
      return getDeploymentStateText(value as DeploymentState);
    case ColoredIconColumnType.PACKAGE_STATE:
      return getPackageStateText(value as PackageState);
    case ColoredIconColumnType.PROJECT_HEALTH:
      return getHealthText(value as ApiHealth);
    case ColoredIconColumnType.PROJECT_STATE:
      return getProjectStateText(value as ProjectState);
    default:
      return value;
  }
};

const ColoredIconCell: React.FC<ColoredIconCellProps> = ({ value, type }) => {
  return (
    <div className="flex items-center">
      <span className={`${getTextColor(value, type)}`}>
        {getIcon(value, type)}
      </span>
      <span className={`ml-1 ${getTextColor(value, type)}`}>
        {getText(value, type)}
      </span>
    </div>
  );
};

export default ColoredIconCell;
