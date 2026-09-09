import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ICustomer } from '../customer.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../customer.test-samples';

import { CustomerService } from './customer.service';

const requireRestSample: ICustomer = {
  ...sampleWithRequiredData,
};

describe('Customer Service', () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;
  let expectedResult: ICustomer | ICustomer[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Customer', () => {
      const customer = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(customer).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Customer', () => {
      const customer = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(customer).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Customer', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Customer', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Customer', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests).toHaveLength(1);
    });

    it('should handle exceptions for searching a Customer', () => {
      const queryObject: any = {
        page: 0,
        size: 20,
        query: '',
        sort: [],
      };
      service.search(queryObject).subscribe(() => expectedResult);

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
      expect(expectedResult).toBeNull();
    });

    describe('addCustomerToCollectionIfMissing', () => {
      it('should add a Customer to an empty array', () => {
        const customer: ICustomer = sampleWithRequiredData;
        expectedResult = service.addCustomerToCollectionIfMissing([], customer);
        expect(expectedResult).toEqual([customer]);
      });

      it('should not add a Customer to an array that contains it', () => {
        const customer: ICustomer = sampleWithRequiredData;
        const customerCollection: ICustomer[] = [
          {
            ...customer,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCustomerToCollectionIfMissing(customerCollection, customer);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Customer to an array that doesn't contain it", () => {
        const customer: ICustomer = sampleWithRequiredData;
        const customerCollection: ICustomer[] = [sampleWithPartialData];
        expectedResult = service.addCustomerToCollectionIfMissing(customerCollection, customer);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(customer);
      });

      it('should add only unique Customer to an array', () => {
        const customerArray: ICustomer[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const customerCollection: ICustomer[] = [sampleWithRequiredData];
        expectedResult = service.addCustomerToCollectionIfMissing(customerCollection, ...customerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const customer: ICustomer = sampleWithRequiredData;
        const customer2: ICustomer = sampleWithPartialData;
        expectedResult = service.addCustomerToCollectionIfMissing([], customer, customer2);
        expect(expectedResult).toEqual([customer, customer2]);
      });

      it('should accept null and undefined values', () => {
        const customer: ICustomer = sampleWithRequiredData;
        expectedResult = service.addCustomerToCollectionIfMissing([], null, customer, undefined);
        expect(expectedResult).toEqual([customer]);
      });

      it('should return initial array if no Customer is added', () => {
        const customerCollection: ICustomer[] = [sampleWithRequiredData];
        expectedResult = service.addCustomerToCollectionIfMissing(customerCollection, undefined, null);
        expect(expectedResult).toEqual(customerCollection);
      });
    });

    describe('compareCustomer', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCustomer(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 26915 };
        const entity2 = null;

        const compareResult1 = service.compareCustomer(entity1, entity2);
        const compareResult2 = service.compareCustomer(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 26915 };
        const entity2 = { id: 21032 };

        const compareResult1 = service.compareCustomer(entity1, entity2);
        const compareResult2 = service.compareCustomer(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return true if primaryKey matches', () => {
        const entity1 = { id: 26915 };
        const entity2 = { id: 26915 };

        const compareResult1 = service.compareCustomer(entity1, entity2);
        const compareResult2 = service.compareCustomer(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
