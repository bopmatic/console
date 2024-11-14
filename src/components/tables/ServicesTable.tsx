import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ColoredIconCell from './ColoredIconCell';
import { ColoredIconColumnType } from './utils';
import BopmaticLink from '../link/BopmaticLink';
import { ServiceDescription } from '../../client';
import { useServices } from '../../hooks/useServices';
import { useAtom } from 'jotai';
import { servicesLoadingAtom } from '../../atoms';
import BopmaticTableContainer from './BopmaticTableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import EmptyTable from './EmptyTable';

let rows: ServiceDescription[];
const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: 'id',
    headerName: 'Name',
    flex: 2,
    headerClassName: 'bopmatic-table-column-header',
    renderCell: (params) => {
      return (
        <BopmaticLink
          to={`/projects/${params.row.svcHeader?.projEnvHeader?.projId}/services/${params.value}`}
        >
          {params.value}
        </BopmaticLink>
      );
    },
    valueGetter: (value, row) => {
      if (!row.svcHeader?.serviceName) {
        return null;
      }
      return row.svcHeader?.serviceName;
    },
  },
  {
    field: 'apiHealth',
    headerName: 'API Health',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    renderCell: (params) => {
      return (
        <ColoredIconCell
          value="Healthy"
          type={ColoredIconColumnType.PROJECT_HEALTH}
        />
      );
    },
  },
  {
    field: 'apiDef',
    headerName: 'API Definition',
    flex: 3,
    headerClassName: 'bopmatic-table-column-header',
    valueGetter: (value, row) => {
      return '-';
    },
  },
  {
    field: 'port',
    headerName: 'Port',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    valueGetter: (value, row) => {
      return '-';
    },
  },
  {
    field: 'rpcs',
    headerName: 'RPCs',
    flex: 1,
    type: 'number',
    headerClassName: 'bopmatic-table-column-header',
    valueGetter: (value, row) => {
      if (!row.rpcEndpoints) {
        return null;
      }
      return row.rpcEndpoints.length;
    },
  },
];

const getRowId = (row: ServiceDescription) => {
  if (row.svcHeader?.serviceName) {
    return row.svcHeader?.serviceName;
  }
  return '0';
};

type ServicesTableProps = {
  projId: string | undefined;
  envId: string | undefined;
  tableDescOverride?: string;
  isSimple?: boolean;
};

const ServicesTable: React.FC<ServicesTableProps> = ({
  projId,
  envId,
  tableDescOverride,
  isSimple,
}) => {
  const services = useServices(projId, envId);
  const [servicesLoadingData] = useAtom(servicesLoadingAtom);
  const _columns = isSimple ? [columns[0], columns[4]] : columns; // only take ID/service name column in simple form
  const tableResource = tableDescOverride ? tableDescOverride : 'Services';
  return (
    <BopmaticTableContainer
      tableResource={tableResource}
      includeNumResources={true}
      numResources={services?.length}
    >
      {servicesLoadingData ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : !services ? (
        <EmptyTable resourceName="services" />
      ) : (
        <DataGrid
          rows={services ?? []}
          columns={_columns}
          loading={servicesLoadingData}
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

export default ServicesTable;
