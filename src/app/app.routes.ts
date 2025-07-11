import { Routes } from '@angular/router';

import { DiscountsComponent } from './Components/Core/discounts/discounts.component';

import { FaqComponent } from './Components/Core/faq/faq.component';
import { routeGuard } from './Guards/route.guard';
import { loginGuard } from './Guards/login.guard';
import { OverviewComponent } from './Components/Core/overview/overview.component';
import { MainComponent } from './Components/main/main.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [routeGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'discount', component: DiscountsComponent },
      { path: 'faq', component: FaqComponent },
      { path: 'overview', component: OverviewComponent },
    ],
  },
  {
    path: 'auth/login',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./Components/Auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
];
