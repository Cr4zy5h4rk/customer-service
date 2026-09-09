import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';

import { Observable, asapScheduler, catchError, scheduled } from 'rxjs';

import { microserviceContextPath, serverApiUrl } from 'app/config';
import { Search, createRequestOption } from 'app/core/request';
import { ICustomer, NewCustomer } from '../customer.model';

export type PartialUpdateCustomer = Partial<ICustomer> & Pick<ICustomer, 'id'>;

@Service()
export class CustomersService {
  readonly customersParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly customersResource = httpResource<ICustomer[]>(() => {
    const params = this.customersParams();
    if (!params) {
      return undefined;
    }
    return { url: params.query ? this.resourceSearchUrl : this.resourceUrl, params };
  });
  /**
   * This signal holds the list of customer that have been fetched. It is updated when the customersResource emits a new value.
   * In case of error while fetching the customers, the signal is set to an empty array.
   */
  readonly customers = computed(() => (this.customersResource.hasValue() ? this.customersResource.value() : []));
  protected readonly resourceUrl = `${serverApiUrl}${microserviceContextPath}customer/api/customers`;
  protected readonly resourceSearchUrl = `${serverApiUrl}${microserviceContextPath}customer/api/customers/_search`;
}

@Service()
export class CustomerService extends CustomersService {
  protected readonly http = inject(HttpClient);

  create(customer: NewCustomer): Observable<ICustomer> {
    return this.http.post<ICustomer>(this.resourceUrl, customer);
  }

  update(customer: ICustomer): Observable<ICustomer> {
    return this.http.put<ICustomer>(`${this.resourceUrl}/${encodeURIComponent(this.getCustomerIdentifier(customer))}`, customer);
  }

  partialUpdate(customer: PartialUpdateCustomer): Observable<ICustomer> {
    return this.http.patch<ICustomer>(`${this.resourceUrl}/${encodeURIComponent(this.getCustomerIdentifier(customer))}`, customer);
  }

  find(id: number): Observable<ICustomer> {
    return this.http.get<ICustomer>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<ICustomer[]>> {
    const options = createRequestOption(req);
    return this.http.get<ICustomer[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  search(req: Search): Observable<ICustomer[]> {
    const options = createRequestOption(req);
    return this.http.get<ICustomer[]>(this.resourceSearchUrl, { params: options }).pipe(catchError(() => scheduled([], asapScheduler)));
  }

  getCustomerIdentifier(customer: Pick<ICustomer, 'id'>): number {
    return customer.id;
  }

  compareCustomer(o1: Pick<ICustomer, 'id'> | null, o2: Pick<ICustomer, 'id'> | null): boolean {
    return o1 && o2 ? this.getCustomerIdentifier(o1) === this.getCustomerIdentifier(o2) : o1 === o2;
  }

  addCustomerToCollectionIfMissing<Type extends Pick<ICustomer, 'id'>>(
    customerCollection: Type[],
    ...customersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const customers: Type[] = customersToCheck.filter(customerItem => customerItem !== null && customerItem !== undefined);
    if (customers.length > 0) {
      const customerCollectionIdentifiers = customerCollection.map(customerItem => this.getCustomerIdentifier(customerItem));
      const customersToAdd = customers.filter(customerItem => {
        const customerIdentifier = this.getCustomerIdentifier(customerItem);
        if (customerCollectionIdentifiers.includes(customerIdentifier)) {
          return false;
        }
        customerCollectionIdentifiers.push(customerIdentifier);
        return true;
      });
      return [...customersToAdd, ...customerCollection];
    }
    return customerCollection;
  }
}
