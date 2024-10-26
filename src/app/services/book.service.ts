import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { Book } from '../models/book';
@Injectable({
  providedIn: 'root'
})
export class BookService {
  private booksCollection: AngularFirestoreCollection<Book>;

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) {
    this.booksCollection = this.firestore.collection<Book>('AllBooks');
  }

  // Get all books
  getAllBooks(): Observable<Book[]> {
    return this.booksCollection.valueChanges();
  }

  // Add a new book
  addBook(book: Book): Promise<void> {
    return this.booksCollection.doc(book.id).set(book);
  }

  // Update a book
  updateBook(id: string, updatedBook: Partial<Book>): Promise<void> {
    return this.booksCollection.doc(id).update(updatedBook);
  }

 
  // Delete a book
  deleteBook(id: string): Promise<void> {
    return this.booksCollection.doc(id).delete();
  }
  saveUserDetails(uid: string, userDetails: any) {
    return this.firestore.collection('userDetails').doc(uid).set(userDetails);
  }
} 