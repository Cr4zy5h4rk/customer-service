import { Routes } from '@angular/router';

import { ASC } from 'app/config';
import { userRouteAccessService } from 'app/core/auth';

import CustomerResolve from './route/customer-routing-resolve.service';

const customerRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/customer').then(m => m.Customer),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/customer-detail').then(m => m.CustomerDetail),
    resolve: {
      customer: CustomerResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/customer-update').then(m => m.CustomerUpdate),
    resolve: {
      customer: CustomerResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/customer-update').then(m => m.CustomerUpdate),
    resolve: {
      customer: CustomerResolve,
    },
    canActivate: [userRouteAccessService],
  },
];

export default customerRoute;
