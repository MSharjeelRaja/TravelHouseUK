import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { LoaderService } from '../../../Services/loader.service';

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
})
export class LoaderComponent {
  constructor(public loader: LoaderService) {}
}
