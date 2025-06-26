import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { LoginService } from '../../Services/login.service';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from "../loader/loader.component";
import { FaqFormComponent } from '../faq-form/faq-form.component';
import { Dialog } from '@angular/cdk/dialog';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  isOpen: boolean;
}

interface Category {
  id: number;
  name: string;
  order: number;
  count: number;
  faq: FaqItem[];
}

interface CategoryWithFaqs {
  id: number;
  name: string;
  faqs: FaqItem[];
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatExpansionModule, FormsModule, LoaderComponent],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css',
})
export class FaqComponent {
  categoryInput: string = '';
  selectedCategoryId: number | null = null;
loader=true;
  categories = signal<Category[]>([
    { name: 'booking', id: 1, order: 2, count: 7, faq: [] },
  ]);

  constructor(private service: LoginService,private dialog:Dialog) {}

  ngOnInit() {

    this.service.getFaqs().subscribe({
      next: (response) => {
        if (response?.data) {
                this.loader=false
          this.categories.set(
            response.data.map((item: any) => ({
              name: item.name,
              id: item.id,
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
    return [...this.categories()].sort((a, b) => a.order - b.order);
  }


  paginatedCategories(): Category[] {
    const start = this.currentPage() * this.pageSize;
    return this.sortedCategories().slice(start, start + this.pageSize);
  }
totalCount = computed(() =>
    this.paginatedCategories().reduce((sum, cat) => sum + cat.count, 0)
  );
  paginatedFaqs(): CategoryWithFaqs[] {
    return this.paginatedCategories().map((cat) => ({
      id: cat.id,
      name: cat.name,
      faqs: cat.faq || [],
    }));
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
    this.loader=true;
    setTimeout(() => {
        if ((this.currentPage() + 1) * this.pageSize < this.totalRecords()) {
      this.currentPage.set(this.currentPage() + 1);
    }
    this.loader=false
    }, 500);

  }

  prevPage() {
    this.loader=true;
    setTimeout(() => {
       if (this.currentPage() > 0) {
      this.currentPage.set(this.currentPage() - 1);
    }
    this.loader=false
    }, 500);

  }

  categoryClick(itemId: number | 'all', itemname: string) {
    this.option.set(itemId.toString());
    if (itemId !== 'all') {
      this.selectedCategoryId = itemId;
      this.categoryInput = itemname;
    } else {
      this.selectedCategoryId = null;
      this.categoryInput = '';
    }
  }

  addCategory() {
    console.log('Adding:', this.categoryInput);
    this.categoryInput = '';
    this.selectedCategoryId = null;
  }

  updateCategory() {
    if (this.selectedCategoryId !== null) {
      console.log(
        'Updating category:',
        this.selectedCategoryId,
        '->',
        this.categoryInput
      );
      this.categoryInput = '';
      this.selectedCategoryId = null;
    }
  }

  onCategorySubmit() {
    if (this.selectedCategoryId !== null) {
      this.updateCategory();
    } else {
      this.addCategory();
    }
  }

  toggleFaq(faq: FaqItem) {
    faq.isOpen = !faq.isOpen;
  }

  edit(item: FaqItem) {
    console.log('edit', item);
  }

  remove(itemId: number) {
    console.log('remove', itemId);
  }

  trackOrder(index: number, item: any): number {
    return item.id;
  }
addQuestion() {




      const dialogRef = this.dialog.open(FaqFormComponent, {
    width: '550px',
    height:'463.9px;'
  });


}}
