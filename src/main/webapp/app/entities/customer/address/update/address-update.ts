import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Observable, finalize, map } from 'rxjs';

import { ICustomer } from 'app/entities/customer/customer/customer.model';
import { CustomerService } from 'app/entities/customer/customer/service/customer.service';
import { AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';
import { IAddress } from '../address.model';
import { AddressService } from '../service/address.service';

import { AddressFormGroup, AddressFormService } from './address-form.service';

@Component({
  selector: 'jhi-address-update',
  templateUrl: './address-update.html',
  imports: [TranslateDirective, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class AddressUpdate implements OnInit {
  readonly isSaving = signal(false);
  address: IAddress | null = null;

  customersSharedCollection = signal<ICustomer[]>([]);

  protected addressService = inject(AddressService);
  protected addressFormService = inject(AddressFormService);
  protected customerService = inject(CustomerService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AddressFormGroup = this.addressFormService.createAddressFormGroup();

  compareCustomer = (o1: ICustomer | null, o2: ICustomer | null): boolean => this.customerService.compareCustomer(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ address }) => {
      this.address = address;
      if (address) {
        this.updateForm(address);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const address = this.addressFormService.getAddress(this.editForm);
    if (address.id === null) {
      this.subscribeToSaveResponse(this.addressService.create(address));
    } else {
      this.subscribeToSaveResponse(this.addressService.update(address));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IAddress | null>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving.set(false);
  }

  protected updateForm(address: IAddress): void {
    this.address = address;
    this.addressFormService.resetForm(this.editForm, address);

    this.customersSharedCollection.update(customers =>
      this.customerService.addCustomerToCollectionIfMissing<ICustomer>(customers, address.customer),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.customerService
      .query()
      .pipe(map((res: HttpResponse<ICustomer[]>) => res.body ?? []))
      .pipe(
        map((customers: ICustomer[]) =>
          this.customerService.addCustomerToCollectionIfMissing<ICustomer>(customers, this.address?.customer),
        ),
      )
      .subscribe((customers: ICustomer[]) => this.customersSharedCollection.set(customers));
  }
}
