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
import { ActivatedRoute, Router } from '@angular/router';
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
    private dialog: MatDialog,
    private acRoute: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }
  ngOnInit() {
    const saved = localStorage.getItem('rememberedUser');

    this.acRoute.params.subscribe((params) => {
      if (params['action'] === 'logout') {
        if (saved) {
          try {
            const creds = JSON.parse(saved);
            this.loginForm.patchValue({
              email: creds.email,
              password: creds.pass,
              rememberMe: true,
            });
          } catch (e) {
            console.error('Failed to parse remembered user', e);
          }
        }
        localStorage.removeItem('rememberedUser');

        return;
      }
      if (!params['action'] && saved) {
        try {
          const creds = JSON.parse(saved);
          this.loginForm.patchValue({
            email: creds.email,
            password: creds.pass,
            rememberMe: true,
          });

          this.router.navigate(['/main']);
        } catch (e) {
          console.error('Failed to parse remembered user', e);
        }
      }
    });
  }

  login() {
    this.loader.set(true);

    const { email, password, rememberMe } = this.loginForm.value;

    if (rememberMe) {
      const creds = {
        email: email,
        pass: password,
      };
      localStorage.setItem('rememberedUser', JSON.stringify(creds));
    } else {
      localStorage.removeItem('rememberedUser');
    }

    const resp = this.loginservice.login(email, password);
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
          console.log(` Login failed: Invalid email or password`);
        }
      },
      error: (error) => {
        this.loader.set(false);
        console.error('API error:', error);
      },
    });
  }
}
