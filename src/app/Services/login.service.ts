import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  apiBaseUrl = 'https://api-dev.travelhouseuk.co.uk';

  constructor(private http: HttpClient, private router: Router) {}
  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiBaseUrl}/api/AdminAuth/Login`, {
      email,
      password,
    });
  }
  getToken() {
    return localStorage.getItem('token');
  }
  getFaqs() {
    const token = this.getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return this.http.get<any>(
      `${this.apiBaseUrl}/api/AdminFAQCategory/GetAll`,
      { headers }
    );
  }
  getdiscounts() {
    const token = this.getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return this.http.get<any>(
      `${this.apiBaseUrl}/api/AdminFlightDiscount/GetAll`,
      { headers }
    );
  }
  shuffleCategory(id: number, order: number) {
    const token = this.getToken();
      const payload = [{ id: id, displayOrder: order }];
     console.log('Payload being sent to API:', payload);

    return this.http.post<any>(
      `${this.apiBaseUrl}/api/AdminFAQCategory/ShaffleCategory`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  Update(category: any) {
    console.log(
      'Complete payload being sent:',
      JSON.stringify(category, null, 2)
    );
    console.log('id' + category.id);
    const token = this.getToken();
    return this.http.post<any>(
      `${this.apiBaseUrl}/api/AdminFAQ/AddUpdate`,
      {
        id: category.id,
        question: category.question,
        answer: category.answer,
        categoryId: category.categoryId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  deleteFaq(id: number) {
    const token = this.getToken();
    return this.http.delete<any>(
      `${this.apiBaseUrl}/api/AdminFAQ/DeleteById?Id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  addCategory(id: number, categoryName: string) {
    const token = this.getToken();
    return this.http.post<any>(
      `${this.apiBaseUrl}/api/AdminFAQCategory/AddUpdate`,
      {
        id: id,
        name: categoryName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  addUpdateDiscount(discountData: any) {
    const token = this.getToken();
    return this.http.post<any>(
      `${this.apiBaseUrl}/api/AdminFlightDiscount/AddUpdate`,
      discountData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}
