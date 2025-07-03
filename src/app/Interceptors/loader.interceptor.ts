import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { LoaderService } from '../Services/loader.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoaderService);

  const isLoginRequest = req.url.includes('/api/AdminAuth/Login');

  const token = !isLoginRequest ? localStorage.getItem('token') : null;

  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  loader.show();

  return next(authReq).pipe(
    finalize(() => {
      loader.hide();
    })
  );
};
