import { atom } from 'jotai';
import {
  DatabaseDescription,
  DatastoreDescription,
  DeploymentDescription,
  EnvironmentDescription,
  ListPackagesReplyListPackagesItem,
  PackageDescription,
  ProjectDescription,
  ServiceDescription,
} from './client';

export const projectsAtom = atom<ProjectDescription[] | null>(null);
export const projectsLoadingAtom = atom<boolean>(false);

export const environmentsAtom = atom<EnvironmentDescription[] | null>(null);
export const environmentsLoadingAtom = atom<boolean>(false);

export const servicesAtom = atom<ServiceDescription[] | null>(null);
export const servicesLoadingAtom = atom<boolean>(false);
export const serviceNamesAtom = atom<Array<string> | null>(null);

export const databasesAtom = atom<DatabaseDescription[] | null>(null);
export const databasesLoadingAtom = atom<boolean>(false);
export const databaseNamesAtom = atom<Array<string> | null>(null);

export const datastoresAtom = atom<DatastoreDescription[] | null>(null);
export const datastoresLoadingAtom = atom<boolean>(false);
export const datastoreNamesAtom = atom<Array<string> | null>(null);

export const deploymentsAtom = atom<DeploymentDescription[] | null>(null);
export const deploymentsLoadingAtom = atom<boolean>(false);
export const deploymentIdsAtom = atom<Array<string> | null>(null);

export const packagesAtom = atom<PackageDescription[] | null>(null);
export const packagesLoadingAtom = atom<boolean>(false);
export const packageIdsAtom =
  atom<Array<ListPackagesReplyListPackagesItem> | null>(null);
