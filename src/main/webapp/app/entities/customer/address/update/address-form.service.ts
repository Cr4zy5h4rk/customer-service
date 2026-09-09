import { Service } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IAddress, NewAddress } from '../address.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAddress for edit and NewAddressFormGroupInput for create.
 */
type AddressFormGroupInput = IAddress | PartialWithRequiredKeyOf<NewAddress>;

type AddressFormDefaults = Pick<NewAddress, 'id'>;

type AddressFormGroupContent = {
  id: FormControl<IAddress['id'] | NewAddress['id']>;
  street: FormControl<IAddress['street']>;
  city: FormControl<IAddress['city']>;
  country: FormControl<IAddress['country']>;
  customer: FormControl<IAddress['customer']>;
};

export type AddressFormGroup = FormGroup<AddressFormGroupContent>;

@Service()
export class AddressFormService {
  createAddressFormGroup(address?: AddressFormGroupInput): AddressFormGroup {
    const addressRawValue = {
      ...this.getFormDefaults(),
      ...(address ?? { id: null }),
    };

    return new FormGroup<AddressFormGroupContent>({
      id: new FormControl(
        { value: addressRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      street: new FormControl(addressRawValue.street),
      city: new FormControl(addressRawValue.city),
      country: new FormControl(addressRawValue.country),
      customer: new FormControl(addressRawValue.customer),
    });
  }

  getAddress(form: AddressFormGroup): IAddress | NewAddress {
    return form.getRawValue();
  }

  resetForm(form: AddressFormGroup, address: AddressFormGroupInput): void {
    const addressRawValue = { ...this.getFormDefaults(), ...address };
    form.reset({
      ...addressRawValue,
      id: { value: addressRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): AddressFormDefaults {
    return {
      id: null,
    };
  }
}
