import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Alert, AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';
import { ICustomer } from '../customer.model';

@Component({
  selector: 'jhi-customer-detail',
  templateUrl: './customer-detail.html',
  imports: [FontAwesomeModule, Alert, AlertError, TranslateDirective, RouterLink],
})
export class CustomerDetail {
  readonly customer = input<ICustomer | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
