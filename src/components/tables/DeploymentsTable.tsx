import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ColoredIconCell from './ColoredIconCell';
import {
  ColoredIconColumnType,
  formatCompletionTime,
  parseDeployTypeOrInitiator,
} from './utils';
import BopmaticLink from '../link/BopmaticLink';
import { DeploymentDescription } from '../../client';
import { useDeployments } from '../../hooks/useDeployments';
import { useAtom } from 'jotai';
import { deploymentsLoadingAtom } from '../../atoms';
import BopmaticTableContainer from './BopmaticTableContainer';
import { useEnvironmentName } from '../../hooks/useEnvironmentName';
import CircularProgress from '@mui/material/CircularProgress';
import EmptyTable from './EmptyTable';

let rows: DeploymentDescription[];
const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: 'id',
    headerName: 'Deployment ID',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    renderCell: (params) => {
      return (
        <BopmaticLink
          to={`/projects/${params.row.header?.projId}/deployments/${params.value}`}
        >
          {params.value}
        </BopmaticLink>
      );
    },
  },
  {
    field: 'packageId',
    headerName: 'Package ID',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    renderCell: (params) => {
      return (
        <BopmaticLink
          to={`/projects/${params.row.header?.projId}/packages/${params.value}`}
        >
          {params.value}
        </BopmaticLink>
      );
    },
    valueGetter: (value, row) => {
      if (!row.header?.pkgId) {
        return null;
      }
      return row.header?.pkgId;
    },
  },
  {
    field: 'state',
    headerName: 'Deployment state',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    renderCell: (params) => {
      return (
        <ColoredIconCell
          value={params.value}
          type={ColoredIconColumnType.DEPLOYMENT_STATE}
        />
      );
    },
  },
  {
    field: 'initiator',
    headerName: 'Initiator',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    valueGetter: (value, row) => {
      if (!row.header?.initiator) {
        return null;
      }
      return parseDeployTypeOrInitiator(row.header?.initiator);
    },
  },
  {
    field: 'type',
    headerName: 'Type',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    valueGetter: (value, row) => {
      if (!row.header?.type) {
        return null;
      }
      return parseDeployTypeOrInitiator(row.header?.type);
    },
  },
  {
    field: 'completionTime',
    headerName: 'Completion date',
    type: 'dateTime',
    flex: 2,
    headerClassName: 'bopmatic-table-column-header',
    valueGetter: (value, row) => {
      if (!row.endTime) {
        return null;
      }
      // TODO: Fix this once mike returns timestamps for us here
      return new Date(parseInt(row.endTime) * 1000);
    },
  },
  {
    field: 'totalDeployTime',
    headerName: 'Total deployment time',
    type: 'number',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    valueGetter: (value, row) => {
      if (!row.createTime || !row.endTime) {
        return null;
      }
      return formatCompletionTime(
        parseInt(row.endTime) - parseInt(row.createTime)
      );
    },
  },
];

const getRowId = (row: DeploymentDescription) => {
  if (row.id) {
    return row.id;
  }
  return '0';
};

type DeploymentsTableProps = {
  projId: string | undefined;
  envId: string | undefined;
};

const DeploymentsTable: React.FC<DeploymentsTableProps> = ({
  projId,
  envId,
}) => {
  const deployments = useDeployments(projId, envId);
  const [deploymentLoadingData] = useAtom(deploymentsLoadingAtom);
  return (
    <BopmaticTableContainer
      tableResource="Deployments"
      includeNumResources={true}
      numResources={deployments?.length}
      subtitle="Note: Use the Bopmatic CLI to manage your deployments"
    >
      {deploymentLoadingData ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : !deployments ? (
        <EmptyTable resourceName="deployments" />
      ) : (
        <DataGrid
          rows={deployments ?? []}
          columns={columns}
          getRowId={getRowId}
          loading={deploymentLoadingData}
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

export default DeploymentsTable;
