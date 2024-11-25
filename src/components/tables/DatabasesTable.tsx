import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import BopmaticLink from '../link/BopmaticLink';
import { useDatabases } from '../../hooks/useDatabases';
import { DatabaseDescription } from '../../client';
import { useAtom } from 'jotai/index';
import { databasesLoadingAtom } from '../../atoms';
import BopmaticTableContainer from './BopmaticTableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import EmptyTable from './EmptyTable';

let rows: DatabaseDescription[];
const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: 'id',
    headerName: 'Database name',
    flex: 2,
    headerClassName: 'bopmatic-table-column-header',
    minWidth: 200,
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
    minWidth: 200,
    valueGetter: (value, row) => {
      if (!row.tables) {
        return null;
      }
      return row.tables.length;
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
  tableDescOverride?: string;
  databaseNamesFilter?: string[];
};

const DatabasesTable: React.FC<DatabasesTableProps> = ({
  projId,
  envId,
  tableDescOverride,
  databaseNamesFilter,
}) => {
  const databases = useDatabases(projId, envId);
  const databasesFiltered = databaseNamesFilter
    ? databases?.filter((db) =>
        databaseNamesFilter.includes(db.databaseHeader?.databaseName as string)
      )
    : [];
  const [databasesLoadingData] = useAtom(databasesLoadingAtom);
  const tableResource = tableDescOverride ? tableDescOverride : 'Databases';
  return (
    <BopmaticTableContainer
      tableResource={tableResource}
      includeNumResources={true}
      numResources={databases?.length}
    >
      {databasesLoadingData ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : !databases || !databases.length ? (
        <EmptyTable resourceName="database" />
      ) : (
        <DataGrid
          rows={databaseNamesFilter ? databasesFiltered : databases}
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

export default DatabasesTable;
