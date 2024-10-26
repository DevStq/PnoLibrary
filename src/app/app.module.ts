import { NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { environment } from "src/environments/environment.prod";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AdminComponent } from "./Component/admin/admin.component";
import { BorrowBookComponent } from "./Component/borrow-book/borrow-book.component";
import { LoginComponent } from "./Component/login/login.component";
import { SubmitBookComponent } from "./Component/submit-book/submit-book.component";
import { RegistrationComponent } from "./Component/registration/registration.component";
import { HomeComponent } from './Component/home/home.component';

 

@NgModule({
  declarations: [
    AppComponent,
    BorrowBookComponent,
    SubmitBookComponent,
    AdminComponent,
    LoginComponent,
    RegistrationComponent,
    HomeComponent
  ],
  imports: [
    FormsModule ,// Add FormsModule here    HttpClientModule,
    ReactiveFormsModule, // Import ReactiveFormsModule
    FormsModule,
    BrowserModule,
    AppRoutingModule, // Include routing module here
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
