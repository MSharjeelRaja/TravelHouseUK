import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { LoginService } from '../../Services/login.service';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../loader/loader.component';
import { FaqFormComponent } from '../faq-form/faq-form.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PopUpComponent } from '../pop-up/pop-up.component';

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
    LoaderComponent,
  ],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css',
})
export class FaqComponent {
  categoryInput: string = '';
  selectedCategoryId: number = 0;
  loader = true;
  categories = signal<Category[]>([
    { name: 'booking', id: 1, displayOrder: 2, count: 7, faq: [] },
  ]);

  constructor(private service: LoginService, private dialog: MatDialog) {}

  ngOnInit() {
    this.getCategoriesData();
  }
  getCategoriesData() {
    this.service.getFaqs().subscribe({
      next: (response) => {
        if (response?.data) {
          this.loader = false;
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
      error: (e) => console.error('Error fetching FAQs:', e),
    });
  }
  option = signal<string>('all');

  currentPage = signal(0);
  pageSize = 10;

  sortedCategories(): Category[] {
    return [...this.categories()].sort(
      (a, b) => a.displayOrder - b.displayOrder
    );
  }

  paginatedCategories(): Category[] {
    const start = this.currentPage() * this.pageSize;
    return this.sortedCategories().slice(start, start + this.pageSize);
  }
  totalCount = computed(() =>
    this.paginatedCategories().reduce((sum, cat) => sum + cat.count, 0)
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
      return this.paginatedCategories().map((cat) => ({
        id: cat.id,
        name: cat.name,
        displayOrder: cat.displayOrder,
        faqs: cat.faq || [],
      }));
    }
  }

  totalRecords(): number {
    return this.sortedCategories().length;
  }

  showingStart(): number {
    return this.totalRecords() === 0
      ? 0
      : this.currentPage() * this.pageSize + 1;
  }

  showingEnd(): number {
    const end = (this.currentPage() + 1) * this.pageSize;
    return end > this.totalRecords() ? this.totalRecords() : end;
  }

  nextPage() {
    this.loader = true;
    setTimeout(() => {
      if ((this.currentPage() + 1) * this.pageSize < this.totalRecords()) {
        this.currentPage.set(this.currentPage() + 1);
      }
      this.loader = false;
    }, 500);
  }

  prevPage() {
    this.loader = true;
    setTimeout(() => {
      if (this.currentPage() > 0) {
        this.currentPage.set(this.currentPage() - 1);
      }
      this.loader = false;
    }, 500);
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
    this.loader = true;

    const resp = this.service.addCategory(id, name);
    resp.subscribe({
      next: (response) => {
        const popupRef = this.dialog.open(PopUpComponent, {
          width: '500px',
          data: {
            alertType: 'success',
            message: 'Category saved successfully!',
          },
        });

        popupRef.afterClosed().subscribe((result) => {
          if (result === 'refresh') {
            this.getCategoriesData();
          } else {
            this.loader = false;
          }
        });
      },
      error: (error) => {
        this.loader = false;
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

  edit(item: FaqItem) {
    console.log('edit', item);
  }

  remove(itemId: number) {
    this.loader = true;
    const dialogRef = this.dialog.open(PopUpComponent, {
      data: {
        alertType: 'confirm',
        id: itemId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'refresh') {
        this.getCategoriesData();
      } else {
        this.loader = false;
      }
    });
  }

  trackOrder(index: number, item: any): number {
    return item.id;
  }
  addQuestion(updateItem?: any, category?: string) {
    this.loader = true;
    const dialogRef = this.dialog.open(FaqFormComponent, {
      data: {
        formType: 'faq',
        updateItem: updateItem,
        category: category,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'refresh') {
        this.getCategoriesData();
      } else {
        this.loader = false;
      }
    });
  }
  shuffle(id: number, newOrder: number) {
    this.loader = true;
    console.log('response ius' + id, newOrder);
    this.service.shuffleCategory(id, newOrder).subscribe({
      next: (resp) => {
        console.log('Shuffle successful:', resp.message);

        this.getCategoriesData();
      },
      error: (err) => {
        this.loader = false;
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
