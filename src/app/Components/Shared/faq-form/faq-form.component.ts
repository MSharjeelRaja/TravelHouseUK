import { LoginService } from '../../../Services/api.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { PopUpComponent } from '../pop-up/pop-up.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faq-form',

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  templateUrl: './faq-form.component.html',
  standalone: true,
  styleUrl: './faq-form.component.css',
})
export class FaqFormComponent {
  isRotated = false;

  updateMode = false;
  isRotatedStatus = false;
  isRotatedCity = false;
  isRotatedContinent = false;
  isRotatedCountry = false;

  faqform!: FormGroup;
  discountForm!: FormGroup;
  notificationForm!: FormGroup;
  updateData = {};
  categories: { name: string; id: number }[] = [];
  targetUsers: { name: string; id: number }[] = [];
  cities = ['London', 'Manchester', 'Birmingham', 'Leeds'];
  continents = ['Europe', 'Asia', 'Africa', 'America'];
  countries = ['UK', 'France', 'Germany', 'USA'];
  private fb = inject(FormBuilder);
  private service = inject(LoginService);
  private router = inject(Router);
  constructor(public dialogRef: MatDialogRef<FaqFormComponent>) {}

  private dialog = inject(MatDialog);
  public data = inject(MAT_DIALOG_DATA);
  formType = 'notification';
  selectedFileName = '';

  @ViewChild('fileInput') fileInput!: ElementRef;

