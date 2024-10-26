import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, Observable } from 'rxjs';
import { Book } from 'src/app/models/book';
import { AuthService } from 'src/app/services/auth.service';
import { BookService } from 'src/app/services/book.service';

 

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent  implements OnInit {
  books$: Observable<Book[]> | undefined;
  borrowedBooks$: Observable<Book[]> | undefined;
  selectedBook: Book | null = null;
  newBook: Partial<Book> = {};
  userId: string = ''; // Admin or user ID to check borrowed books
  totalBooks: number = 0;
allBooks$: Observable<any[]> | undefined; // Observable to hold all books from Firestore
allBooks: any[] = []; // Store the books in a local array for displaying
totalUsers: number = 0; // Total users borrowing/returning books
totalBooksBorrowed: number = 0; // Count borrowed books
totalBooksReturned: number = 0; // Count returned books
  bulkbooks: Book[] | undefined;
  isAdmin: any;
CrudOperation: boolean=false;
  users: any[] | undefined;
 
  constructor(private bookService: BookService,
    private firestore:  AngularFirestore,
    private authService: AuthService,
    private storage: AngularFireStorage,) { }
    selectedFile: File | null = null;
    downloadURL: string | null = null
  ngOnInit(): void {
    this.loadAllBooks(); // Load all books on initialization
    this.loadBooks();
    this.checkAdmin();
    this.getUserDetails();
   }
   loadBooks() {
    // Fetch books from the "Book" collection
    this.books$ = this.firestore.collection<Book>('AllBooks').valueChanges();
    this.books$.subscribe(books => {
      this.totalBooks = books.length; // Update totalBooks
      this.bulkbooks = books;
    });
  }
 
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

   // Method to handle image upload
   uploadImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `book-images/${this.newBook.id}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, file);
  
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.newBook.imageUrl = url;  // Set the image URL in newBook object
            console.log('Image uploaded, URL: ', url);
          });
        })
      ).subscribe();
    }
  }
  
  
  addBook() {
    console.log("data", this.newBook);
  
    // Check if all required fields are filled
    if (!this.newBook.id || !this.newBook.title || !this.newBook.author || !this.selectedFile) {
      console.error('ID, title, author, and image are required');
      return;
    }
  
    // Set the file path and references for image upload
    const filePath = `book_images/${this.selectedFile.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.selectedFile);
  
    // Upload the file and get the download URL
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          this.downloadURL = url;
  
          // Now create the book object with the image URL from Firebase
          const book: Book = {
            id: this.newBook.id || '',  // Default value if undefined
            title: this.newBook.title || '',
            author: this.newBook.author || '',
            description: this.newBook.description || '',
            imageUrl: this.downloadURL || '',  // Use the downloaded image URL here
            status: this.newBook.status || 'Available'
          };
  
          // Add the book to the service
          this.bookService.addBook(book)
            .then(() => {
              console.log('Book added successfully!');
              this.newBook = {}; // Reset form fields
              this.selectedFile = null; // Reset the file input
              this.loadBooks(); // Refresh the book list
            })
            .catch(error => console.error('Error adding book: ', error));
        });
      })
    ).subscribe();
  }
  
  getUserDetails() {
    this.firestore.collection('userDetails').valueChanges().subscribe(users => {
      this.users = users;
      console.log("user",users)
    });
  }



  updateBook() {
    if (!this.selectedBook) return;
  
    const updatedBook: Partial<Book> = {
      title: this.newBook.title || this.selectedBook.title,
      author: this.newBook.author || this.selectedBook.author,
      description: this.newBook.description || this.selectedBook.description,
      imageUrl: this.newBook.imageUrl || this.selectedBook.imageUrl,
      status: this.newBook.status || this.selectedBook.status
    };
  
    this.bookService.updateBook(this.selectedBook.id, updatedBook)
      .then(() => {
        console.log('Book updated successfully!');
        this.loadBooks(); // Refresh the book list
        this.clearSelection(); // Clear selection after updating
      })
      .catch(error => console.error('Error updating book: ', error));
  }
  

  deleteBook(id: string) {
    // Show a confirmation dialog to the user
    const confirmDelete = window.confirm('Are you sure you want to delete this book? This action cannot be undone.');
  
    if (confirmDelete) {
      this.bookService.deleteBook(id)
        .then(() => {
          console.log('Book deleted successfully!');
          this.loadBooks(); // Refresh the book list
        })
        .catch(error => console.error('Error deleting book: ', error));
    } else {
      console.log('Delete operation canceled.');
    }
  }
  searchTerm: string = ''; // The user's input for searching

  // Method to filter the books based on the search term
  filteredBooks() {
    if (!this.searchTerm) {
      return this.allBooks; // Return all books if no search term is entered
    }
  
    const search = this.searchTerm.toLowerCase();
  
    return this.allBooks.filter(book =>
      (book.title && book.title.toLowerCase().includes(search)) || 
      (book.author && book.author.toLowerCase().includes(search)) || 
      (book.userId && book.userId.toLowerCase().includes(search)) || 
      (book.bookId && book.bookId.toString().toLowerCase().includes(search))
    );
  }
  selectBook(book: Book) {
    this.selectedBook = book;
    this.newBook = { ...book }; // Populate the form with selected book details
  }
  clearSelection() {
    this.selectedBook = null;
  }

 

  // Method to load all books from the "GetBook" collection
  loadAllBooks() {
    const booksCollection = this.firestore.collection('BorrowedBooks');
    booksCollection.valueChanges().subscribe((books: any[]) => {
      console.log("Sss",books)
      this.allBooks = books.map(book => {
        // Convert Firestore Timestamp to JavaScript Date for both borrowDate and returnDate
        if (book.borrowDate && book.borrowDate.seconds) {
          book.borrowDate = new Date(book.borrowDate.seconds * 1000);
        }
        if (book.returnDate && book.returnDate.seconds) {
          book.returnDate = new Date(book.returnDate.seconds * 1000);
        }
        return book;
      });

      // Count total borrowed and returned books
      this.totalBooksBorrowed = this.allBooks.filter(book => book.status === 'borrowed').length;
      this.totalBooksReturned = this.allBooks.filter(book => book.status === 'returned').length;

      // Get unique userIds for total users
      const userIds = new Set(this.allBooks.map(book => book.userId));
      this.totalUsers = userIds.size;
    }, (error: any) => {
      console.error('Error fetching books:', error);
    });
  }
  checkAdmin(): void {
    console.log(this.isAdmin, " this.isAdmin ")

    this.authService.isAdmin().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
      console.log(this.isAdmin, " this.isAdmin ")

    });
  }
}