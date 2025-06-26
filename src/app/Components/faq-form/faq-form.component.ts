import { LoginService } from './../../Services/login.service';
import { AfterViewInit, Component, OnInit, signal } from '@angular/core';
import { LoaderComponent } from "../loader/loader.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ViewChild, ElementRef } from '@angular/core';
@Component({
  selector: 'app-faq-form',
  imports: [LoaderComponent,CommonModule,ReactiveFormsModule,MatIcon],
  templateUrl: './faq-form.component.html',
  styleUrl: './faq-form.component.css'
})
export class FaqFormComponent implements OnInit, AfterViewInit {
isRotated=false
loader: boolean = true;
faqform: FormGroup;

 ngAfterViewInit() {
    setTimeout(() => {
      // Reset the form state after blurring
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }


      this.faqform.markAsUntouched();
      this.faqform.markAsPristine();


    });
  }
constructor(private fb: FormBuilder,private service:LoginService) {
  this.faqform = this.fb.group({
    email: ['', [Validators.required]],
  category: ['', [Validators.required]],
  answer: ['', Validators.required]
  });
}
categories: { name: string; id: number }[] = [];
  ngOnInit(){
      this.service.getFaqs().subscribe({
      next: (response) => {
        if (response?.data) {
                this.loader=false
          this.categories=(
            response.data.map((item: any) => ({
              name: item.name,
              id: item.id,

              }))

          );
        }
      },
      error: (e) => console.error('Error fetching FAQs:', e),
    });



  }
  submitclick(){
    alert(this.faqform.value)
    console.log(JSON.stringify(this.faqform.value) ) }


}
