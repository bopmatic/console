import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 2,
    headerClassName: 'bopmatic-table-column-header',
  },
  {
    field: 'id',
    headerName: 'Environment ID',
    flex: 2,
    headerClassName: 'bopmatic-table-column-header',
  },
  {
    field: 'dnsPrefix',
    headerName: 'DNS Prefix',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
  },
  {
    field: 'createDate',
    headerName: 'Creation date',
    type: 'dateTime',
    flex: 2,
    headerClassName: 'bopmatic-table-column-header',
  },
];

const rows = [
  {
    name: 'Prod',
    id: 'env-0000000000000000',
    dnsPrefix: 'prod',
    createDate: new Date(),
  },
];

const EnvironmentsTable: React.FC = () => {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
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
          '.MuiDataGrid-footerContainer': { 'border-top': 'none' },
          '& .MuiDataGrid-columnHeaders': {
            borderBottom: '1px solid var(--divider, rgba(230, 233, 244, 1))',
          },
        }}
      />
    </Box>
  );
};

export default EnvironmentsTable;
