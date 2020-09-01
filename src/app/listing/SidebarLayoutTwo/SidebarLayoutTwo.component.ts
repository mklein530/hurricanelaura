import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookingComponent } from '../../pages/Booking/Booking.component';
@Component({
  selector: 'sidebar-layout-two',
  templateUrl: './SidebarLayoutTwo.component.html',
  styleUrls: ['./SidebarLayoutTwo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarLayoutTwoComponent implements OnInit {

  constructor(protected modal: MatDialog) { }

  ngOnInit() { }

  ngAfterViewInit() {

  }

  openResponseModal() {
    const ref = this.modal.open(BookingComponent, {
      data: {},
      height: '30rem',
      width: '50rem',
      panelClass: 'custom-dialog-container'
    });
    ref.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}
