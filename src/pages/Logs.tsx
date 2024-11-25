import React, { useEffect, useState } from 'react';
import PageHeader from '../components/pageHeader/pageHeader';
import {
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useEnvironments } from '../hooks/useEnvironments';
import { useProjects } from '../hooks/useProjects';
import { useServices } from '../hooks/useServices';
import dayjs, { Dayjs } from 'dayjs';
import LogsTable from '../components/tables/LogsTable';
import Button from '@mui/material/Button';
import { getLogs } from '../components/utils/logUtils';
import { GetLogsEntry } from '../client';
import { useSearchParams } from 'react-router-dom';
import { useGridApiRef } from '@mui/x-data-grid';

const Logs: React.FC = () => {
  const [envId, setEnvId] = useState<string>('');
  const [projId, setProjId] = useState<string>('');
  const [service, setService] = useState<string>('allServices');
  const [startTime, setStartTime] = useState<Dayjs | null>(
    dayjs().subtract(24, 'hour')
  );
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs());
  const environments = useEnvironments();
  const projects = useProjects();
  const services = useServices(projId, envId);
  const [logs, setLogs] = useState<GetLogsEntry[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(false);
  const [isLogsInitialized, setIsLogsInitialized] = useState<boolean>(false);
  const [logsError, setLogsError] = useState<string>();
  const [searchParams] = useSearchParams();
  const apiRef = useGridApiRef(); // Correctly typed API reference

  useEffect(() => {
    if (environments && environments.length) {
      setEnvId(environments[0].id as string);
    }
  }, [environments]);

  useEffect(() => {
    if (projects && projects.length) {
      if (searchParams.get('projectId')) {
        setProjId(searchParams.get('projectId') as string);
      } else {
        setProjId(projects[0].id as string);
      }
    }
  }, [projects, searchParams]);

  useEffect(() => {
    if (services && services.length) {
      if (searchParams.get('serviceName')) {
        setService(searchParams.get('serviceName') as string);
      } else {
        setService('allServices');
      }
    }
  }, [searchParams, services]);

  const handleEnvChange = (event: SelectChangeEvent) => {
    setEnvId(event.target.value);
    setService(''); // reset service when env or proj change
  };

  const handleProjChange = (event: SelectChangeEvent) => {
    setProjId(event.target.value);
    setService(''); // reset service when env or proj change
  };

  const handleServiceChange = (event: SelectChangeEvent) => {
    setService(event.target.value);
  };

  const handleStartTimeChange = (newDate: Dayjs | null) => {
    setStartTime(newDate);
  };

  const handleEndTimeChange = (newDate: Dayjs | null) => {
    setEndTime(newDate);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoadingLogs(true);
    getLogs(projId, envId, startTime, endTime, service)
      .then((logs) => {
        setLogs(logs);
      })
      .catch((error) => {
        setLogsError(error);
      })
      .finally(() => {
        setIsLoadingLogs(false);
        setIsLogsInitialized(true);
      });
  };

  const downloadLogsHandler = () => {
    if (!apiRef.current) return;

    const fileName = `${projId}_${service}_${startTime?.unix()}_${endTime?.unix()}_logs.txt`;
    const visibleSortedFilteredRows = apiRef.current
      .getSortedRowIds()
      .map((id) => {
        return apiRef.current.getRow(id);
      });

    const jsonString = JSON.stringify(visibleSortedFilteredRows, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div style={{ minWidth: '760px' }}>
      <PageHeader title="Logs" hideEnvironment={true} />
      <div className="p-6 bg-white rounded border-bopgreyborder border">
        <form onSubmit={handleFormSubmit}>
          <div className="flex justify-between">
            <div className="flex">
              <FormControl sx={{ minWidth: 100 }}>
                <InputLabel id="env-label">Environment</InputLabel>
                <Select
                  labelId="env-label"
                  id="env"
                  value={envId}
                  onChange={handleEnvChange}
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
              <FormControl sx={{ ml: 1, minWidth: 120 }}>
                <InputLabel id="proj-label">Project</InputLabel>
                <Select
                  labelId="proj-label"
                  id="proj"
                  value={projId}
                  onChange={handleProjChange}
                  autoWidth
                  label="Project"
                >
                  {projects?.map((projDesc, index) => {
                    return (
                      <MenuItem value={projDesc.id} key={index}>
                        {projDesc.header?.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl sx={{ ml: 1, minWidth: 120 }}>
                <InputLabel id="service-label">Service</InputLabel>
                <Select
                  labelId="service-label"
                  id="service"
                  value={service}
                  onChange={handleServiceChange}
                  autoWidth
                  label="Service"
                >
                  <MenuItem value={'allServices'}>All services</MenuItem>
                  {services?.map((serviceDesc, index) => {
                    return (
                      <MenuItem
                        value={serviceDesc.svcHeader?.serviceName}
                        key={index}
                      >
                        {serviceDesc.svcHeader?.serviceName}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <div className="flex">
              <div className="ml-2">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Log start time (UTC)"
                    value={startTime}
                    onChange={handleStartTimeChange}
                  />
                </LocalizationProvider>
              </div>
              <div className="ml-2">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Log end time (UTC)"
                    value={endTime}
                    onChange={handleEndTimeChange}
                  />
                </LocalizationProvider>
              </div>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ ml: 1, fontWeight: 'bold', maxHeight: 55 }}
              >
                View logs
              </Button>
            </div>
          </div>
        </form>
        <LogsTable
          logEntries={logs}
          isLoadingLogs={isLoadingLogs}
          isLogsInitialized={isLogsInitialized}
          logsError={logsError}
          apiRef={apiRef}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={!logs.length}
          onClick={downloadLogsHandler}
          sx={{ ml: 1, fontWeight: 'bold', maxHeight: 55 }}
        >
          Download logs
        </Button>
      </div>
    </div>
  );
};

export default Logs;
