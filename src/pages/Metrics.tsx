import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MetricSelectionCard from '../components/metricSelectionCard/MetricSelectionCard';
import BopmaticLink from '../components/link/BopmaticLink';
import { useProjects } from '../hooks/useProjects';
import { useEnvironment } from '../hooks/useEnvironment';
import CircularProgress from '@mui/material/CircularProgress';
import {
  fetchAllDatabaseTreeElements,
  fetchAllDatastoreTreeElements,
  fetchAllServicesTreeElements,
  getRowId,
  getSelectedMetrics,
  ListMetricsEntryWrapper,
  MetricEntriesTableColumns,
  MetricsNavigationTreeElement,
  ROOT_NODE,
  updateMetricsSelection,
} from '../components/utils/customMetricsUtils';
import getBopmaticClient from '../client/client';
import { MetricsScope } from '../client';
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import CustomMetricsLineChart from '../components/customMetricsLineChart/CustomMetricsLineChart';

const Metrics: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const projects = useProjects();
  const environment = useEnvironment();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [metricEntries, setMetricsEntries] = useState<
    ListMetricsEntryWrapper[]
  >([]);
  const [isLoadingMetricEntries, setIsLoadingMetricEntries] =
    useState<boolean>(false);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [currentMetricNavigationElement, setCurrentMetricNavigationElement] =
    useState<MetricsNavigationTreeElement>(ROOT_NODE);
  const [breadcumbs, setBreadcumbs] = useState<MetricsNavigationTreeElement[]>([
    ROOT_NODE,
  ]);
  const [selectedMetricEntries, setSelectedMetricEntries] =
    React.useState<GridRowSelectionModel>([]);
  const [allSelectedMetrics, setAllSelectedMetrics] = React.useState<
    ListMetricsEntryWrapper[]
  >([]);

  const handleClose = () => {
    setAnchorEl(null);
  };
  // Helper function to batch the API calls for ListMetrics()
  const getMetricEntries = (scopes: MetricsScope[]) => {
    const apiCalls = [];
    for (let i = 0; i < scopes.length; i++) {
      apiCalls.push(
        getBopmaticClient().listMetrics({
          scope: scopes[i],
        })
      );
    }
    Promise.all(apiCalls)
      .then((responses) => {
        const e: ListMetricsEntryWrapper[] = [];
        for (const res of responses) {
          if (res.data.entries) {
            e.push(
              ...res.data.entries.map((entry) => {
                const w: ListMetricsEntryWrapper = {
                  ...entry,
                  isSelected: false,
                };
                return w;
              })
            );
          }
        }
        setMetricsEntries(e);
      })
      .catch((err) => {
        console.log('Failed making API calls for ListMetrics:', err);
      })
      .finally(() => {
        setIsLoadingMetricEntries(false);
      });
  };
  // on-page-load go and fetch the MetricEntries available for each resource type once
  useEffect(() => {
    getMetricEntries([
      'METRIC_SCOPE_SERVICE',
      'METRIC_SCOPE_DATABASE',
      'METRIC_SCOPE_DATASTORE',
    ]);
  }, []);
  /**
   * TODO after MVP: Create caching layer here to avoid re-calling listServices/listDatabases/listDatastores
   * @param index
   */
  const handleElementClick = (index: number) => {
    if (currentMetricNavigationElement.children) {
      const nextElement = currentMetricNavigationElement.children?.[index];
      if (nextElement.cardContent === 'Services' && !nextElement?.children) {
        setIsLoading(true);
        fetchAllServicesTreeElements(projects, environment, metricEntries)
          .then((serviceElements) => {
            if (nextElement) {
              nextElement.children = serviceElements;
              setCurrentMetricNavigationElement(nextElement);
              setBreadcumbs([...breadcumbs, nextElement]);
            }
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else if (
        nextElement.cardContent === 'Databases' &&
        !nextElement?.children
      ) {
        setIsLoading(true);
        fetchAllDatabaseTreeElements(projects, environment, metricEntries)
          .then((databaseElements) => {
            if (nextElement) {
              nextElement.children = databaseElements;
              setCurrentMetricNavigationElement(nextElement);
              setBreadcumbs([...breadcumbs, nextElement]);
            }
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else if (
        nextElement.cardContent === 'Datastores' &&
        !nextElement?.children
      ) {
        setIsLoading(true);
        fetchAllDatastoreTreeElements(projects, environment, metricEntries)
          .then((datastoreElements) => {
            if (nextElement) {
              nextElement.children = datastoreElements;
              setCurrentMetricNavigationElement(nextElement);
              setBreadcumbs([...breadcumbs, nextElement]);
            }
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        // This was a specific service, database, or datastore element
        const nextElement = currentMetricNavigationElement.children?.[index];
        if (nextElement) {
          // set the current selected elements from the grid
          const s = getSelectedMetrics([ROOT_NODE]);
          setSelectedMetricEntries(
            s
              .filter(
                (w) =>
                  w.projectId === nextElement.projectName &&
                  w.resourceName === nextElement.cardContent
              )
              .map((w) => w.name) as GridRowSelectionModel
          );
          setCurrentMetricNavigationElement(nextElement);
          setBreadcumbs([...breadcumbs, nextElement]);
        }
      }
    }
  };

  const breadcumbClickHandler = (index: number) => {
    setCurrentMetricNavigationElement(breadcumbs[index]);
    setBreadcumbs(breadcumbs.slice(0, index + 1));
  };

  // note: selection is an array of metric names, i.e. ["DurationMS", "Errors"]
  const handleSelectionChange = (selection: GridRowSelectionModel) => {
    setSelectedMetricEntries(selection);
    updateMetricsSelection(
      currentMetricNavigationElement,
      selection as string[]
    );
    setAllSelectedMetrics(getSelectedMetrics([ROOT_NODE]));
  };

  return (
    <div>
      <CustomMetricsLineChart
        allSelectedMetrics={allSelectedMetrics}
        envId={environment?.id as string}
      />
      <div className="mt-4">
        <h2>Available metrics:</h2>
      </div>
      <div className="flex mt-4 items-center">
        <div>
          <div>Environment:</div>
          <div>
            <Button
              id="env-dropdown-customized-button"
              aria-controls={open ? 'env-dropdown-customized-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              variant="outlined"
              disableElevation
              onClick={handleClick}
              sx={{
                borderColor: '#D7DBEC',
                color: '#5A607F',
                backgroundColor: 'white',
              }}
              endIcon={<KeyboardArrowDownIcon />}
            >
              Production
            </Button>
            <Menu
              id="env-dropdown-customized-menu"
              MenuListProps={{
                'aria-labelledby': 'env-dropdown-customized-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose} disableRipple>
                Production
              </MenuItem>
            </Menu>
          </div>
        </div>
        <div className="ml-4 flex">
          {breadcumbs.map((breadcumb, index) => (
            <React.Fragment key={index}>
              {index < breadcumbs.length - 1 ? (
                <BopmaticLink
                  to="#"
                  onClick={() => {
                    breadcumbClickHandler(index);
                  }}
                >
                  {breadcumb.cardContent}
                </BopmaticLink>
              ) : (
                <div className="font-bold">{breadcumb.cardContent}</div>
              )}
              {index < breadcumbs.length - 1 && breadcumbs.length !== 1 && (
                <span className="ml-4 mr-4 font-bold">&gt;</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="flex mt-4">
        {isLoading || isLoadingMetricEntries ? (
          <CircularProgress />
        ) : currentMetricNavigationElement.children ? (
          currentMetricNavigationElement.children.map(
            (metricsNavigationTreeElement, index) => (
              <div key={index}>
                <MetricSelectionCard
                  cardContent={metricsNavigationTreeElement.cardContent}
                  projectName={metricsNavigationTreeElement.projectName}
                  onClick={() => {
                    handleElementClick(index);
                  }}
                />
              </div>
            )
          )
        ) : (
          <div className="bg-white rounded border-bopgreyborder border p-4 w-full">
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={currentMetricNavigationElement.metricEntries ?? []}
                columns={MetricEntriesTableColumns}
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
                checkboxSelection
                rowSelectionModel={selectedMetricEntries}
                onRowSelectionModelChange={handleSelectionChange}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
                sx={{
                  border: 'none',
                  '.MuiDataGrid-footerContainer': { borderTop: 'none' },
                  '& .MuiDataGrid-columnHeaders': {
                    borderBottom:
                      '1px solid var(--divider, rgba(230, 233, 244, 1))',
                  },
                }}
              />
            </Box>
          </div>
        )}
      </div>
    </div>
  );
};

export default Metrics;
