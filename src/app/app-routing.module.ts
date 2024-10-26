import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './Component/admin/admin.component';
import { BorrowBookComponent } from './Component/borrow-book/borrow-book.component';
import { LoginComponent } from './Component/login/login.component';
import { SubmitBookComponent } from './Component/submit-book/submit-book.component';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './Component/registration/registration.component';
import { HomeComponent } from './Component/home/home.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to home
  { path: 'home', component: HomeComponent ,canActivate: [authGuard]},
  { path: 'BorrowBook', component: BorrowBookComponent, canActivate: [authGuard]} , // Protected route
  { path: 'SubmitBook', component: SubmitBookComponent, canActivate: [authGuard]}, // Protected route
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] }, // Protected route
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/home' } // Redirect to home for unknown routes
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
