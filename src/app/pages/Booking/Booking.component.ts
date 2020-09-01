import { Component, OnInit, AfterViewInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'booking',
  templateUrl: './Booking.component.html',
  styleUrls: ['./Booking.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class BookingComponent implements OnInit {
  //   <mat-form-field>
  //   <input matInput [ngxMatDatetimePicker]="picker" placeholder="Choose a date" [formControl]="dateControl"
  //      [min]="minDate" [max]="maxDate" [disabled]="disabled">
  //   <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
  //   <ngx-mat-datetime-picker #picker [showSpinners]="showSpinners" [showSeconds]="showSeconds"
  //      [stepHour]="stepHour" [stepMinute]="stepMinute" [stepSecond]="stepSecond"
  //      [touchUi]="touchUi" [color]="color" [enableMeridian]="enableMeridian" 
  //      [disableMinute]="disableMinute" [hideTime]="hideTime">
  //   </ngx-mat-datetime-picker>
  // </mat-form-field>
  form: FormGroup;
  public date: moment.Moment = moment();
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public minDate: moment.Moment = moment().subtract(1, 'year');
  public maxDate: moment.Moment = moment().add(1, 'year');
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color = 'primary';
  @ViewChild('picker') picker: any;

  constructor(protected formBuilder: FormBuilder, protected matDialogRef: MatDialogRef<any>) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      date: new FormControl(new Date())
    });
  }

  ngAfterViewInit() {
    var radios = document.querySelectorAll('.payment-tab-trigger > input');

    for (var i = 0; i < radios.length; i++) {
      radios[i].addEventListener('change', expandAccordion);
    }

    function expandAccordion(event) {
      var allTabs = document.querySelectorAll('.payment-tab');
      for (var i = 0; i < allTabs.length; i++) {
        allTabs[i].classList.remove('payment-tab-active');
      }
      event.target.parentNode.parentNode.classList.add('payment-tab-active');
    }

  }

  close() {
    this.matDialogRef.close();
  }

  respond() {
    this.matDialogRef.close(this.form);
  }
}
