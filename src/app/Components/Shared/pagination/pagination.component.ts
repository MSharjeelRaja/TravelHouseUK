import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LoaderService } from '../../../Services/loader.service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnChanges {
  loader = inject(LoaderService);

  @Input() paginationData!: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
  };

  @Output() pageChange = new EventEmitter<number>();

  currentPage = signal(0);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paginationData'] && this.paginationData) {
      this.currentPage.set(this.paginationData.pageNumber - 1);
    }
  }

  nextPage() {
    if (this.currentPage() < this.paginationData.totalPages - 1) {
      setTimeout(() => {
        this.currentPage.update((p) => p + 1);
        this.pageChange.emit(this.currentPage() + 1);
      }, 300);
    }
  }

  prevPage() {
    if (this.currentPage() > 0) {
      setTimeout(() => {
        this.currentPage.update((p) => p - 1);
        this.pageChange.emit(this.currentPage() + 1);
      }, 300);
    }
  }

  showingStart() {
    return this.paginationData.totalRecords === 0
      ? 0
      : this.currentPage() * this.paginationData.pageSize + 1;
  }

  showingEnd() {
    const end = (this.currentPage() + 1) * this.paginationData.pageSize;
    return Math.min(end, this.paginationData.totalRecords);
  }
}
