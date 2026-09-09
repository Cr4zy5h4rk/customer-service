import { ICustomer, NewCustomer } from './customer.model';

export const sampleWithRequiredData: ICustomer = {
  id: 3366,
  firstName: 'Johnny',
  lastName: 'Farrell',
  email: 'Johnathon.Pfannerstill@yahoo.com',
};

export const sampleWithPartialData: ICustomer = {
  id: 29162,
  firstName: 'Nickolas',
  lastName: 'Wisoky',
  email: 'Izaiah.Konopelski58@yahoo.com',
};

export const sampleWithFullData: ICustomer = {
  id: 4149,
  firstName: 'Jaydon',
  lastName: 'Bergnaum',
  email: 'Doyle_Stamm45@yahoo.com',
};

export const sampleWithNewData: NewCustomer = {
  firstName: 'Cathryn',
  lastName: 'Koelpin',
  email: 'Vicente_Bruen31@hotmail.com',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
