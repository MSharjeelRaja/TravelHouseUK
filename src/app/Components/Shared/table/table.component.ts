import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FaqFormComponent } from '../faq-form/faq-form.component';
import { StatusComponent } from '../status/status.component';
export interface TableColumn {
  key: string;
  header: string;
  type?: 'text' | 'date' | 'status' | 'actions';
  format?: string;
}

export interface TableAction {
  name: string;
  icon: string;
  label?: string;
}
@Component({
  selector: 'app-table',
  imports: [CommonModule, StatusComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions: TableAction[] = [];
  @Output() actionClick = new EventEmitter<{ action: string; item: any }>();

  handleAction(action: string, item: any) {
    this.actionClick.emit({ action, item });
  }
}
