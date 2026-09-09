import { ICustomer } from 'app/entities/customer/customer/customer.model';

export interface IAddress {
  id: number;
  street?: string | null;
  city?: string | null;
  country?: string | null;
  customer?: ICustomer | null;
}

export type NewAddress = Omit<IAddress, 'id'> & { id: null };
