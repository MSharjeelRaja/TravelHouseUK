import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { LoginService } from '../../../Services/api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';

import { FaqFormComponent } from '../../Shared/faq-form/faq-form.component';
import { MatDialog } from '@angular/material/dialog';
import { PopUpComponent } from '../../Shared/pop-up/pop-up.component';
// import { LoaderService } from '../../../Services/loader.service';
import { PaginationComponent } from '../../Shared/pagination/pagination.component';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  isOpen: boolean;
}

interface Category {
  id: number;
  name: string;
  displayOrder: number;
  count: number;
  faq: FaqItem[];
}

interface CategoryWithFaqs {
  id: number;
  name: string;
  displayOrder: number;
  faqs: FaqItem[];
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatExpansionModule,
    FormsModule,
    PaginationComponent,
  ],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css',
})
export class FaqComponent {
  categoryInput = '';
  selectedCategoryId = 0;
  pageNumber = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 1;

  private service = inject(LoginService);
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.getCategoriesData();
  }
  get paginationData() {
    return {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      totalPages: this.totalPages,
      totalRecords: this.totalRecords,
    };
  }
  handlePaginationChange(newPage: number) {
    if (this.pageNumber !== newPage) {
      this.pageNumber = newPage;
      this.getCategoriesData();
    }
  }
  categories = signal<Category[]>([
    { name: 'booking', id: 1, displayOrder: 2, count: 7, faq: [] },
  ]);
  getCategoriesData() {
    this.service
      .get('/api/AdminFAQCategory/GetAll', {
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
            this.categories.set(
              response.data.map((item: any) => ({
                name: item.name,
                id: item.id,
                displayOrder: item.displayOrder,
                order: item.displayOrder,
                count: item.faqCount,
                faq: item.faQs.map((faq: any) => ({
                  id: faq.id,
                  question: faq.question,
                  answer: faq.answer,
                  isOpen: false,
                })),
              }))
            );
          }
        },
        error: (e) => {
          console.error('Error fetching FAQs:', e);
        },
      });
  }
  option = signal<string>('all');

  sortedCategories(): Category[] {
    return [...this.categories()].sort(
      (a, b) => a.displayOrder - b.displayOrder
    );
  }

  totalCount = computed(() =>
    this.categories().reduce((sum, cat) => sum + cat.count, 0)
  );
  paginatedFaqs(): CategoryWithFaqs[] {
    const selectedId = this.selectedCategoryId;

    if (selectedId !== 0) {
      const category = this.categories().find((cat) => cat.id === selectedId);
      if (category) {
        return [
          {
            id: category.id,
            name: category.name,
            displayOrder: category.displayOrder,
            faqs: category.faq || [],
          },
        ];
      }
      return [];
    } else {
      return this.categories().map((cat) => ({
        id: cat.id,
        name: cat.name,
        displayOrder: cat.displayOrder,
        faqs: cat.faq || [],
      }));
    }
  }

  categoryClick(itemId: number | 'all', itemname: string) {
    this.option.set(itemId.toString());

    if (itemId !== 'all') {
      this.selectedCategoryId = Number(itemId);
      this.categoryInput = itemname;
    } else {
      this.selectedCategoryId = 0;
      this.categoryInput = '';
    }
  }

  addCategory() {
    alert('Adding:' + this.categoryInput);
    this.categoryInput = '';
    this.selectedCategoryId = 0;
  }

  addUpdateCategory(id: number, name: string) {
    const payload = {
      id: id,
      name: name,
    };
    const resp = this.service.post('/api/AdminFAQCategory/AddUpdate', payload);
    resp.subscribe({
      next: () => {
        const popupRef = this.dialog.open(PopUpComponent, {
          width: '500px',
          data: {
            alertType: 'success',
            message: 'Category saved successfully!',
          },
        });
        this.getCategoriesData();
      },
      error: (error) => {
        console.error('API error:', error);

        this.dialog.open(PopUpComponent, {
          width: '500px',
          data: {
            alertType: 'error',
            message: 'Something went wrong!',
          },
        });
      },
    });
  }

  toggleFaq(faq: FaqItem) {
    faq.isOpen = !faq.isOpen;
  }

  remove(itemId: number) {
    const dialogRef = this.dialog.open(PopUpComponent, {
      data: {
        alertType: 'confirm',
        id: itemId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'refresh') {
        this.getCategoriesData();
      }
    });
  }

  trackOrder(index: number, item: any): number {
    return item.id;
  }
  addQuestion(updateItem?: any, category?: string) {
    const dialogRef = this.dialog.open(FaqFormComponent, {
      data: {
        formType: 'faq',
        updateItem: updateItem,
        category: category,
      },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'refresh') {
        this.getCategoriesData();
      }
    });
  }
  shuffle(id: number, newOrder: number) {
    console.log('response ius' + id, newOrder);
    const param = {
      id: id,
      displayOrder: newOrder,
    };
    this.service
      .post('/api/AdminFAQCategory/ShaffleCategory', param)
      .subscribe({
        next: () => {
          this.dialog.open(PopUpComponent, {
            width: '500px',
            data: {
              alertType: 'success',
              message: 'Category Swap Successfully',
            },
          });

          this.getCategoriesData();
        },
        error: (err) => {
          console.error('Shuffle failed:', err);
          this.dialog.open(PopUpComponent, {
            width: '500px',
            data: {
              alertType: 'error',
              message: err.message,
            },
          });
        },
      });
  }
}
