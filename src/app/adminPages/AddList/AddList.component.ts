import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import {
   DropzoneComponent, DropzoneDirective,
   DropzoneConfigInterface
} from 'ngx-dropzone-wrapper';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { getPlaceAsAddress } from '../../../util/address';
declare var $: any;

interface Location {
   lat: number;
   lng: number;
}

@Component({
   selector: 'admin-add-list',
   templateUrl: './AddList.component.html',
   styleUrls: ['./AddList.component.scss'],
   encapsulation: ViewEncapsulation.None
})
export class AddListComponent implements OnInit {
   form: FormGroup;
   // options = {
   //    types: [],
   //    componentRestrictions: {
   //       country: 'UA'
   //    }
   // }
   constructor(protected formBuilder: FormBuilder) { }

   buildForm() {
      return this.formBuilder.group({
         name: new FormControl('', [Validators.required]),
         email: new FormControl('', [Validators.email, Validators.required]),
         phoneNumber: new FormControl('', [Validators.pattern("[0-9]{0-10}")]),
         address: this.formBuilder.group({
            city: new FormControl(''),
            country: new FormControl(''),
            lat: new FormControl(null),
            lng: new FormControl(null),
            state: new FormControl(''),
            street: new FormControl(''),
            zip: new FormControl('')
         }),
         website: new FormControl('')
      })
   }
   ngOnInit() {
      this.form = this.buildForm();
   }

   ngAfterViewInit() {
      $(".add-listing-section").each(function () {

         var switcherSection = $(this);
         var switcherInput = $(this).find('.switch input');

         if (switcherInput.is(':checked')) {
            $(switcherSection).addClass('switcher-on');
         }

         switcherInput.change(function () {
            if (this.checked === true) {
               $(switcherSection).addClass('switcher-on');
            } else {
               $(switcherSection).removeClass('switcher-on');
            }
         });

      });
   }

   handleAddressChange(event) {
      const result = getPlaceAsAddress(event);
      if (result) {
         Object.keys(result).forEach(key => {
            this.form.get('address').get(key).setValue(result[key]);
         });
      }
   }
}
