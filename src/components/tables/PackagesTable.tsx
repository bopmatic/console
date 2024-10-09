import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ColoredIconCell from './ColoredIconCell';
import { ColoredIconColumnType } from './utils';
import BopmaticLink from '../link/BopmaticLink';
import { PackageDescription } from '../../client';
import { usePackages } from '../../hooks/usePackages';

let rows: PackageDescription[];
const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: 'id',
    headerName: 'Package ID',
    flex: 2,
    headerClassName: 'bopmatic-table-column-header',
    renderCell: (params) => {
      return (
        <BopmaticLink to={`/packages/${params.value}`}>
          {params.value}
        </BopmaticLink>
      );
    },
    valueGetter: (value, row) => {
      if (!row.packageId) {
        return null;
      }
      return row.packageId;
    },
  },
  {
    field: 'state',
    headerName: 'Package state',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    renderCell: (params) => {
      return (
        <ColoredIconCell
          value={params.value}
          type={ColoredIconColumnType.PACKAGE_STATE}
        />
      );
    },
  },
  {
    field: 'packageSize',
    headerName: 'Package Size',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
  },
  {
    field: 'uploadTime',
    headerName: 'Upload date',
    type: 'dateTime',
    flex: 2,
    headerClassName: 'bopmatic-table-column-header',
    valueGetter: (value) => {
      if (!value) {
        return null;
      }
      return new Date(parseInt(value) * 1000);
    },
  },
];

const getRowId = (row: PackageDescription) => {
  if (row.packageId) {
    return row.packageId;
  }
  return '0';
};

type PackagesTableProps = {
  projId: string | undefined;
};

const PackagesTable: React.FC<PackagesTableProps> = ({ projId }) => {
  const packages = usePackages(projId);
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={packages ?? []}
        columns={columns}
        loading={!packages}
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

export default PackagesTable;
