import { Component, OnInit, Inject } from '@angular/core';
import { BookingComponent } from 'src/app/pages/Booking/Booking.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-review-response-modal',
  templateUrl: './review-response-modal.component.html',
  styleUrls: ['./review-response-modal.component.css'],
})
export class ReviewResponseModalComponent extends BookingComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) protected data: any, protected matDialog: MatDialogRef<any>) {
    super(matDialog, data);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
