import React from 'react';
import { ColoredIconColumnType } from './utils';
import { CheckCircleOutline as CheckCircleOutlineIcon } from '@mui/icons-material';

type ColoredIconCellProps = {
  value: string;
  type: ColoredIconColumnType;
};

// TODO: Format the value output below in the component to be nice and translatable
// TODO: Support all the SDK Enum values for each type of status
const ColoredIconCell: React.FC<ColoredIconCellProps> = ({ value, type }) => {
  return (
    <div className="flex items-center">
      <span className="text-bopsuccess">
        {/*// TODO: Replace this with logic to support other types of icons based on value and type*/}
        <CheckCircleOutlineIcon />
      </span>
      <span className="ml-1 text-bopsuccess">{value}</span>
    </div>
  );
};

export default ColoredIconCell;
