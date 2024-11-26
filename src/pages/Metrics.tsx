import React, { useEffect, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import MetricSelectionCard from '../components/metricSelectionCard/MetricSelectionCard';
import BopmaticLink from '../components/link/BopmaticLink';
import { useProjects } from '../hooks/useProjects';
import CircularProgress from '@mui/material/CircularProgress';
import {
  deselectMetricInTree,
  fetchAllDatabaseTreeElements,
  fetchAllDatastoreTreeElements,
  fetchAllServicesTreeElements,
  getResourceTypeForDisplay,
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
import { FormControl, IconButton, InputLabel, Select } from '@mui/material';
import { useEnvironments } from '../hooks/useEnvironments';
import { Close as CloseIcon } from '@mui/icons-material';

const Metrics: React.FC = () => {
  const projects = useProjects();
  const environments = useEnvironments();
  const [envId, setEnvId] = useState<string>('');
  useEffect(() => {
    if (environments && environments.length) {
      setEnvId(environments[0].id as string);
    }
  }, [environments]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [metricEntries, setMetricsEntries] = useState<
    ListMetricsEntryWrapper[]
  >([]);
  const [isLoadingMetricEntries, setIsLoadingMetricEntries] =
    useState<boolean>(false);
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
  const handleElementClick = (index: number) => {
    if (currentMetricNavigationElement.children) {
      const nextElement = currentMetricNavigationElement.children?.[index];
      if (nextElement.cardContent === 'Services' && !nextElement?.children) {
        setIsLoading(true);
        fetchAllServicesTreeElements(projects, envId, metricEntries)
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
        fetchAllDatabaseTreeElements(projects, envId, metricEntries)
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
        fetchAllDatastoreTreeElements(projects, envId, metricEntries)
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

  const deselectMetric = (
    metricName: string | undefined,
    resourceName: string | undefined,
    projId: string | undefined
  ) => {
    deselectMetricInTree(
      [ROOT_NODE],
      metricName as string,
      resourceName as string,
      projId as string
    );
    setAllSelectedMetrics(getSelectedMetrics([ROOT_NODE]));
    // now determine if the metric is in the current table view
    // Check if the metric is in the current table view
    setSelectedMetricEntries((prevSelected) => {
      if (
        metricName &&
        prevSelected.includes(metricName) &&
        currentMetricNavigationElement.projectName === projId &&
        currentMetricNavigationElement.cardContent === resourceName
      ) {
        // Remove the deselected metric from the current table selections
        return prevSelected.filter((name) => name !== metricName);
      }
      // No update needed if the metric isn't in the current table
      return prevSelected;
    });
  };

  return (
    <div>
      <CustomMetricsLineChart
        allSelectedMetrics={allSelectedMetrics}
        envId={envId as string}
      />
      {allSelectedMetrics && allSelectedMetrics.length > 0 && (
        <div className="mt-2">
          <h2>Selected metrics:</h2>
          {/*this is where we will show selected metrics with an "X" to remove*/}
          <div className="flex">
            {allSelectedMetrics?.map((metricWrapper, index) => {
              return (
                <div
                  key={index}
                  className="bg-white border-bopgreyborder border p-2 rounded mr-2"
                >
                  <div className="flex justify-between align-center">
                    <div className="font-bold text-sm">
                      {metricWrapper.name}
                    </div>
                    <IconButton
                      size="small"
                      sx={{ mt: -1, mr: -1 }}
                      onClick={() =>
                        deselectMetric(
                          metricWrapper.name,
                          metricWrapper.resourceName,
                          metricWrapper.projectId
                        )
                      }
                    >
                      <span className="text-boperror text-sm">
                        <CloseIcon />
                      </span>
                    </IconButton>
                  </div>
                  <div className="text-sm">
                    {getResourceTypeForDisplay(metricWrapper.scope)}
                    {metricWrapper.resourceName}
                  </div>
                  <div className="text-sm">{metricWrapper.projectId}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="mt-4">
        <h2>Available metrics:</h2>
      </div>
      <div className="flex mt-4 items-center">
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="env-label">Environment</InputLabel>
          <Select
            labelId="env-label"
            id="env"
            value={envId}
            autoWidth
            label="Environment"
          >
            {environments?.map((envDesc, index) => {
              return (
                <MenuItem value={envDesc.id} key={index}>
                  {envDesc.header?.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
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
