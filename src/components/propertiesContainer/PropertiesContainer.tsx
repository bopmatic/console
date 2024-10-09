import React from 'react';
import Grid from '@mui/material/Grid2';
import ColoredIconCell from '../tables/ColoredIconCell';
import { ColoredIconColumnType } from '../tables/utils';
import CircularProgress from '@mui/material/CircularProgress';

export type KeyValuePair = {
  key: string;
  value: string | undefined;
  isColoredIcon?: boolean;
  coloredIconColumnType?: ColoredIconColumnType;
};

type PropertiesContainerProps = {
  keyValuePairs: KeyValuePair[];
};

const PropertiesContainer: React.FC<PropertiesContainerProps> = ({
  keyValuePairs,
}) => {
  if (!keyValuePairs.length) {
    return (
      <div className="p-6 bg-white rounded border-bopgreyborder border flex justify-center w-full">
        <CircularProgress color="primary" />
      </div>
    );
  }
  return (
    <div className="p-6 bg-white rounded border-bopgreyborder border text-sm">
      <Grid
        container
        spacing={2}
        columns={{ xs: 2, sm: 4, md: 6, lg: 10, xl: 12 }}
      >
        {keyValuePairs.map((keyValuePair, index) => {
          return (
            <Grid
              size={{ xs: 2, sm: 3, md: 3, lg: 3, xl: 2 }}
              key={keyValuePair.key}
            >
              <div>
                <div className="text-bopgreydisabled">{keyValuePair.key}</div>
                {keyValuePair.isColoredIcon &&
                keyValuePair.coloredIconColumnType &&
                keyValuePair.value ? (
                  <ColoredIconCell
                    value={keyValuePair.value}
                    type={keyValuePair.coloredIconColumnType}
                  />
                ) : (
                  <div>{keyValuePair.value}</div>
                )}
              </div>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default PropertiesContainer;
