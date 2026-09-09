import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'customer',
    title: 'customerApp.customerCustomer.home.title',
    loadChildren: () => import('./customer/customer/customer.routes'),
  },
  {
    path: 'address',
    title: 'customerApp.customerAddress.home.title',
    loadChildren: () => import('./customer/address/address.routes'),
  },
  // jhipster-needle-add-entity-route - JHipster will add entity modules routes here
];

export default routes;
