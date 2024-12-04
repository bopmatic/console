import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import BopmaticTableContainer from './BopmaticTableContainer';
import { useEnvironments } from '../../hooks/useEnvironments';
import { EnvironmentDescription } from '../../client';
import { bopmaticDateFormat } from '../utils/dateUtils';

let rows: EnvironmentDescription[];
const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 2,
    headerClassName: 'bopmatic-table-column-header',
    minWidth: 175,
    valueGetter: (value, row) => {
      if (!row.header?.name) {
        return null;
      }
      return row.header?.name;
    },
  },
  {
    field: 'id',
    headerName: 'Environment ID',
    flex: 2,
    headerClassName: 'bopmatic-table-column-header',
    minWidth: 175,
  },
  {
    field: 'dnsPrefix',
    headerName: 'DNS Prefix',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    minWidth: 175,
    valueGetter: (value, row) => {
      if (!row.header?.dnsPrefix) {
        return null;
      }
      return row.header?.dnsPrefix;
    },
  },
  {
    field: 'createDate',
    headerName: 'Creation date',
    type: 'dateTime',
    flex: 2,
    headerClassName: 'bopmatic-table-column-header',
    minWidth: 175,
    valueGetter: (value, row) => {
      if (!row.createTime) {
        return null;
      }
      return bopmaticDateFormat(new Date(parseInt(row.createTime)));
    },
  },
];

const EnvironmentsTable: React.FC = () => {
  const environments = useEnvironments();
  return (
    <BopmaticTableContainer
      tableResource="Environments"
      includeNumResources={true}
      numResources={environments?.length}
    >
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={environments ?? []}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
            sorting: {
              sortModel: [{ field: 'name', sort: 'asc' }],
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '.MuiDataGrid-footerContainer': { borderTop: 'none' },
            '& .MuiDataGrid-columnHeaders': {
              borderBottom: '1px solid var(--divider, rgba(230, 233, 244, 1))',
            },
          }}
        />
      </Box>
    </BopmaticTableContainer>
  );
};

export default EnvironmentsTable;
