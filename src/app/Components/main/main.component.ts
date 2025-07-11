import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  Router,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    CommonModule,
    MatIconModule,
    RouterModule,
    RouterOutlet,
    RouterLinkActive,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  routes = [
    { route: '/main/overview', label: 'Overview', icon: 'fa-house' },
    { route: '', label: 'Push Notifications', icon: 'fa-bell' },
    { route: '', label: 'Flight Bookings', icon: 'fa-shopping-cart' },
    { route: '', label: 'Search Records', icon: 'fa-search' },
    { route: '', label: 'Splash Screens', icon: 'fa-image' },
    { route: '', label: 'Home Banners', icon: 'fa-image' },
    { route: '/main/faq', label: 'FAQ', icon: 'fa-question-circle' },
    { route: '', label: 'Explore Section', icon: 'fa-search' },
    { route: '/main/discount', label: 'Discounts', icon: 'fa-percent' },
    { route: '', label: 'Loyalty Benefits', icon: 'fa-compass' },

    { route: '', label: 'Payment Gateways', icon: 'fa-toggle-on' },
    { route: '', label: 'Payment Plans', icon: 'fa-wallet' },

    { route: '', label: 'General Settings', icon: 'fa-cog' },
  ];

  showOptions: boolean = false;
  constructor(public router: Router) {}

  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInside = this.dropdownContainer?.nativeElement.contains(
      event.target
    );
    if (!clickedInside) {
      this.showOptions = false;
    }
  }
  logout() {
    localStorage.removeItem('token');

    this.router.navigate(['auth/login']);
  }
}
