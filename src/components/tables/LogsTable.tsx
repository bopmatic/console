import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { GetLogsEntry } from '../../client';
import CircularProgress from '@mui/material/CircularProgress';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { useEffect } from 'react';

// Wrapper type so we can add a unique ID to each logs entry.
// This is required by Material UI Data Grid to property filter data in the grid.
type GetLogsEntryWrapper = GetLogsEntry & {
  id: string;
};

let rows: GetLogsEntryWrapper[];
const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: 'timestamp',
    headerName: 'Timestamp (UTC)',
    flex: 1,
    headerClassName: 'bopmatic-table-column-header',
    minWidth: 200,
    valueGetter: (value, row) => {
      if (!row.timestamp) {
        return null;
      }
      return new Date(parseInt(row.timestamp) * 1000).toISOString();
    },
  },
  {
    field: 'message',
    headerName: 'Message',
    flex: 2,
    headerClassName: 'bopmatic-table-column-header',
    minWidth: 400,
  },
];

type LogsTableProps = {
  logEntries: GetLogsEntry[] | undefined;
  isLoadingLogs: boolean;
  isLogsInitialized: boolean;
  logsError: string | undefined;
  apiRef: React.MutableRefObject<GridApiCommunity>;
};

const generateUUID = (): string => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line
  return (([1e7] as any) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};

const LogsTable: React.FC<LogsTableProps> = ({
  logEntries,
  isLoadingLogs,
  isLogsInitialized,
  logsError,
  apiRef,
}) => {
  // This is required by Material UI Data Grid to property filter data in the grid.
  const [logEntryWrappers, setLogEntryWrappers] = React.useState<
    GetLogsEntryWrapper[] | undefined
  >();
  // This is required by Material UI Data Grid to property filter data in the grid.
  useEffect(() => {
    if (logEntries) {
      // wrap each logEntry so we can add an ID required by Data Grid so we can filter properly
      setLogEntryWrappers(
        logEntries.map((l) => {
          const w: GetLogsEntryWrapper = {
            ...l,
            id: generateUUID(),
          };
          return w;
        })
      );
    }
  }, [logEntries]);
  if (isLoadingLogs) {
    return (
      <div className="flex justify-center m-10">
        <CircularProgress />
      </div>
    );
  } else if (!isLogsInitialized) {
    return (
      <div className="m-10">
        <div className="flex justify-center font-bold text-bopgreytext">
          <div>Select log parameters</div>
        </div>
        <div className="flex justify-center text-bopgreytext">
          <div>
            Use the controls above to choose the log search criteria then choose
            "View logs".
          </div>
        </div>
      </div>
    );
  } else if (logsError) {
    return (
      <div className="m-10">
        <div className="flex justify-center font-bold text-boperror">
          <div>Error fetching logs:</div>
        </div>
        <div className="flex justify-center text-boperror">
          <div>{logsError}</div>
        </div>
      </div>
    );
  } else if (logEntries && logEntries.length === 0) {
    return (
      <div className="m-10">
        <div className="flex justify-center font-bold text-bopgreytext">
          <div>No logs found</div>
        </div>
        <div className="flex justify-center text-bopgreytext">
          <div>
            Update the search parameters above and choose "View logs" to find
            logs with different parameters.
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <DataGrid
        rows={logEntryWrappers ?? []}
        columns={columns}
        loading={isLoadingLogs}
        // getRowId={getRowId}
        apiRef={apiRef}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
          sorting: {
            sortModel: [{ field: 'timestamp', sort: 'asc' }],
          },
        }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
        sx={{
          border: 'none',
          '.MuiDataGrid-footerContainer': { borderTop: 'none' },
          '& .MuiDataGrid-columnHeaders': {
            borderBottom: '1px solid var(--divider, rgba(230, 233, 244, 1))',
          },
        }}
      />
    );
  }
};

export default LogsTable;
