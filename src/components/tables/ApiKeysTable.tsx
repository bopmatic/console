import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { ApiKeyDescription } from '../../client';
import BopmaticTableContainer from './BopmaticTableContainer';
import { fetchApiKeyData, useApiKeys } from '../../hooks/useApiKeys';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { bopmaticDateFormat_Grids } from '../utils/dateUtils';
import { useSetAtom } from 'jotai';
import { apiKeysAtom, apiKeysLoadingAtom } from '../../atoms';
import CreateApiKeyModal from '../createApiKeyModal/CreateApiKeyModal';
import DeleteApiKeyModal from '../deleteApiKeyModal/DeleteApiKeyModal';

let rows: ApiKeyDescription[];

const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: 'keyId',
    headerName: 'Key ID',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    minWidth: 150,
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    minWidth: 150,
  },
  {
    field: 'description',
    headerName: 'Description',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    minWidth: 150,
  },
  {
    field: 'createTime',
    headerName: 'Creation date',
    type: 'dateTime',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    minWidth: 175,
    valueGetter: (value) => {
      if (!value) {
        return value;
      }
      return new Date(parseInt(value));
    },
    valueFormatter: (value?: Date) => {
      if (value instanceof Date) {
        return bopmaticDateFormat_Grids(value);
      }
      return ''; // Fallback if value is not a valid Date
    },
  },
  {
    field: 'expireTime',
    headerName: 'Expiration date',
    type: 'dateTime',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    minWidth: 175,
    valueGetter: (value) => {
      if (!value) {
        return value;
      }
      return new Date(parseInt(value));
    },
    valueFormatter: (value?: Date) => {
      if (value instanceof Date) {
        return bopmaticDateFormat_Grids(value);
      }
      return ''; // Fallback if value is not a valid Date
    },
  },
];

const getRowId = (row: ApiKeyDescription) => {
  if (row.keyId) {
    return row.keyId;
  }
  return '0';
};

const ApiKeysTable: React.FC = () => {
  const [apiKeys, isLoading] = useApiKeys();
  const setApiKeys = useSetAtom(apiKeysAtom);
  const setApiKeysLoading = useSetAtom(apiKeysLoadingAtom);
  const [selectedKeysArr, setSelectedKeysArr] =
    React.useState<GridRowSelectionModel>([]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  const refreshKeys = () => {
    setApiKeysLoading(true);
    fetchApiKeyData()
      .then((keys) => {
        if (keys) {
          setApiKeys(keys);
        }
      })
      .catch((err) => {
        console.log('Error fetching API Key data:', err);
      })
      .finally(() => {
        setApiKeysLoading(false);
      });
  };

  const handleSelectionChange = (selection: GridRowSelectionModel) => {
    setSelectedKeysArr(selection);
  };

  const showCreateKey = () => {
    handleOpen();
  };

  const showDeleteKey = () => {
    handleOpenDelete();
  };

  return (
    <BopmaticTableContainer
      tableResource="API Keys"
      includeNumResources={true}
      numResources={apiKeys?.length}
      actionButtonContainer={
        <div>
          <Button
            variant="outlined"
            color="primary"
            onClick={showDeleteKey}
            sx={{
              borderColor: '#D7DBEC',
              color: '#5A607F',
            }}
          >
            <div className="flex align-middle">
              <span>
                <DeleteIcon />
              </span>
              <div className="ml-1">Delete</div>
            </div>
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={showCreateKey}
            //onClick={createKey}
            sx={{ ml: 2, minWidth: 150 }}
          >
            <div className="flex align-middle">
              <span>
                <AddIcon />
              </span>
              <div className="ml-1">Create key</div>
            </div>
          </Button>
        </div>
      }
    >
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={apiKeys ?? []}
          loading={isLoading}
          columns={columns}
          getRowId={getRowId}
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
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={handleSelectionChange}
          sx={{
            border: 'none',
            '.MuiDataGrid-footerContainer': { borderTop: 'none' },
            '& .MuiDataGrid-columnHeaders': {
              borderBottom: '1px solid var(--divider, rgba(230, 233, 244, 1))',
            },
          }}
        />
      </Box>
      <CreateApiKeyModal
        open={open}
        handleClose={handleClose}
        refreshKeysCallback={refreshKeys}
      />
      <DeleteApiKeyModal
        open={openDelete}
        handleClose={handleCloseDelete}
        refreshKeysCallback={refreshKeys}
        selectedKeysArr={selectedKeysArr}
      />
    </BopmaticTableContainer>
  );
};

export default ApiKeysTable;
