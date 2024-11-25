import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import ColoredIconCell from '../tables/ColoredIconCell';
import { ColoredIconColumnType } from '../tables/utils';
import CircularProgress from '@mui/material/CircularProgress';
import BopmaticLink from '../link/BopmaticLink';

export type KeyValuePair = {
  key: string;
  value: string | undefined;
  isColoredIcon?: boolean;
  coloredIconColumnType?: ColoredIconColumnType;
  linkTo?: string;
};

type PropertiesContainerProps = {
  keyValuePairs: KeyValuePair[];
  useHalfWidth?: boolean;
};

// TODO: Pass defaultGridElementSizeDef as property and let each consumer determine the layout parameters
const PropertiesContainer: React.FC<PropertiesContainerProps> = ({
  keyValuePairs,
  useHalfWidth,
}) => {
  const [defaultColumnsDef, setDefaultColumnsDef] = useState({
    xs: 2,
    sm: 4,
    md: 6,
    lg: 10,
    xl: 12,
  });
  const defaultGridElementSizeDef = { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 };
  useEffect(() => {
    if (keyValuePairs && useHalfWidth) {
      // we are using this component within another grid layout (i.e. datastore details page)
      // TODO: Consider changing the "defaultGridElementSizeDef" based on num of items... that's a bit over the top though
      setDefaultColumnsDef({
        xs: 2,
        sm: 2,
        md: 4,
        lg: 4,
        xl: 6,
      });
    }
  }, [keyValuePairs, useHalfWidth]);
  if (!keyValuePairs.length) {
    return (
      <div className="p-6 bg-white rounded border-bopgreyborder border flex justify-center w-full">
        <CircularProgress color="primary" />
      </div>
    );
  }
  return (
    <div className="p-6 bg-white rounded border-bopgreyborder border text-sm">
      <Grid container spacing={2} columns={defaultColumnsDef}>
        {keyValuePairs.map((keyValuePair, index) => {
          return (
            <Grid size={defaultGridElementSizeDef} key={keyValuePair.key}>
              <div>
                <div className="text-bopgreydisabled">{keyValuePair.key}</div>
                {keyValuePair.isColoredIcon &&
                keyValuePair.coloredIconColumnType &&
                keyValuePair.value ? (
                  <ColoredIconCell
                    value={keyValuePair.value}
                    type={keyValuePair.coloredIconColumnType}
                  />
                ) : keyValuePair.linkTo && keyValuePair.value?.length ? (
                  <BopmaticLink to={keyValuePair.linkTo}>
                    {keyValuePair.value}
                  </BopmaticLink>
                ) : (
                  <div>
                    {keyValuePair.value && keyValuePair.value.length
                      ? keyValuePair.value
                      : '-'}
                  </div>
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
