import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import BopmaticLink from '../link/BopmaticLink';
import { useDatastores } from '../../hooks/useDatastores';
import { datastoresLoadingAtom } from '../../atoms';
import { useAtom } from 'jotai';
import { DatastoreDescription } from '../../client';
import BopmaticTableContainer from './BopmaticTableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import EmptyTable from './EmptyTable';
import { formatBytes } from '../utils/byteUtils';

let rows: DatastoreDescription[];
const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: 'id',
    headerName: 'Datastore name',
    flex: 2,
    headerClassName: 'bopmatic-table-column-header',
    minWidth: 150,
    renderCell: (params) => {
      return (
        <BopmaticLink
          to={`/projects/${params.row.datastoreHeader?.projEnvHeader?.projId}/datastores/${params.value}`}
        >
          {params.value}
        </BopmaticLink>
      );
    },
    valueGetter: (value, row) => {
      if (!row.datastoreHeader?.datastoreName) {
        return null;
      }
      return row.datastoreHeader?.datastoreName;
    },
  },
  {
    field: 'capacity',
    headerName: 'Capacity',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    minWidth: 150,
    valueGetter: (value, row) => {
      if (!row.datastoreHeader?.datastoreName) {
        return null;
      }
      return row.capacityConsumedInBytes
        ? formatBytes(parseInt(row.capacityConsumedInBytes))
        : '0 Bytes';
    },
  },
  {
    field: 'numObjects',
    headerName: '# Objects',
    type: 'number',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    minWidth: 150,
    valueGetter: (value, row) => {
      if (!row.datastoreHeader?.datastoreName) {
        return null;
      }
      return row.numObjects ?? '0';
    },
  },
];

type DatastoresTableProps = {
  projId: string | undefined;
  envId: string | undefined;
  tableDescOverride?: string;
  datastoreNamesFilter?: string[];
};

const getRowId = (row: DatastoreDescription) => {
  if (row.datastoreHeader?.datastoreName) {
    return row.datastoreHeader?.datastoreName;
  }
  return '0';
};

const DatastoresTable: React.FC<DatastoresTableProps> = ({
  projId,
  envId,
  tableDescOverride,
  datastoreNamesFilter,
}) => {
  const datastores = useDatastores(projId, envId);
  const datastoresFiltered = datastoreNamesFilter
    ? datastores?.filter((ds) =>
        datastoreNamesFilter.includes(
          ds.datastoreHeader?.datastoreName as string
        )
      )
    : [];
  const [datastoresLoading] = useAtom(datastoresLoadingAtom);
  const tableResource = tableDescOverride ? tableDescOverride : 'Datastores';
  return (
    <BopmaticTableContainer
      tableResource={tableResource}
      includeNumResources={true}
      numResources={datastores?.length}
    >
      {datastoresLoading ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : !datastores || !datastores.length ? (
        <EmptyTable resourceName="datastore" />
      ) : (
        <DataGrid
          rows={datastoreNamesFilter ? datastoresFiltered : datastores}
          columns={columns}
          loading={datastoresLoading}
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

export default DatastoresTable;
