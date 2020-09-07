import { Component, OnInit, AfterViewInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import policy from './privacy';
@Component({
  selector: 'invoice',
  templateUrl: './Invoice.component.html',
  styleUrls: ['./Invoice.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InvoiceComponent implements OnInit {
  @ViewChild('policy') policyElement: ElementRef;

  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.policyElement.nativeElement.innerHTML = policy;
    window.scrollTo(0, 0);
  }
}
