import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import {
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useEnvironments } from '../../hooks/useEnvironments';

/**
 * Selector for Environment
 *
 * TODO: Once customers are able to create additional environments this should update to change the current environment of the view
 * @constructor
 */
const EnvSelector: React.FC = () => {
  const [envId, setEnvId] = useState<string>('');
  const environments = useEnvironments();

  const handleEnvChange = (event: SelectChangeEvent) => {
    setEnvId(event.target.value);
  };

  useEffect(() => {
    if (environments && environments.length) {
      setEnvId(environments[0].id as string);
    }
  }, [environments]);

  return (
    <div>
      <FormControl sx={{ minWidth: 200, backgroundColor: 'white' }}>
        <InputLabel id="env-label">Environment</InputLabel>
        <Select
          labelId="env-label"
          id="env"
          value={envId}
          onChange={handleEnvChange}
          autoWidth
          label="Environment"
        >
          {environments?.map((envDesc, index) => {
            return (
              <MenuItem value={envDesc.id} key={index}>
                {envDesc.header?.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
};

export default EnvSelector;
