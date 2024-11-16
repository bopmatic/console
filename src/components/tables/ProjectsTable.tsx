import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ColoredIconCell from './ColoredIconCell';
import { ColoredIconColumnType } from './utils';
import BopmaticLink from '../link/BopmaticLink';
import { useProjects } from '../../hooks/useProjects';
import { useEffect } from 'react';
import { ProjectDescription } from '../../client';
import BopmaticTableContainer from './BopmaticTableContainer';
import { bopmaticDateFormat_Grids } from '../utils/dateUtils';

let rows: ProjectDescription[];

const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 2,
    headerClassName: 'bopmatic-table-column-header',
    valueGetter: (value, row) => {
      if (!row.header?.name) {
        return null;
      }
      return row.header?.name;
    },
  },
  {
    field: 'id',
    headerName: 'Project ID',
    flex: 2,
    headerClassName: 'bopmatic-table-column-header',
    renderCell: (params) => {
      return (
        <BopmaticLink to={`/projects/${params.id}`}>
          {params.value}
        </BopmaticLink>
      );
    },
  },
  {
    field: 'state',
    headerName: 'Project state',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    renderCell: (params) => {
      return (
        <ColoredIconCell
          value={params.value}
          type={ColoredIconColumnType.PROJECT_STATE}
        />
      );
    },
  },
  {
    field: 'prodHealth',
    headerName: 'Prod health',
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
    field: 'createTime',
    headerName: 'Creation date',
    type: 'dateTime',
    flex: 2,
    headerClassName: 'bopmatic-table-column-header',
    valueGetter: (value) => {
      if (!value) {
        return value;
      }
      return new Date(parseInt(value) * 1000);
    },
    valueFormatter: (value?: Date) => {
      if (value instanceof Date) {
        return bopmaticDateFormat_Grids(value);
      }
      return ''; // Fallback if value is not a valid Date
    },
  },
  {
    field: 'dnsPrefix',
    headerName: 'DNS Prefix',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    valueGetter: (value, row) => {
      if (!row.header?.dnsPrefix) {
        return null;
      }
      return row.header?.dnsPrefix;
    },
  },
  {
    field: 'dnsDomain',
    headerName: 'DNS Domain',
    flex: 2,
    headerClassName: 'bopmatic-table-column-header',
    valueGetter: (value, row) => {
      if (!row.header?.dnsDomain) {
        return null;
      }
      return row.header?.dnsDomain;
    },
  },
];

const ProjectsTable: React.FC = () => {
  const projectsData = useProjects();

  return (
    <BopmaticTableContainer
      tableResource="Projects"
      includeNumResources={true}
      numResources={projectsData?.length}
    >
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={projectsData ?? []}
          loading={!projectsData}
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

export default ProjectsTable;
