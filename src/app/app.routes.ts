import { Routes } from '@angular/router';

import { DiscountsComponent } from './Components/discounts/discounts.component';
import { MainComponent } from './Components/main/main.component';
import { FaqComponent } from './Components/faq/faq.component';
import { routeGuard } from './Guards/route.guard';
import { loginGuard } from './Guards/login.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [routeGuard],
    children: [
      { path: '', redirectTo: 'faq', pathMatch: 'full' },
      { path: 'discount', component: DiscountsComponent },
      { path: 'faq', component: FaqComponent },
    ],
  },
  {
    path: 'auth/login',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./Components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
];
