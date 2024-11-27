import React, { useMemo } from 'react';
import { useEnvironment } from '../../hooks/useEnvironment';
import { useServiceHealth } from '../../hooks/useServiceHealth';
import { evaluateOverallHealth } from '../../hooks/utils';
import { ColoredIconColumnType } from '../tables/utils';
import CircularProgress from '@mui/material/CircularProgress';
import { getIcon, getText, getTextColor } from '../tables/ColoredIconCell';

type ServiceHealthTableCellProps = {
  projectId: string;
  serviceName: string;
};

const ServiceHealthTableCell: React.FC<ServiceHealthTableCellProps> = ({
  projectId,
  serviceName,
}) => {
  const env = useEnvironment();
  // serviceHealth is a ApiHealthWrapper array with each api included for this service
  const [serviceHealthWrappers, isLoading] = useServiceHealth(
    env?.id,
    projectId,
    [serviceName]
  );
  const serviceHealthFiltered = useMemo(() => {
    return serviceHealthWrappers && serviceHealthWrappers.length
      ? evaluateOverallHealth(serviceHealthWrappers)
      : '';
  }, [serviceHealthWrappers]);
  const type = ColoredIconColumnType.PROJECT_HEALTH;
  if (isLoading) {
    return <CircularProgress />;
  } else if (serviceHealthFiltered) {
    return (
      <div className="flex items-center">
        <span className={`${getTextColor(serviceHealthFiltered, type)}`}>
          {getIcon(serviceHealthFiltered, type)}
        </span>
        <span className={`ml-1 ${getTextColor(serviceHealthFiltered, type)}`}>
          {getText(serviceHealthFiltered, type)}
        </span>
      </div>
    );
  } else {
    return <CircularProgress />;
  }
};

export default ServiceHealthTableCell;
