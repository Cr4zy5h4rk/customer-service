import { Type } from '@angular/core';

import { loadRemote } from '@module-federation/enhanced/runtime';

import NavbarItem from 'app/layouts/navbar/navbar-item.model';

export const loadNavbarItems = async (service: string): Promise<NavbarItem[]> =>
  loadRemote<{ default: NavbarItem[] }>(`${service}/entity-navbar-items`).then(items => items?.default ?? []);

export const loadEntityRoutes = (service: string): Promise<Type<any>> =>
  loadRemote<Type<any>>(`${service}/entity-routes`) as Promise<Type<any>>;
