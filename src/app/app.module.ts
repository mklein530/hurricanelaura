import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';
import { AdminPanelLayoutComponent } from './layouts/adminPanel/AdminPanelLayout.component';
import { FrontendPanelLayoutComponent } from './layouts/frontendPanel/FrontendPanel.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

import { HeaderComponent } from './core/Header/Header.component';
import { FooterComponent } from './core/Footer/Footer.component';
import { MenuComponent } from './core/Menu/Menu.component';
import { SignInComponent } from './core/SignInPopup/SignIn.component';

import { AdminHeaderComponent } from './core/AdminHeader/AdminHeader.component';
import { AdminSidebarComponent } from './core/AdminSidebar/AdminSidebar.component';
import { environment } from '../environments/environment';
import { MenuItems } from './core/Menu/menu-items';
import { AdminMenuItems } from './core/AdminHeader/admin-menu-items';
import { UserModule } from './user/user.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { SharedModule } from './shared/shared.module';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { AuthGuard } from './auth.guard';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  // url: 'https://httpbin.org/post',
  // maxFilesize: 50,
  // acceptedFiles: 'image/*',
};

@NgModule({
  declarations: [
    AppComponent,
    AdminPanelLayoutComponent,
    FrontendPanelLayoutComponent,
    AuthLayoutComponent,

    HeaderComponent,
    FooterComponent,
    MenuComponent,
    SignInComponent,

    AdminHeaderComponent,
    AdminSidebarComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    DropzoneModule,
    FormsModule,
    SharedModule,
    NgxMatMomentModule,
    ReactiveFormsModule,
    RouterModule.forRoot(AppRoutes, { scrollPositionRestoration: 'enabled' }),
    HttpClientModule,
    UserModule,
  ],
  providers: [
    MenuItems,
    AdminMenuItems,
    AuthGuard,
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
