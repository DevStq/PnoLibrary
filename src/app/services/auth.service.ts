import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app'; // Import from compat/app
import { Observable, catchError, map, of } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.user$ = afAuth.authState;
    ;
  }

 // Check if the current user is an admin
  // Check if the current user is an admin
  isAdmin(): Observable<boolean> {
    return this.afAuth.user.pipe(
      map(user => !!user && user.email === 'abu@gmail.com'),
      catchError(() => of(false)) // Handle errors gracefully
    );
  }
  // async googleSignIn() {
  //   const provider = new firebase.auth.GoogleAuthProvider();
  //   return this.afAuth.signInWithPopup(provider);
  // }
  
 // Method to get the current user's email

 getUserEmail(): Observable<string | null> {
  return this.afAuth.authState.pipe(
    map(user => user?.email || null)
  );
}
   // Observable to check if the user is logged in
   isLoggedIn(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(user => !!user) // Convert authState to boolean
    );
  }

 
  // Register a new user
  async register(email: string, password: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  // Login user
  login(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Logout user
 // Logout method
 // Log out the user
 logout(): Promise<void> {
  // Remove items from localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('isRegistered');

  // Sign out the user and redirect to login page
  return this.afAuth.signOut().then(() => {
    // Optionally perform additional actions here
    // Redirect to the login page
    this.router.navigate(['/login']);
  }).catch(error => {
    console.error('Error logging out:', error);
  });
}
}