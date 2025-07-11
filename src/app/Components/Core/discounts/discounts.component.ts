import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../Services/api.service';
import { MatIconModule } from '@angular/material/icon';
import { FaqFormComponent } from '../../Shared/faq-form/faq-form.component';
import { MatDialog } from '@angular/material/dialog';
import { PaginationComponent } from '../../Shared/pagination/pagination.component';
import { Subject, takeUntil } from 'rxjs';
import { TableComponent } from '../../Shared/table/table.component';
import { LoaderService } from '../../../Services/loader.service';

interface Discount {
  id: number;
  discountAmount: number;
  code: string;
  limit: number;
  usedCount: number;
  validTo: string;
  name: string;
  targetUsers: string;
  status: string;
  continent: string;
  country: string;
  city: string;
}
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
  selector: 'app-discounts',
  standalone: true,
  imports: [CommonModule, MatIconModule, PaginationComponent, TableComponent],
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.css'],
})
export class DiscountsComponent implements OnInit {
  private service = inject(LoginService);
  private dialog = inject(MatDialog);

  pageNumber = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 1;
  discounts = signal<Discount[]>([]);

  private isLoading = inject(LoaderService);
  tableColumns: TableColumn[] = [
    { key: 'name', header: 'Name' },
    { key: 'code', header: 'Code' },
    { key: 'targetUsers', header: 'Target Location' },
    { key: 'discountAmount', header: 'Amount' },
    {
      key: 'validTo',
      header: 'Valid Until',
      type: 'date',
      format: 'mediumDate',
    },
    { key: 'limit', header: 'Usage Limit' },
    { key: 'usedCount', header: 'Availed Discounts' },
    { key: 'status', header: 'Status', type: 'status' },
  ];

  tableActions: TableAction[] = [
    { name: 'edit', icon: '/logo/edit.png', label: 'Edit' },
    {
      name: 'notification',
      icon: '/logo/speaker.png',
      label: 'Send Notification',
    },
  ];

  handleTableAction(event: { action: string; item: any }) {
    switch (event.action) {
      case 'edit':
        this.addDiscount(event.item);
        break;
      case 'notification':
        this.sendNotification(event.item.id);
        break;
    }
  }
  get paginationData() {
    return {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      totalPages: this.totalPages,
      totalRecords: this.totalRecords,
    };
  }

  ngOnInit() {
    this.loadDiscounts();
  }

  handlePaginationChange(newPage: number) {
    if (this.pageNumber !== newPage) {
      this.pageNumber = newPage;
      this.loadDiscounts();
    }
  }

  private loadDiscounts() {
    this.service
      .get('/api/AdminFlightDiscount/GetAll', {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
      })

      .subscribe({
        next: (response) => {
          this.pageNumber = response.pageNumber;
          this.pageSize = response.pageSize;
          this.totalRecords = response.totalRecords;
          this.totalPages = response.totalPages;

          if (response?.data) {
            this.discounts.set(
              response.data.map((item: any) => ({
                id: item.id,
                discountAmount: item.discountAmount,
                code: item.discountCode,
                limit: item.usageLimit,
                usedCount: item.usedCount,
                validTo: item.validTo,
                validFrom: item.validFrom,
                name: item.discountName,
                targetUsers: item.targetUsers,
                status: item.status,
                email: item.email,
                continent: item.continentName,
                city: item.cityName,
                country: item.countryName,
              }))
            );
          }
        },
        error: (e) => {
          console.error('Error fetching discounts:', e);
          this.isLoading.hide();
        },
      });
  }

  sendNotification(id: number) {
    this.dialog.open(FaqFormComponent, {
      data: { formType: 'notification' },
      autoFocus: false,
    });
  }

  addDiscount(updateItem?: any) {
    const popUp = this.dialog.open(FaqFormComponent, {
      data: { formType: 'discount', updateItem },
      autoFocus: false,
      minWidth: '600px',
    });

    popUp.afterClosed().subscribe((result) => {
      if (result === 'refresh') {
        this.loadDiscounts();
      }
    });
  }
}
