import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';
import { loaderInterceptor } from './Interceptors/loader.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNativeDateAdapter(),
    provideHttpClient(withInterceptors([loaderInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
  ],
};
