import { IAddress, NewAddress } from './address.model';

export const sampleWithRequiredData: IAddress = {
  id: 2568,
};

export const sampleWithPartialData: IAddress = {
  id: 21652,
  street: 'Benton Rapids',
};

export const sampleWithFullData: IAddress = {
  id: 16440,
  street: 'Swaniawski Mountain',
  city: 'Lake Gustburgh',
  country: 'Chad',
};

export const sampleWithNewData: NewAddress = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
