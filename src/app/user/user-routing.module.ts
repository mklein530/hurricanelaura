import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from '../user/login-page/login-page.component';
import { SignUpComponent } from '../session/SignUp/SignUp.component';
import { EmailLoginComponent } from './email-login/email-login.component';
import { LoginComponent } from '../session/Login/Login.component';

const routes: Routes = [
  // { path: '', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
