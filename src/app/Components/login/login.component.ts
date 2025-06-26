import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginService } from '../../Services/login.service';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, LoaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  loader = signal(false);

  constructor(
    private fb: FormBuilder,
    private loginservice: LoginService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  login() {
    this.loader.set(true);
    let resp = this.loginservice.login(
      this.loginForm.value.email,
      this.loginForm.value.password
    );
    resp.subscribe({
      next: (response) => {
        if (response?.data?.isAuthSuccessful) {
          const token = response?.data?.token;
          localStorage.setItem('token', token);

          setTimeout(() => {
            this.loader.set(false);
            this.router.navigate(['/main']);
          }, 2000);
        } else {
          setTimeout(() => {
            this.dialog.open(PopUpComponent, {
              width: '500px',
            });
            this.loader.set(false);
          }, 2000);
          console.log(`❌ Login failed Inavlid email or password`);
        }
      },
      error: (error) => {
        console.error('API error:', error);
      },
    });
  }
}
