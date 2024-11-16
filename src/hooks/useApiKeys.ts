import { useEffect } from 'react';
import getBopmaticClient from '../client/client';
import { ApiKeyDescription } from '../client';
import { useAtom } from 'jotai/index';
import { apiKeysAtom, apiKeysLoadingAtom } from '../atoms';

export const fetchApiKeyData = async () => {
  const apiKeys: ApiKeyDescription[] = [];
  try {
    const res = await getBopmaticClient().listApiKeys({});
    const apiCalls = [];
    if (res.data.keyIds && res.data.keyIds.length) {
      for (let i = 0; i < res.data.keyIds.length; i++) {
        apiCalls.push(
          getBopmaticClient().describeApiKey({
            keyId: res.data.keyIds[i],
          })
        );
      }
      const allResponse = await Promise.all(apiCalls);
      for (const response of allResponse) {
        if (response.data.desc) {
          const keyDesc: ApiKeyDescription = response.data.desc;
          apiKeys.push(keyDesc);
        }
      }
      return apiKeys;
    } else {
      // no data present in response, return empty array
      return [];
    }
  } catch (error) {
    throw error;
  }
};

export const useApiKeys = (): [ApiKeyDescription[] | null, boolean] => {
  const [apiKeys, setApiKeys] = useAtom(apiKeysAtom);
  const [isLoading, setIsLoading] = useAtom(apiKeysLoadingAtom);
  useEffect(() => {
    setIsLoading(true);
    fetchApiKeyData()
      .then((keys) => {
        if (keys !== undefined) {
          setApiKeys(keys);
        }
      })
      .catch((err) => {
        console.log('Error fetching API Key data:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []); // only run one time at loading
  return [apiKeys, isLoading];
};
