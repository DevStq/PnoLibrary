import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
mymail: any = "1117abubakar@gmail.com";
  constructor(private authService: AuthService, private router: Router,) { }

  ngOnInit(): void {
    // Initialization logic if needed
  }

  // Method to navigate to BookListComponent
  borrowBook() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/BorrowBook']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Method to navigate to return book page
  returnBook() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/SubmitBook']);
    } else {
      this.router.navigate(['/login']);
    }
  }

 // Logout method
 // Method to handle logout
 logout(): void {
  this.authService.logout().then(() => {
    console.log('User logged out successfully');
  }).catch(error => {
    console.error('Error during logout:', error);
  });
}

}