  ngOnInit() {
    this.formType = this.data?.formType || '';
    this.updateData = this.data?.updateItem || '';
    if (this.updateData) {
      this.updateMode = true;
    }
    console.log(JSON.stringify(this.updateData));
    if (this.formType === 'faq') {
      this.faqform = this.fb.group({
        question: ['', [Validators.required]],
        category: ['', [Validators.required]],
        answer: ['', Validators.required],
      });
      if (this.updateData) {
        this.faqform.patchValue({
          question: this.data.updateItem.question,
          answer: this.data.updateItem.answer,
          category: this.data.category,
        });
      }
    } else if (this.formType === 'discount') {
      this.discountForm = this.fb.group({
        planName: ['', { validators: [Validators.required] }],
        code: ['', [Validators.required]],
        targetUsers: ['', [Validators.required]],
        status: ['', [Validators.required]],
        usageLimit: ['', [Validators.required]],
        amount: ['', [Validators.required]],
        validTo: ['', [Validators.required]],
        continent: [''],
        country: [''],
        city: [''],

        email: [''],
      });
      this.discountForm.get('targetUsers')?.valueChanges.subscribe(() => {
        this.onTargetUserChange();
      });

      if (this.updateData) {
        this.discountForm.patchValue({
          planName: this.data.updateItem.name,
          code: this.data.updateItem.code,
          targetUsers: this.data.updateItem.targetUsers,
          status: this.data.updateItem.status,
          usageLimit: this.data.updateItem.limit,
          amount: this.data.updateItem.discountAmount,
          validTo: this.data.updateItem.validTo,
          // continent: this.data.updateItem.continent,

          // country: this.data.updateItem.country,
          // city: this.data.updateItem.city,
          email: this.data.updateItem.email,
        });
      }
    } else if (this.formType === 'notification') {
      this.notificationForm = this.fb.group({
        title: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        message: ['', [Validators.required]],
        image: [''],
      });
    }
    this.service.get('/api/AdminFAQCategory/GetAll').subscribe({
      next: (response) => {
        if (response?.data) {
          this.categories = response.data.map((item: any) => ({
            name: item.name,
            id: item.id,
          }));
        }
      },
      error: (e) => console.error('Error fetching FAQs:', e),
    });
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.selectedFileName = file.name;
    }
  }

  submitFaq() {
    if (this.faqform.valid) {
      console.log('FAQ Form Submitted:', this.faqform.value);
    }
  }
  updateFaq() {
    if (this.faqform.valid) {
      const id = this.data?.updateItem?.id ?? 0;
      const payload = {
        id: id,
        question: this.faqform.get('question')?.value,
        answer: this.faqform.get('answer')?.value,
        categoryId:
          this.categories.find(
            (cat) => cat.name === this.faqform.get('category')?.value
          )?.id || null,
      };

      const resp = this.service.update('/api/AdminFAQ/AddUpdate', payload);

      resp.subscribe({
        next: () => {
          const popupRef = this.dialog.open(PopUpComponent, {
            width: '500px',
            data: {
              alertType: 'success',
            },
          });

          popupRef.afterClosed().subscribe(() => {
            this.dialogRef.close('refresh');
          });
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
  }

  onTargetUserChange() {
    const form = this.discountForm;
    const target = form.get('targetUsers')?.value;

    const fields = ['continent', 'country', 'city', 'email'];

    fields.forEach((field) => {
      const control = form.get(field);
      if (!control) return;
      control.clearValidators();
      control.setValue('');
      control.markAsUntouched();
      control.markAsPristine();
    });

    if (target === 'Region-Wise') {
      ['continent', 'country', 'city'].forEach((field) => {
        form.get(field)?.setValidators([Validators.required]);
      });
    } else if (target === 'Single User') {
      form.get('email')?.setValidators([Validators.required, Validators.email]);
    }

    fields.forEach((field) => {
      form.get(field)?.updateValueAndValidity();
    });
  }
  private formatDate(date: Date): string {
    if (!date) return '';

    const adjustedDate = new Date(date);

    adjustedDate.setMinutes(
      adjustedDate.getMinutes() - adjustedDate.getTimezoneOffset()
    );

    return adjustedDate.toISOString();
  }

  addUpdateDiscount() {
    if (this.discountForm.valid) {
      console.log('Form values:', this.discountForm.value);
      console.log('CODE BEING SENT:', this.discountForm.get('code')?.value);

      const discount = {
        id: this.updateMode ? this.data.updateItem.id : 0,
        discountName: this.discountForm.get('planName')?.value,
        discountCode: this.discountForm.get('code')?.value,
        discountAmount: Number(this.discountForm.get('amount')?.value),

        validTo: this.formatDate(this.discountForm.get('validTo')?.value),

        usageLimit: Number(this.discountForm.get('usageLimit')?.value),
        status: this.discountForm.get('status')?.value,
        targetUsers: this.discountForm.get('targetUsers')?.value,
        countryName: this.discountForm.get('country')?.value || null,
        countryCode: this.discountForm.get('country')?.value
          ? this.discountForm
              .get('country')
              ?.value.substring(0, 3)
              .toUpperCase()
          : null,
        continentName: this.discountForm.get('continent')?.value || null,
        continentCode: this.discountForm.get('continent')?.value
          ? this.discountForm
              .get('continent')
              ?.value.substring(0, 3)
              .toUpperCase()
          : null,
        cityName: this.discountForm.get('city')?.value || null,
        cityCode: this.discountForm.get('city')?.value
          ? this.discountForm.get('city')?.value.substring(0, 3).toUpperCase()
          : null,
        email: this.discountForm.get('email')?.value || null,
      };

      console.log(
        'Complete payload being sent:',
        JSON.stringify(discount, null, 2)
      );
      this.service
        .post('/api/AdminFlightDiscount/AddUpdate', discount)
        .subscribe({
          next: (response) => {
            console.log('Full API response:', response);
            this.dialogRef.close('refresh');
            const popupRef = this.dialog.open(PopUpComponent, {
              width: '500px',
              data: {
                alertType: 'success',
                message: 'Discount saved successfully!',
              },
            });
          },
          error: (error) => {
            console.error('Full error object:', error);
            console.error('Error status:', error.status);
            console.error('Error message:', error.message);
            console.error('Error response:', error.error);

            this.dialog.open(PopUpComponent, {
              width: '500px',
              data: {
                alertType: 'error',
                message:
                  'Failed to save discount! ' +
                  (error.error?.message || error.message || 'Unknown error'),
              },
            });
          },
        });
    } else {
      console.log('Form validation errors:', this.discountForm.errors);
      Object.values(this.discountForm.controls).forEach((control) => {
        console.log(`Control ${control}:`, control.errors);
        control.markAsTouched();
      });
    }
  }

  sendNotification() {
    alert('sent Notification from' + this.notificationForm.value.email);
  }
}
