import React from 'react';
import { useEnvironment } from '../../hooks/useEnvironment';
import { useProjectHealth } from '../../hooks/useProjectHealth';
import { getIcon, getText, getTextColor } from '../tables/ColoredIconCell';
import { ColoredIconColumnType } from '../tables/utils';
import CircularProgress from '@mui/material/CircularProgress';

type ProjectHealthTableCellProps = {
  projectId: string | undefined;
};

const ProjectHealthTableCell: React.FC<ProjectHealthTableCellProps> = ({
  projectId,
}) => {
  const env = useEnvironment();
  const [projectHealth, isLoading] = useProjectHealth(env?.id, projectId);
  const type = ColoredIconColumnType.PROJECT_HEALTH;
  if (isLoading) {
    return <CircularProgress />;
  } else if (projectHealth) {
    return (
      <div className="flex items-center">
        <span className={`${getTextColor(projectHealth, type)}`}>
          {getIcon(projectHealth, type)}
        </span>
        <span className={`ml-1 ${getTextColor(projectHealth, type)}`}>
          {getText(projectHealth, type)}
        </span>
      </div>
    );
  } else {
    return <CircularProgress />;
  }
};

export default ProjectHealthTableCell;
