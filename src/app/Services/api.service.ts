import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  apiBaseUrl = 'https://api-dev.travelhouseuk.co.uk';

  private http = inject(HttpClient);

  post(endpoint: string, formdata: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}` + endpoint, formdata);
  }

  get(endpoint: string, formdata?: any): Observable<any> {
    let params = new HttpParams();

    if (formdata) {
      for (const key in formdata) {
        if (formdata[key] !== null && formdata[key] !== undefined) {
          params = params.set(key, formdata[key]);
        }
      }
    }

    return this.http.get(`${this.apiBaseUrl}${endpoint}`, { params });
  }

  update(endpoint: string, formdata: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}` + endpoint, formdata);
  }

  delete(endpoint: string): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}${endpoint}`);
  }
}
