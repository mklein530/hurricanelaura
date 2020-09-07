import { Component, OnInit, Inject } from '@angular/core';
import { BookingComponent } from 'src/app/pages/Booking/Booking.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackService } from 'src/app/services/snack-service';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-review-response-modal',
  templateUrl: './review-response-modal.component.html',
  styleUrls: ['./review-response-modal.component.css'],
})
export class MessageModalComponent extends BookingComponent implements OnInit {
  header: string = 'Message';
  subheader: string = 'Please enter your message.';
  messagePlaceholder: string = 'Message';
  constructor(@Inject(MAT_DIALOG_DATA) protected data: any, protected matDialog: MatDialogRef<any>, protected snackService: SnackService,
    protected userService: UserService) {
    super(matDialog, data, snackService, userService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.header = this.data.header || this.header;
    this.subheader = this.data.subheader || this.subheader;
    this.messagePlaceholder = this.data.messagePlaceholder || this.messagePlaceholder;
  }
}
