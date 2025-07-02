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
import { PopUpComponent } from '../pop-up/pop-up.component';
import { LoaderComponent } from '../loader/loader.component';

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
}
