import { Routes } from '@angular/router';

import { ASC } from 'app/config';
import { userRouteAccessService } from 'app/core/auth';

import AddressResolve from './route/address-routing-resolve.service';

const addressRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/address').then(m => m.Address),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/address-detail').then(m => m.AddressDetail),
    resolve: {
      address: AddressResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/address-update').then(m => m.AddressUpdate),
    resolve: {
      address: AddressResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/address-update').then(m => m.AddressUpdate),
    resolve: {
      address: AddressResolve,
    },
    canActivate: [userRouteAccessService],
  },
];

export default addressRoute;
