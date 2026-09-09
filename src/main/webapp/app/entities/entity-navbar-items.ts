import NavbarItem from 'app/layouts/navbar/navbar-item.model';

const EntityNavbarItems: NavbarItem[] = [
  {
    name: 'Customer',
    route: '/customer/customer',
    translationKey: 'global.menu.entities.customerCustomer',
  },
  {
    name: 'Address',
    route: '/customer/address',
    translationKey: 'global.menu.entities.customerAddress',
  },
  // jhipster-needle-add-entity-navbar - JHipster will add entity navbar items here
];

export default EntityNavbarItems;
