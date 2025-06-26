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
  getToken(){
    return localStorage.getItem('token');
  }
  getFaqs(){
    const token = this.getToken();
  const headers = {
    Authorization: `Bearer ${token}`
  };

  return this.http.get<any>(`${this.apiBaseUrl}/api/AdminFAQCategory/GetAll`, { headers });
}
getdiscounts(){

    const token = this.getToken();
  const headers = {
    Authorization: `Bearer ${token}`
  };

  return this.http.get<any>(`${this.apiBaseUrl}/api/AdminFlightDiscount/GetAll`, { headers });
}
}
