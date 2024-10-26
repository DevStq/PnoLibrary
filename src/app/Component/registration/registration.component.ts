import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/compat';
import { AuthService } from 'src/app/services/auth.service';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  email: string = '';
  password: string = '';
  name: string = ''; // New field for username
  phoneNumber: string = ''; // New field for mobile number
  errorMessage: string = '';

  constructor(private authService: AuthService, private bookservice: BookService, private router: Router) {}

  register() {
    if (this.email && this.password && this.name && this.phoneNumber) {
      this.authService.register(this.email, this.password)
        .then((res) => {
          console.log('Registration successful', res);

          // Store additional user info in userDetails collection
          const userDetails = {
            username: this.name,
            useremail: this.email,
            usermobilenumber: this.phoneNumber
          };

          // Call a method to save user details in Firestore
          this.bookservice.saveUserDetails(userDetails.username, userDetails)
            .then(() => {
              this.router.navigate(['/home']); // Redirect to home after successful registration
            })
            .catch((error) => {
              console.error('Error saving user details:', error);
              this.errorMessage = error.message;
            });
        })
        .catch((error) => {
          console.error('Registration failed', error);
          this.errorMessage = error.message;
        });
    } else {
      this.errorMessage = 'Please fill in all fields';
    }
  }

  onlyNumbers(event: KeyboardEvent) {
  const charCode = event.which ? event.which : event.keyCode;
  // Allow only numeric input (0-9)
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    event.preventDefault(); // Prevent the input if it's not a number
  }
}
}