/**
 * TODO: After MVP when customers can create their own environments, expand on this
 * to leverage the useEnvironments hook to map environment ID to environment name. For
 * now this is just hardcoded since we only ever have "Prod" for MVP
 * @param envId
 */
export const useEnvironmentName = (envId: string | undefined) => {
  return 'Prod';
};
