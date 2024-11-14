import { Dayjs } from 'dayjs';
import { GetLogsEntry, GetLogsRequest } from '../../client';
import { getBopmaticClient } from '../../client/client';

export const getLogs = async (
  projectId: string,
  envId: string,
  startTime: Dayjs | null,
  endTime: Dayjs | null,
  serviceName?: string
): Promise<GetLogsEntry[]> => {
  let logs: GetLogsEntry[] = [];
  try {
    if (!startTime || !endTime) {
      throw new Error(
        "startTime or endTime error; they are null but we shouln't get here if so..."
      );
    }
    const _startTime = Math.floor(startTime.valueOf() / 1000);
    const _endTime = Math.floor(endTime.valueOf() / 1000);
    const req: GetLogsRequest = {
      projId: projectId,
      envId: envId,
      startTime: _startTime.toString(),
      endTime: _endTime.toString(),
    };
    // If service is 'allServices' we can just ignore and not filter by a service
    if (serviceName && serviceName !== 'allServices') {
      req.serviceName = serviceName;
    }
    const getLogsReply = await getBopmaticClient().getLogs(req);
    if (getLogsReply.data.entries) {
      logs = getLogsReply.data.entries;
    } // NOTE: Seems that the API does not provide the value if there are no logs
  } catch (error) {
    // TODO: Handle errors
    console.log('Error fetching logs:', error);
    const e = error as Error;
    throw new Error(e.message);
  }

  return logs;
};
