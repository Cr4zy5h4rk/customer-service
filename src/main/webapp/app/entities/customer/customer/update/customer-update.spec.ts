import { beforeEach, describe, expect, it, vi } from 'vitest';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { ICustomer } from '../customer.model';
import { CustomerService } from '../service/customer.service';

import { CustomerFormService } from './customer-form.service';
import { CustomerUpdate } from './customer-update';

describe('Customer Management Update Component', () => {
  let comp: CustomerUpdate;
  let fixture: ComponentFixture<CustomerUpdate>;
  let activatedRoute: ActivatedRoute;
  let customerFormService: CustomerFormService;
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

    fixture = TestBed.createComponent(CustomerUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    customerFormService = TestBed.inject(CustomerFormService);
    customerService = TestBed.inject(CustomerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const customer: ICustomer = { id: 21032 };

      activatedRoute.data = of({ customer });
      comp.ngOnInit();

      expect(comp.customer).toEqual(customer);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<ICustomer>();
      const customer = { id: 26915 };
      vi.spyOn(customerFormService, 'getCustomer').mockReturnValue(customer);
      vi.spyOn(customerService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(customer);
      saveSubject.complete();

      // THEN
      expect(customerFormService.getCustomer).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(customerService.update).toHaveBeenCalledWith(expect.objectContaining(customer));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<ICustomer>();
      const customer = { id: 26915 };
      vi.spyOn(customerFormService, 'getCustomer').mockReturnValue({ id: null });
      vi.spyOn(customerService, 'create').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customer: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(customer);
      saveSubject.complete();

      // THEN
      expect(customerFormService.getCustomer).toHaveBeenCalled();
      expect(customerService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<ICustomer>();
      const customer = { id: 26915 };
      vi.spyOn(customerService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(customerService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
