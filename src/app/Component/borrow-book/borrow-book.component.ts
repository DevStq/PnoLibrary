import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-borrow-book',
  templateUrl: './borrow-book.component.html',
  styleUrls: ['./borrow-book.component.css']
})
export class BorrowBookComponent implements OnInit {
  userId: string = '';
  bookId: string = '';
  borrowDate: Date = new Date();
  submitDate: Date | null = null;
  title: any;
  books!: any[];
  selectedBook: any;
  popupOpen: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private authService: AuthService,
    private bookService: BookService
  ) { }
  ngOnInit(): void {
    this.loadBooks(); // Load books on component initialization 
    this.checkAdmin();
    this.authService.getUserEmail().subscribe((email: string | null) => {
      if (email) {
        this.userId = email;
        console.log("userId", this.userId);  // Log the retrieved user email
      } else {
        console.error("No user is logged in.");
      }
    });
  }

  loadBooks(): void {
    this.bookService.getAllBooks().subscribe(
      (data: any[]) => {
        this.books = data;
        console.log('Books loaded:', data);
      },
      (error: any) => {
        console.error('Error loading books:', error);
      }
    );
  }
  searchTerm: string = '';

  get filteredBooks(): any[] {
    if (!this.searchTerm) {
      return this.books; // Return all books if no search term is entered
    }
  
    const search = this.searchTerm.toLowerCase();
  
    return this.books.filter(book =>
      (book.title && book.title.toLowerCase().includes(search)) || 
      (book.author && book.author.toLowerCase().includes(search)) || 
      (book.userId && book.userId.toLowerCase().includes(search)) || 
      (book.id && book.id.toString().toLowerCase().includes(search)) // Changed from bookId to id
    );
  }
  borrowBook(): void {

    if (this.bookId && this.submitDate && this.userId) {
      // Proceed with borrowing if all values are present
      const borrowedBookDocId = this.userId; // Use user ID as document ID
      this.firestore.collection('BorrowedBooks').doc(borrowedBookDocId).set({
        userId: this.userId, // User's email ID
        bookId: this.bookId, // Selected book's ID
        borrowDate: this.borrowDate, // Default borrow date is the current date
        returnDate: this.submitDate, // Return date will be set later when returned
        author: this.selectedBook.author,
        imageUrl: this.selectedBook.imageUrl,
        status: 'borrowed', // Default status is 'borrowed'
        title: this.selectedBook.title
      }).then(() => {
        console.log('Book borrowed successfully!');
        this.closePopup(); // Close the popup after saving
        this.router.navigate(['/home']); // Redirect to home
      }).catch(error => {
        console.error('Error borrowing book:', error);
      });
    } else {
      // Log error if any required field is missing
      console.error('User ID, Book ID, and Submit Date are required');
    }
  }
  // Open the popup and assign the selected book details
  getBook(book: any): void {
    
    if (this.authService.isLoggedIn()) {
       this.selectedBook = book;
      this.bookId = book.id; // Set the book ID
      this.popupOpen = true; // Open the popup
    } else {
      // Redirect to login or register if not logged in
      this.router.navigate(['/login']);
    }
  }
  // Close the popup
  closePopup(): void {
    this.popupOpen = false;
    this.selectedBook = null;
    this.submitDate = null; // Reset the submit date when the popup closes
  }

  isSubmitDateInvalid(): boolean {
    return this.submitDate === null || new Date(this.submitDate) < new Date();
  }
  // Method to validate submit date
  validateDate() {
    if (this.submitDate && new Date(this.submitDate) < new Date()) {
      // If submitDate is before today, show alert or some error message
      alert('Submit date cannot be in the past.');
    }
  }

  /// Check if the user is an admin
  checkAdmin(): void {
    console.log(this.isAdmin, " this.isAdmin ")

    this.authService.isAdmin().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
      console.log(this.isAdmin, " this.isAdmin ")

    });
  }
  // Method to navigate to Admin page (only for admins)
  navigateToAdmin(): void {
    if (this.isAdmin) {

      this.router.navigate(['/admin']);
    }
  }
}

