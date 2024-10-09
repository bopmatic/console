import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import BopmaticLink from '../link/BopmaticLink';
import { useDatabases } from '../../hooks/useDatabases';
import { useEffect } from 'react';
import { DatabaseDescription } from '../../client';

let rows: DatabaseDescription[];
const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: 'id',
    headerName: 'Database name',
    flex: 2,
    headerClassName: 'bopmatic-table-column-header',
    renderCell: (params) => {
      return (
        <BopmaticLink
          to={`/projects/${params.row.databaseHeader?.projEnvHeader?.projId}/databases/${params.value}`}
        >
          {params.value}
        </BopmaticLink>
      );
    },
    valueGetter: (value, row) => {
      if (!row.databaseHeader?.databaseName) {
        return null;
      }
      return row.databaseHeader?.databaseName;
    },
  },
  {
    field: 'numTables',
    headerName: 'Number of tables',
    type: 'number',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    valueGetter: (value, row) => {
      if (!row.tableNames) {
        return null;
      }
      return row.tableNames.length;
    },
  },
];

const getRowId = (row: DatabaseDescription) => {
  if (row.databaseHeader?.databaseName) {
    return row.databaseHeader.databaseName;
  }
  return '0';
};

type DatabasesTableProps = {
  projId: string | undefined;
  envId: string | undefined;
};

const DatabasesTable: React.FC<DatabasesTableProps> = ({ projId, envId }) => {
  const databases = useDatabases(projId, envId);
  useEffect(() => {
    console.log('databases is:', databases);
  }, [databases]);
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={databases ?? []}
        columns={columns}
        loading={!databases}
        getRowId={getRowId}
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

export default DatabasesTable;
