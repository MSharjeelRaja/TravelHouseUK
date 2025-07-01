import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { DiscountsComponent } from './Components/discounts/discounts.component';
import { MainComponent } from './Components/main/main.component';
import { FaqComponent } from './Components/faq/faq.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'main',
    component: MainComponent,
    children: [
       { path: '', redirectTo: 'faq', pathMatch: 'full' },
      { path: 'discount', component: DiscountsComponent },
      { path: 'faq', component: FaqComponent },
    ],
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./Components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
   {
    path: 'auth/login/:action',
    loadComponent: () =>
      import('./Components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
];
