import React, { useEffect, useMemo, useState } from 'react';
import { useApiHealth } from '../../hooks/useApiHealth';
import { ServiceApiWrapper } from '../../hooks/utils';
import CircularProgress from '@mui/material/CircularProgress';
import { getIcon, getText, getTextColor } from '../tables/ColoredIconCell';
import { ColoredIconColumnType } from '../tables/utils';

type ApiHealthTableCellProps = {
  envId: string;
  projectId: string;
  serviceName: string;
  apiName: string;
};

const ApiHealthTableCell: React.FC<ApiHealthTableCellProps> = ({
  envId,
  projectId,
  serviceName,
  apiName,
}) => {
  const [serviceApiWrappers, setServiceApiWrappers] = useState<
    ServiceApiWrapper[]
  >([]);
  // apiHealthWrappers should just be one
  const [apiHealthWrappers, isLoading] = useApiHealth(
    envId,
    projectId,
    serviceApiWrappers
  );
  useEffect(() => {
    if (serviceName && apiName) {
      setServiceApiWrappers([{ serviceName, apiName }]);
    }
  }, [serviceName, apiName]);
  const apiHealth = useMemo(() => {
    return apiHealthWrappers && apiHealthWrappers.length === 1
      ? apiHealthWrappers[0].health
      : '';
  }, [apiHealthWrappers]);
  const type = ColoredIconColumnType.PROJECT_HEALTH;
  if (isLoading) {
    return <CircularProgress />;
  } else if (apiHealth) {
    return (
      <div className="flex items-center">
        <span className={`${getTextColor(apiHealth, type)}`}>
          {getIcon(apiHealth, type)}
        </span>
        <span className={`ml-1 ${getTextColor(apiHealth, type)}`}>
          {getText(apiHealth, type)}
        </span>
      </div>
    );
  } else {
    return <CircularProgress />;
  }
};

export default ApiHealthTableCell;
