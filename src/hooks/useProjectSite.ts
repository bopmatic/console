import { useEffect, useState } from 'react';
import { getBopmaticClient } from '../client/client';
import { DescribeSiteRequest } from '../client';

export const useProjectSite = (
  projectId: string | undefined,
  envId: string | undefined
): [string, boolean] => {
  const [site, setSite] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const req: DescribeSiteRequest = {
          projEnvHeader: {
            projId: projectId,
            envId: envId,
          },
        };
        const getSiteReply = await getBopmaticClient().describeSite(req);
        if (getSiteReply.data.siteEndpoint) {
          setSite(getSiteReply.data.siteEndpoint);
        } else {
          throw new Error('DescribeSite did not return siteEndpoint property.');
        }
      } catch (error) {
        // TODO: Handle errors
        console.log('error:', error);
        setSite('-');
      }
      setIsLoading(false);
    };

    if (projectId && envId && !isLoading) {
      setIsLoading(true);
      fetchData();
    }
  }, [projectId, envId]); // ignore dependency warning

  return [site, isLoading];
};
