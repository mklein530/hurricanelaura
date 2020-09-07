import { Component, OnInit, Inject } from '@angular/core';
import { BookingComponent } from '../../pages/Booking/Booking.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackService } from 'src/app/services/snack-service';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-review-modal',
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.css'],
})
export class ReviewModalComponent extends BookingComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) data: any, matDialog: MatDialogRef<any>, protected snackService: SnackService,
    protected userService: UserService) {
    super(matDialog, data, snackService, userService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
