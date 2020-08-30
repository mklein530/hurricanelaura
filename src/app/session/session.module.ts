import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './Login/Login.component';
import { SignUpComponent } from './SignUp/SignUp.component';
import { ForgotPasswordComponent } from './ForgotPassword/ForgotPassword.component';
import { ComingSoonComponent } from './ComingSoon/ComingSoon.component';

import { SessionRoutes } from './session.routing';
import { UserModule } from '../user/user.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UserModule,
    MatButtonModule,
    RouterModule.forChild(SessionRoutes)
  ],
  declarations: [
    LoginComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    ComingSoonComponent
  ]
})

export class SessionModule { }
