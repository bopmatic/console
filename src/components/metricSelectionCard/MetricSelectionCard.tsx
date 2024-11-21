import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';

type MetricSelectionCardProps = {
  cardContent: string;
  projectName?: string;
  onClick: () => void;
};

const MetricSelectionCard: React.FC<MetricSelectionCardProps> = ({
  cardContent,
  projectName,
  onClick,
}) => {
  return (
    <div className="min-w-60 pr-6">
      <Card onClick={onClick}>
        <CardActionArea>
          <CardMedia component="div" />
          <CardContent>
            <div className="pt-4 pb-4 pl-6 pr-6">
              <div className="text-boporangedark underline">{cardContent}</div>
              {projectName && (
                <div className="text-bopgreytext text-sm">
                  Project: {projectName}
                </div>
              )}
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
};

export default MetricSelectionCard;
