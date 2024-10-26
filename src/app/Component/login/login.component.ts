import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.email, this.password)
      .then(() => {
        this.router.navigate(['/home']); // Redirect to home or any other page after successful login
      })
      .catch(error => {
        this.errorMessage = 'Login failed. Please check your credentials and try again.';
        console.error('Login error:', error);
      });
  }
}
