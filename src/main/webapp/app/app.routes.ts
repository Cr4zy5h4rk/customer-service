import { Routes } from '@angular/router';

import { loadEntityRoutes } from './core/microfrontend';
import { errorRoute } from './layouts/error/error.route';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home'),
    title: 'home.title',
  },
  {
    path: '',
    loadComponent: () => import('./layouts/navbar/navbar'),
    outlet: 'navbar',
  },
  {
    path: '',
    loadChildren: () => loadEntityRoutes('customer'),
  },
  ...errorRoute,
];

export default routes;
