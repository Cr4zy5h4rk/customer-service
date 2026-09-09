import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { ICustomer } from 'app/entities/customer/customer/customer.model';
import { CustomerService } from 'app/entities/customer/customer/service/customer.service';
import { IAddress } from '../address.model';
import { AddressService } from '../service/address.service';

import { AddressFormService } from './address-form.service';
import { AddressUpdate } from './address-update';

describe('Address Management Update Component', () => {
  let comp: AddressUpdate;
  let fixture: ComponentFixture<AddressUpdate>;
  let activatedRoute: ActivatedRoute;
  let addressFormService: AddressFormService;
  let addressService: AddressService;
  let customerService: CustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(AddressUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    addressFormService = TestBed.inject(AddressFormService);
    addressService = TestBed.inject(AddressService);
    customerService = TestBed.inject(CustomerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Customer query and add missing value', () => {
      const address: IAddress = { id: 19327 };
      const customer: ICustomer = { id: 26915 };
      address.customer = customer;

      const customerCollection: ICustomer[] = [{ id: 26915 }];
      vi.spyOn(customerService, 'query').mockReturnValue(of(new HttpResponse({ body: customerCollection })));
      const additionalCustomers = [customer];
      const expectedCollection: ICustomer[] = [...additionalCustomers, ...customerCollection];
      vi.spyOn(customerService, 'addCustomerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ address });
      comp.ngOnInit();

      expect(customerService.query).toHaveBeenCalled();
      expect(customerService.addCustomerToCollectionIfMissing).toHaveBeenCalledWith(
        customerCollection,
        ...additionalCustomers.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.customersSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const address: IAddress = { id: 19327 };
      const customer: ICustomer = { id: 26915 };
      address.customer = customer;

      activatedRoute.data = of({ address });
      comp.ngOnInit();

      expect(comp.customersSharedCollection()).toContainEqual(customer);
      expect(comp.address).toEqual(address);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IAddress>();
      const address = { id: 2318 };
      vi.spyOn(addressFormService, 'getAddress').mockReturnValue(address);
      vi.spyOn(addressService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ address });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(address);
      saveSubject.complete();

      // THEN
      expect(addressFormService.getAddress).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(addressService.update).toHaveBeenCalledWith(expect.objectContaining(address));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IAddress>();
      const address = { id: 2318 };
      vi.spyOn(addressFormService, 'getAddress').mockReturnValue({ id: null });
      vi.spyOn(addressService, 'create').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ address: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(address);
      saveSubject.complete();

      // THEN
      expect(addressFormService.getAddress).toHaveBeenCalled();
      expect(addressService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IAddress>();
      const address = { id: 2318 };
      vi.spyOn(addressService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ address });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(addressService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCustomer', () => {
      it('should forward to customerService', () => {
        const entity = { id: 26915 };
        const entity2 = { id: 21032 };
        vi.spyOn(customerService, 'compareCustomer');
        comp.compareCustomer(entity, entity2);
        expect(customerService.compareCustomer).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
