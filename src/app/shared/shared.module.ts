import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { LayoutModule } from '@angular/cdk/layout';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReviewModalComponent } from '../globalFrontendComponents/review-modal/review-modal.component';
import { MessageModalComponent } from '../globalFrontendComponents/message-modal/message-modal.component';
import { ReviewResponseModalComponent } from '../globalFrontendComponents/review-response-modal/review-response-modal.component';
const modules = [
  CommonModule,
  RouterModule,
  MatToolbarModule,
  MatIconModule,
  LayoutModule,
  MatButtonModule,
  MatSidenavModule,
  MatDatepickerModule,
  MatDialogModule,
  FormsModule,
  ReactiveFormsModule,
  MatListModule,
  MatMenuModule,
  MatIconModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  NgxMatMomentModule,
  MatSnackBarModule,
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
  NgxPaginationModule,
];

@NgModule({
  declarations: [ReviewModalComponent, MessageModalComponent, ReviewResponseModalComponent],
  imports: [...modules],
  exports: [...modules],
})
export class SharedModule {}
