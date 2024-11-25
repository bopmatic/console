import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAtom } from 'jotai';
import { databasesLoadingAtom } from '../../atoms';
import { useDatabases } from '../../hooks/useDatabases';
import BopmaticTableContainer from './BopmaticTableContainer';
import { DatabaseTableDescription } from '../../client';
import CircularProgress from '@mui/material/CircularProgress';
import { formatBytes } from '../utils/byteUtils';

let rows: DatabaseTableDescription[];
const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: 'id',
    headerName: 'Table name',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    minWidth: 150,
    valueGetter: (value, row) => {
      if (!row.Name) {
        return null;
      }
      return row.Name;
    },
  },
  {
    field: 'numRows',
    headerName: '# rows',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    minWidth: 120,
    valueGetter: (value, row) => {
      if (!row.NumRows) {
        return null;
      }
      return row.NumRows;
    },
  },
  {
    field: 'capacityConsumed',
    headerName: 'Capacity consumed',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    minWidth: 150,
    valueGetter: (value, row) => {
      if (!row.Size) {
        return null;
      }
      return formatBytes(parseInt(row.Size));
    },
  },
];

type DatabaseTablesTableProps = {
  projId: string | undefined;
  envId: string | undefined;
  databaseName: string | undefined;
};

const DatabaseTablesTable: React.FC<DatabaseTablesTableProps> = ({
  projId,
  envId,
  databaseName,
}) => {
  const databases = useDatabases(projId, envId);
  const database = databases?.filter(
    (s) => s.databaseHeader?.databaseName === databaseName
  );
  const databaseTables =
    database && database[0] ? database[0].tables : undefined;
  const [databasesLoadingData] = useAtom(databasesLoadingAtom);

  const getRowId = (row: DatabaseTableDescription) => {
    if (row.Name) {
      return row.Name;
    }
    return '0';
  };

  return (
    <BopmaticTableContainer
      tableResource="Tables"
      includeNumResources={true}
      numResources={databaseTables?.length}
    >
      {databasesLoadingData ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <DataGrid
          rows={databaseTables ?? []}
          columns={columns}
          loading={databasesLoadingData}
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
            '.MuiDataGrid-footerContainer': { borderTop: 'none' },
            '& .MuiDataGrid-columnHeaders': {
              borderBottom: '1px solid var(--divider, rgba(230, 233, 244, 1))',
            },
          }}
        />
      )}
    </BopmaticTableContainer>
  );
};

export default DatabaseTablesTable;
