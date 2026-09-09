import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Observable, finalize } from 'rxjs';

import { AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';
import { ICustomer } from '../customer.model';
import { CustomerService } from '../service/customer.service';

import { CustomerFormGroup, CustomerFormService } from './customer-form.service';

@Component({
  selector: 'jhi-customer-update',
  templateUrl: './customer-update.html',
  imports: [TranslateDirective, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class CustomerUpdate implements OnInit {
  readonly isSaving = signal(false);
  customer: ICustomer | null = null;

  protected customerService = inject(CustomerService);
  protected customerFormService = inject(CustomerFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CustomerFormGroup = this.customerFormService.createCustomerFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customer }) => {
      this.customer = customer;
      if (customer) {
        this.updateForm(customer);
      }
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const customer = this.customerFormService.getCustomer(this.editForm);
    if (customer.id === null) {
      this.subscribeToSaveResponse(this.customerService.create(customer));
    } else {
      this.subscribeToSaveResponse(this.customerService.update(customer));
    }
  }

  protected subscribeToSaveResponse(result: Observable<ICustomer | null>): void {
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

  protected updateForm(customer: ICustomer): void {
    this.customer = customer;
    this.customerFormService.resetForm(this.editForm, customer);
  }
}
