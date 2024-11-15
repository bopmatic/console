import { DeploymentInitiator, DeploymentType } from '../../client';

export enum ColumnStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
}

export enum ColoredIconColumnType {
  PACKAGE_STATE = 'PACKAGE_STATE',
  DEPLOYMENT_STATE = 'DEPLOYMENT_STATE',
  PROJECT_HEALTH = 'PROJECT_HEALTH',
  PROJECT_STATE = 'PROJECT_STATE',
}

export const formatCompletionTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const hoursPart = hours > 0 ? `${hours}h ` : '';
  const minutesPart = minutes > 0 ? `${minutes}m ` : '';
  const secondsPart = `${secs}s`;

  return `${hoursPart}${minutesPart}${secondsPart}`.trim();
};

export const parseDeployTypeOrInitiator = (
  deployType: DeploymentType | DeploymentInitiator
) => {
  if (!deployType) return undefined;

  // Replace underscores, make lowercase, capitalize first letter
  return deployType
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());
};
