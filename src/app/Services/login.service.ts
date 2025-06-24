
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
apiBaseUrl='https://api-dev.travelhouseuk.co.uk'
Tokken='';
  constructor(private http:HttpClient,private router:Router) { }
login(email: string, password: string){
  return this.http.post<any>(`${this.apiBaseUrl}/api/AdminAuth/Login`, {
    email,
    password
  })
}

}
