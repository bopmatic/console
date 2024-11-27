import { atom } from 'jotai';
import {
  ApiKeyDescription,
  DatabaseDescription,
  DatastoreDescription,
  DeploymentDescription,
  EnvironmentDescription,
  ListPackagesReplyListPackagesItem,
  PackageDescription,
  ProjectDescription,
  ServiceDescription,
} from './client';
import {
  ACCESS_TOKEN_KEY,
  ID_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USERNAME_KEY,
} from './constants';
import { updateBopmaticClientToken } from './client/client';

export interface ProjectServiceNames {
  projectId: string | undefined;
  serviceNames: Array<string>;
}

export interface ProjectDatabaseNames {
  projectId: string | undefined;
  databaseNames: Array<string>;
}

export interface ProjectDatastoreNames {
  projectId: string | undefined;
  datastoreNames: Array<string>;
}

export interface ProjectDeploymentIds {
  projectId: string | undefined;
  deploymentIds: Array<string>;
}

export interface ProjectPackageIds {
  projectId: string | undefined;
  packageItems: Array<ListPackagesReplyListPackagesItem>;
}

export interface ServiceDescriptionProjectMap {
  [key: string]: ServiceDescription[]; // key = projectId
}

export interface DatabaseDescriptionProjectMap {
  [key: string]: DatabaseDescription[]; // key = projectId
}

export interface DatastoreDescriptionProjectMap {
  [key: string]: DatastoreDescription[]; // key = projectId
}

export const projectsAtom = atom<ProjectDescription[] | null>(null);
export const projectsLoadingAtom = atom<boolean>(true);

export const environmentsAtom = atom<EnvironmentDescription[] | null>(null);
export const environmentsLoadingAtom = atom<boolean>(true);

export const servicesAtom = atom<ServiceDescriptionProjectMap>({});
export const servicesLoadingAtom = atom<boolean>(true);
export const projectServiceNamesAtom = atom<Array<ProjectServiceNames> | null>(
  null
);

export const databasesAtom = atom<DatabaseDescriptionProjectMap>({});
export const databasesLoadingAtom = atom<boolean>(true);
export const projectDatabaseNamesAtom =
  atom<Array<ProjectDatabaseNames> | null>(null);

export const datastoresAtom = atom<DatastoreDescriptionProjectMap>({});
export const datastoresLoadingAtom = atom<boolean>(true);
export const projectDatastoreNamesAtom =
  atom<Array<ProjectDatastoreNames> | null>(null);

export const deploymentsAtom = atom<DeploymentDescription[] | null>(null);
export const deploymentsLoadingAtom = atom<boolean>(true);
export const projectDeploymentIdsAtom =
  atom<Array<ProjectDeploymentIds> | null>(null);

export const packagesAtom = atom<PackageDescription[] | null>(null);
export const packagesLoadingAtom = atom<boolean>(true);
export const projectPackageIdsAtom = atom<Array<ProjectPackageIds> | null>(
  null
);

export const apiKeysAtom = atom<ApiKeyDescription[] | null>(null);
export const apiKeysLoadingAtom = atom<boolean>(true);

// Initialize the token from localStorage (if it exists)
const initialToken = localStorage.getItem(ACCESS_TOKEN_KEY) || null;
const initialRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || null;
const initialIdToken = localStorage.getItem(ID_TOKEN_KEY) || null;
const initialUsername = localStorage.getItem(USERNAME_KEY) || null;

// Create the Jotai atom
export const accessTokenAtom = atom<string | null>(initialToken);
export const refreshTokenAtom = atom<string | null>(initialRefreshToken);
export const idTokenAtom = atom<string | null>(initialIdToken);
export const usernameAtom = atom<string | null>(initialUsername);

// Create an atom that listens for updates and saves them to localStorage
export const accessTokenWithPersistenceAtom = atom(
  (get) => get(accessTokenAtom),
  (get, set, newToken: string | null) => {
    set(accessTokenAtom, newToken);
    if (newToken) {
      updateBopmaticClientToken(newToken);
      localStorage.setItem(ACCESS_TOKEN_KEY, newToken);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  }
);

export const refreshTokenWithPersistenceAtom = atom(
  (get) => get(refreshTokenAtom),
  (get, set, newToken: string | null) => {
    set(refreshTokenAtom, newToken);
    if (newToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, newToken);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }
);

export const idTokenWithPersistenceAtom = atom(
  (get) => get(idTokenAtom),
  (get, set, newToken: string | null) => {
    set(idTokenAtom, newToken);
    if (newToken) {
      localStorage.setItem(ID_TOKEN_KEY, newToken);
    } else {
      localStorage.removeItem(ID_TOKEN_KEY);
    }
  }
);

export const usernameWithPersistenceAtom = atom(
  (get) => get(usernameAtom),
  (get, set, newUsername: string | null) => {
    set(usernameAtom, newUsername);
    if (newUsername) {
      localStorage.setItem(USERNAME_KEY, newUsername);
    } else {
      localStorage.removeItem(USERNAME_KEY);
    }
  }
);

export enum ApiHealth {
  HEALTHY = 'HEALTHY',
  DEGRADED = 'DEGRADED',
  UNHEALTHY = 'UNHEALTHY',
  UNKNOWN = 'UNKNOWN',
}

// There will be one atom per api per service per project
export interface ApiHealthWrapper {
  envId: string | undefined;
  projectId: string | undefined;
  serviceName: string | undefined;
  apiName: string | undefined;
  health: ApiHealth;
}

export const apiHealthAtom = atom<ApiHealthWrapper[] | null>(null);
