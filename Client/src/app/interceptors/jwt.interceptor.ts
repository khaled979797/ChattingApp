import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '../services/account.service';
import { IUser } from '../models/iuser';
import { take } from 'rxjs/operators';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);
  let currentUser:IUser = {username: '', token: '',};

  accountService.currentUser$.pipe(take(1)).subscribe(user => currentUser = <IUser>user);
  if(currentUser){
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${currentUser.token}`
      }
    });
  }
  return next(req);
};
