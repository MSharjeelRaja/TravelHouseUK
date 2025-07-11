import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status',
  imports: [CommonModule],
  templateUrl: './status.component.html',
  styleUrl: './status.component.css',
})
export class StatusComponent {
  @Input() status = '';
}
