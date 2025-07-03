import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginService } from '../../Services/login.service';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  private fb = inject(FormBuilder);
  private loginservice = inject(LoginService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private acRoute = inject(ActivatedRoute);
  constructor() {
    this.loginForm = this.fb.group({
      email: ['admin@traveluk.com', [Validators.required, Validators.email]],
      password: ['123123', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  login() {
    const { email, password, rememberMe } = this.loginForm.value;

    if (rememberMe) {
      localStorage.setItem('rememberedUser', 'true');
    } else {
      localStorage.removeItem('rememberedUser');
    }

    const resp = this.loginservice.login(email, password);
    resp.subscribe({
      next: (response) => {
        if (response?.succeeded) {
          const token = response?.data?.token;
          localStorage.setItem('token', token);

          this.router.navigate(['/main']);
        } else {
          setTimeout(() => {
            this.dialog.open(PopUpComponent, {
              width: '500px',
            });
          }, 2000);
          console.log(` Login failed: Invalid email or password`);
        }
      },
      error: (error) => {
        console.error('API error:', error);
      },
    });
  }
}
