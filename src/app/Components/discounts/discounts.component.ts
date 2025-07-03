import { Component, computed, inject, signal } from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../Services/login.service';
import { MatIconModule } from '@angular/material/icon';
import { FaqFormComponent } from '../faq-form/faq-form.component';
import { MatDialog } from '@angular/material/dialog';
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

@Component({
  selector: 'app-discounts',
  imports: [LoaderComponent, CommonModule, MatIconModule],
  templateUrl: './discounts.component.html',
  styleUrl: './discounts.component.css',
})
export class DiscountsComponent {
  currentPage = signal(0);
  private service = inject(LoginService);
  private dialog = inject(MatDialog);
  pageSize = 10;

  discounts = signal<Discount[]>([]);
  totalRecords = computed(() => this.discounts().length);

  ngOnInit() {
    this.getdiscounts();
  }
  getdiscounts() {
    this.service.getdiscounts().subscribe({
      next: (response) => {
        if (response?.data) {
          console.log(response.data);
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
      error: (e) => console.error('Error fetching FAQs:', e),
    });
  }
  paginatedDiscounts() {
    const start = this.currentPage() * this.pageSize;
    return this.discounts().slice(start, start + this.pageSize);
  }
  nextPage() {
    setTimeout(() => {
      if ((this.currentPage() + 1) * this.pageSize < this.totalRecords()) {
        this.currentPage.set(this.currentPage() + 1);
      }
    }, 400);
  }
  prevPage() {
    setTimeout(() => {
      if (this.currentPage() > 0) {
        this.currentPage.set(this.currentPage() - 1);
      }
    }, 400);
  }
  showingStart() {
    return this.totalRecords() === 0 ? 0 : this.currentPage() * this.pageSize;
  }
  showingEnd() {
    const end = (this.currentPage() + 1) * this.pageSize;
    return end > this.totalRecords() ? this.totalRecords() : end;
  }

  sendNotification(id: number) {
    console.log(id);
    this.dialog.open(FaqFormComponent, {
      data: {
        formType: 'success',
      },
    });
  }

  addDiscount(updateItem?: any) {
    const popUp = this.dialog.open(FaqFormComponent, {
      data: {
        formType: 'discount',
        updateItem: updateItem,
      },
    });
    popUp.afterClosed().subscribe((result) => {
      if (result === 'refresh') {
        this.getdiscounts();
      }
    });
  }
}
