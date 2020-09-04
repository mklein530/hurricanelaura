import { Component, OnInit, Inject } from '@angular/core';
import { BookingComponent } from '../../pages/Booking/Booking.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-review-modal',
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.css'],
})
export class ReviewModalComponent extends BookingComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) data: any, matDialog: MatDialogRef<any>) {
    super(matDialog, data);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
