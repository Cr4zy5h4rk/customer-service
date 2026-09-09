import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Alert, AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';
import { IAddress } from '../address.model';

@Component({
  selector: 'jhi-address-detail',
  templateUrl: './address-detail.html',
  imports: [FontAwesomeModule, Alert, AlertError, TranslateDirective, RouterLink],
})
export class AddressDetail {
  readonly address = input<IAddress | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
