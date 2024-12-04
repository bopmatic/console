import {
  DeploymentInitiator,
  DeploymentStateDetail,
  DeploymentType,
} from '../../client';

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

export const formatCompletionTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000); // Convert milliseconds to seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const hoursPart = hours > 0 ? `${hours}h ` : '';
  const minutesPart = minutes > 0 ? `${minutes}m ` : '';
  const secondsPart = `${secs}s`;

  return `${hoursPart}${minutesPart}${secondsPart}`.trim();
};

export const parseDeployTypeInitiatorStateDetail = (
  enumVal: DeploymentType | DeploymentInitiator | DeploymentStateDetail
) => {
  if (!enumVal) return undefined;

  // Replace underscores, make lowercase, capitalize first letter
  return enumVal
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());
};
