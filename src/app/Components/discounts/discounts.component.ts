import { Component,  signal } from '@angular/core';
import { LoaderComponent } from "../loader/loader.component";
import { CommonModule } from '@angular/common';
import { LoginService } from '../../Services/login.service';
interface Discount {
  id: number;
  discountAmount: number;
  code:string;
  limit:number;
  usedCount:number;
  validTo:string;
  name:string;
  targetUsers:string;

  status: string;
}

@Component({
  selector: 'app-discounts',
  imports: [LoaderComponent,CommonModule],
  templateUrl: './discounts.component.html',
  styleUrl: './discounts.component.css'
})
export class DiscountsComponent {
loader=true;

  discounts = signal<Discount[]>([]);
constructor(private service:LoginService){}
  ngOnInit() {

    this.service.getdiscounts().subscribe({
      next: (response) => {
        if (response?.data) {
                this.loader=false
          this.discounts.set(
            response.data.map((item: any) => ({
           id: item.id,
  discountAmount: item.discountAmount
,
  code:item.discountCode,
  limit:item.usageLimit,
  usedCount:item.usedCount,
  validTo:item.validTo,
    validFrom:item.validFrom,
  name:item.discountName,
  targetUsers:item.targetUsers,
  status: item.status,

            }))
          );
        }
      },
      error: (e) => console.error('Error fetching FAQs:', e),
    });
  }



  adddiscount(){

  }
  sendNotification(id:number){

  }
  edit(discount:Discount){

  }
}
