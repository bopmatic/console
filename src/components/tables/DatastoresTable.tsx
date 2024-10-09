import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import BopmaticLink from '../link/BopmaticLink';

const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: 'id',
    headerName: 'Datastore name',
    flex: 2,
    headerClassName: 'bopmatic-table-column-header',
    renderCell: (params) => {
      return (
        <BopmaticLink to={`/projects/proj-123123123/datastores/myDatastore`}>
          {params.value}
        </BopmaticLink>
      );
    },
  },
  {
    field: 'capacity',
    headerName: 'Capacity',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
  },
  {
    field: 'numObjects',
    headerName: '# Objects',
    type: 'number',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
  },
];

const rows = [
  {
    id: 'Datastore1',
    numObjects: 10248,
    capacity: '192 GB',
  },
  {
    id: 'Datastore2',
    numObjects: 2102,
    capacity: '2 GB',
  },
  {
    id: 'Datastore3',
    numObjects: 3022491,
    capacity: '1.1 TB',
  },
  {
    id: 'Datastore4',
    numObjects: 381923,
    capacity: '97 GB',
  },
];

const DatastoresTable: React.FC = () => {
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
            sortModel: [{ field: 'id', sort: 'asc' }],
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

export default DatastoresTable;
