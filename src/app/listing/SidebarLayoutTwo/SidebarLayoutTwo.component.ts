import { Component, OnInit, AfterViewInit, ViewEncapsulation, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookingComponent } from '../../pages/Booking/Booking.component';
import { Posting } from 'src/app/models/posting';
import { ResponseService } from 'src/app/services/response.service';
import { SnackService } from 'src/app/services/snack-service';
import { UserService } from 'src/app/services/user-service';
import { Response } from 'src/app/models/response';
@Component({
  selector: 'sidebar-layout-two',
  templateUrl: './SidebarLayoutTwo.component.html',
  styleUrls: ['./SidebarLayoutTwo.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarLayoutTwoComponent implements OnInit {
  @Input()
  post: Posting;

  constructor(
    protected modal: MatDialog,
    protected responseService: ResponseService,
    protected snackService: SnackService,
    protected userService: UserService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {}

  get avatar() {
    if (this.post.user && this.post.user.avatar) {
      return this.post.user.avatar;
    }
    return 'assets/images/avatar-placeholder.png';
  }

  openResponseModal() {
    const initialValues: Response = {
      ...new Response(),
      responder: this.userService.user,
      createdAt: new Date().getTime(),
      postId: this.post.id,
    };
    const ref = this.modal.open(BookingComponent, {
      data: {
        form: this.responseService.buildForm(initialValues, '', Response),
      },
      height: '30rem',
      width: '50rem',
      panelClass: 'custom-dialog-container',
    });
    ref.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.responseService.create(result, this.responseService.createId());
          this.snackService.showMessage('Response sent!');
        } catch (error) {
          this.snackService.showMessage('Unable to send response');
        }
      }
    });
  }
}
