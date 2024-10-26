import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-submit-book',
  templateUrl: './submit-book.component.html',
  styleUrls: ['./submit-book.component.css']
})
export class SubmitBookComponent {
  
  borrowedBooks: any[] = []; // List of books borrowed by the user
  userEmail$: Observable<string | null>;
  alertMessage: string = '';
  alertType: string = ''; // 'success' or 'error'

  constructor(
    private bookService: BookService,
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {
    this.userEmail$ = this.authService.getUserEmail(); // Get observable for user email
  }

  ngOnInit(): void {
    this.loadUserBorrowedBooks(); // Load borrowed books when component initializes
  }

  // Load the list of books borrowed by the user
  loadUserBorrowedBooks(): void {
    this.userEmail$.subscribe(userEmail => {
      if (userEmail) {
        this.firestore.collection('BorrowedBooks', ref => ref.where('userId', '==', userEmail))
          .valueChanges()
          .subscribe((books: any[]) => {
            this.borrowedBooks = books.map(book => {
              // Convert Firestore Timestamp to JavaScript Date
              if (book.borrowDate && book.borrowDate.seconds) {
                book.borrowDate = new Date(book.borrowDate.seconds * 1000); // Convert Timestamp to Date
              }
              if (book.returnDate && book.returnDate.seconds) {
                book.returnDate = new Date(book.returnDate.seconds * 1000); // Convert Timestamp to Date
              }
              return book;
            });
          }, error => {
            console.error('Error fetching borrowed books:', error);
          });
      } else {
        console.error('User email is not available.');
      }
    });
  }

  // Method to handle returning a book
  returnBook(bookId: string): void {
    this.authService.getUserEmail().subscribe(userEmail => {
      if (userEmail) {
        this.firestore.collection('BorrowedBooks', ref => ref.where('bookId', '==', bookId).where('userId', '==', userEmail))
          .get()
          .subscribe(querySnapshot => {
            if (!querySnapshot.empty) {
              querySnapshot.forEach(doc => {
                const docRef = doc.ref;
                docRef.update({
                  returnDate: new Date().toISOString(), // Set return date
                  // Mark as returned
                  status: 'returned'
                }).then(() => {
                  console.log('Book marked as returned successfully!');
                  this.alertMessage = 'Book returned successfully!';
                  this.alertType = 'success';
                  this.loadUserBorrowedBooks(); // Refresh borrowed books list
                  this.updateUIAfterReturn(bookId); // Update UI after return
                }).catch(error => {
                  console.error('Error marking book as returned:', error);
                  this.alertMessage = 'Error returning book. Please try again.';
                  this.alertType = 'error';
                });
              });
            } else {
              console.error('No matching documents found.');
            }
          });
      } else {
        console.error('User is not authenticated.');
        this.alertMessage = 'Unable to return book. User email is not available.';
        this.alertType = 'error';
      }
    });
  }

  // Method to update UI after return
updateUIAfterReturn(bookId: string): void {
  // Logic to disable button and update the UI to reflect the returned status
  const bookIndex = this.borrowedBooks.findIndex(book => book.bookId === bookId);
  if (bookIndex > -1) {
    this.borrowedBooks[bookIndex].status = 'returned';
  }
}
}