import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ColoredIconCell from './ColoredIconCell';
import { ColoredIconColumnType } from './utils';
import { useServices } from '../../hooks/useServices';
import { useAtom } from 'jotai';
import { servicesLoadingAtom } from '../../atoms';
import { useEffect, useState } from 'react';
import BopmaticTableContainer from './BopmaticTableContainer';
import CircularProgress from '@mui/material/CircularProgress';

type FormattedRpcEndpoint = {
  id: string;
  endpointStr: string;
};

let rows: FormattedRpcEndpoint[];
const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: 'api',
    headerName: 'API',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    minWidth: 175,
    valueGetter: (value, row) => {
      if (!row.endpointStr) {
        return null;
      }
      const str = row.endpointStr as string;
      return str.substring(str.lastIndexOf('/') + 1);
    },
  },
  {
    field: 'endpointHealth',
    headerName: 'Endpoint health',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    minWidth: 190,
    renderCell: (params) => {
      return (
        <ColoredIconCell
          value="Healthy"
          type={ColoredIconColumnType.PROJECT_STATE}
        />
      );
    },
  },
  {
    field: 'id',
    headerName: 'Endpoint URL',
    flex: 2,
    headerClassName: 'bopmatic-table-column-header',
  },
];

type RpcEndpointsTableProps = {
  projId: string | undefined;
  envId: string | undefined;
  serviceName: string | undefined;
};

const RpcEndpointsTable: React.FC<RpcEndpointsTableProps> = ({
  projId,
  envId,
  serviceName,
}) => {
  const services = useServices(projId, envId);
  const service = services?.filter(
    (s) => s.svcHeader?.serviceName === serviceName
  );
  const rpcEndpoints =
    service && service[0] ? service[0].rpcEndpoints : undefined;
  const [servicesLoadingData] = useAtom(servicesLoadingAtom);
  const [formattedRpcEndpoints, setFormattedRpcEndpoints] =
    useState<FormattedRpcEndpoint[]>();

  // format the rpcEndpoints so they fit easier in the table
  useEffect(() => {
    if (rpcEndpoints && rpcEndpoints.length) {
      const formatted = rpcEndpoints.map((rpcEndpointValue) => {
        const f: FormattedRpcEndpoint = {
          id: rpcEndpointValue,
          endpointStr: rpcEndpointValue,
        };
        return f;
      });
      setFormattedRpcEndpoints(formatted);
    }
  }, [rpcEndpoints]);

  return (
    <BopmaticTableContainer
      tableResource={`${serviceName} RPC Endpoints`}
      includeNumResources={true}
      numResources={rpcEndpoints?.length}
    >
      {servicesLoadingData ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <DataGrid
          rows={formattedRpcEndpoints ?? []}
          columns={columns}
          loading={servicesLoadingData}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
            sorting: {
              sortModel: [{ field: 'api', sort: 'asc' }],
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

export default RpcEndpointsTable;
