import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, catchError, of } from 'rxjs';

import { ICustomer } from '../customer.model';
import { CustomerService } from '../service/customer.service';

const customerResolve = (route: ActivatedRouteSnapshot): Observable<null | ICustomer> => {
  const { id } = route.params;
  if (id) {
    const router = inject(Router);
    const service = inject(CustomerService);
    return service.find(id).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          router.navigate(['404']);
        } else {
          router.navigate(['error']);
        }
        return EMPTY;
      }),
    );
  }

  return of(null);
};

export default customerResolve;
