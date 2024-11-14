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
import { useEnvironment } from '../../hooks/useEnvironment';

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
    field: 'environmentId',
    headerName: 'Environment',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    valueGetter: (value, row) => {
      if (!row.header?.envId) {
        return null;
      }
      return row.header?.envId;
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
    flex: 1,
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

type DeploymentsByPackageTableProps = {
  projId: string | undefined;
  packageId: string | undefined;
};

const DeploymentsByPackageTable: React.FC<DeploymentsByPackageTableProps> = ({
  projId,
  packageId,
}) => {
  const environment = useEnvironment();
  // TODO: WHen environments are dynamic, create a map of deployments keyed on environment and filter
  //        through all environments based on matching package ID
  const prodDeployments = useDeployments(projId, environment?.id);
  const deploymentsByPackageId = prodDeployments?.filter(
    (d) => d.header?.pkgId === packageId
  );
  const [deploymentLoadingData] = useAtom(deploymentsLoadingAtom);
  return (
    <BopmaticTableContainer
      tableResource="Deployments of this package"
      includeNumResources={true}
      numResources={deploymentsByPackageId?.length}
      subtitle="Note: Use the Bopmatic CLI to manage your deployments"
    >
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={deploymentsByPackageId ?? []}
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
      </Box>
    </BopmaticTableContainer>
  );
};

export default DeploymentsByPackageTable;