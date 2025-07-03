import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  apiBaseUrl = 'https://api-dev.travelhouseuk.co.uk';

  private http = inject(HttpClient);
  private router = inject(Router);

  login(email: string, password: string): Observable<any> {
    debugger;
    return this.http.post(`${this.apiBaseUrl}/api/AdminAuth/Login`, {
      email,
      password,
    });
  }

  getFaqs(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/api/AdminFAQCategory/GetAll`);
  }

  getdiscounts(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/api/AdminFlightDiscount/GetAll`);
  }

  shuffleCategory(id: number, order: number): Observable<any> {
    const payload = [{ id, displayOrder: order }];
    console.log('Payload being sent to API:', payload);
    return this.http.post(
      `${this.apiBaseUrl}/api/AdminFAQCategory/ShaffleCategory`,
      payload
    );
  }

  updateFaq(category: any): Observable<any> {
    console.log(
      'Complete payload being sent:',
      JSON.stringify(category, null, 2)
    );
    return this.http.post(`${this.apiBaseUrl}/api/AdminFAQ/AddUpdate`, {
      id: category.id,
      question: category.question,
      answer: category.answer,
      categoryId: category.categoryId,
    });
  }

  deleteFaq(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiBaseUrl}/api/AdminFAQ/DeleteById?Id=${id}`
    );
  }

  addCategory(id: number, categoryName: string): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/api/AdminFAQCategory/AddUpdate`, {
      id,
      name: categoryName,
    });
  }

  addUpdateDiscount(discountData: any): Observable<any> {
    return this.http.post(
      `${this.apiBaseUrl}/api/AdminFlightDiscount/AddUpdate`,
      discountData
    );
  }
}
