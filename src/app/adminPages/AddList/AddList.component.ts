import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { SnackService } from '../../services/snack-service';
import { getAddressDisplay, getAddressFromValue } from '../../services/form-util';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { getPlaceAsAddress } from '../../../util/address';
import { PostService } from '../../services/post.service';
import { Posting } from '../../models/posting';
import { formErrors } from '../../models/error';
import { UserService } from '../../services/user-service';
import { geohash } from '../../services/geolocation';
import { BaseComponent } from '../../adminPages/BaseComponent';
import { Router } from '@angular/router';

declare var $: any;

interface Location {
   lat: number;
   lng: number;
}

@Component({
   selector: 'admin-add-list',
   templateUrl: './AddList.component.html',
   styleUrls: ['./AddList.component.scss'],
   // encapsulation: ViewEncapsulation.None
})
export class AddListComponent extends BaseComponent implements OnInit, AfterViewInit {
   constructor(
      protected postService: PostService,
      protected userService: UserService,
      protected snackService: SnackService,
      protected storageService: StorageService,
      protected router: Router
   ) {
      super();
   }

   alert(text) {
      window.alert(text);
   }
   ngAfterViewInit() {
      $('.add-listing-section').each(function () {
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

   ngOnInit() {
      const user = this.userService.user;
      const post = {
         ...new Posting(),
         id: this.postService.createId(),
         user,
         name: user.firstName || user.lastName ? user.firstName + ' ' + user.lastName : '',
         email: user.email,
         website: user.website,
      };
      this.form = this.postService.buildForm(post, '', Posting);
      this.buildAddress(getAddressFromValue(this.userService.user.address, 'address'));
      super.ngOnInit();
   }

   get address() {
      const form = this.form.value;
      if (form.address) {
         return getAddressDisplay(form.address.street, form.address.city, form.address.state, form.address.zip);
      }
   }

   get coords() {
      const address = this.form.get('address');
      const coords = { lat: null, lng: null };
      if (address && address.get('lat') && address.get('lng')) {
         return { lat: address.get('lat').value, lng: address.get('lng').value };
      }
      return coords;
   }

   async savePosting() {
      this.form.markAsTouched();
      if (this.form.valid) {
         try {
            this.form.get('geohash').setValue(geohash(this.coords.lat, this.coords.lng));
            await this.postService.createPost(this.form.value, this.form.get('id').value);
            this.snackService.showMessage('Successfully created post!');
            this.router.navigate(['listing', 'detail', 'version2'], {
               queryParams: {
                  postId: this.form.get('id').value
               },
               state: {
                  post: this.form.value
               },
            });
         } catch (error) {
            this.snackService.showMessage('Something went wrong.');
         }
      } else {
         this.snackService.showMessage('Your form has errors.');
      }
   }

   buildAddress(address) {
      Object.keys(address).forEach((key) => {
         const addressControl = this.form.get('address');
         if (addressControl.get(key)) {
            this.form.get('address').get(key).setValue(address[key]);
         } else {
            (<FormGroup>addressControl).addControl(key, new FormControl(address[key]));
         }
      });
   }

   handleAddressChange(event) {
      const result = getPlaceAsAddress(event);
      if (result) {
         this.buildAddress(result);
      }
   }

   get images() {
      return this.form.get('images') as FormArray;
   }

   async handleFileInput(file: File) {
      try {
         const response = await this.storageService.uploadPostImage(file, this.form.get('id').value, file.name);
         const downloadUrl = await response.ref.getDownloadURL();
         this.images.push(new FormControl(downloadUrl));
      } catch (error) {
         console.log(error);
         window.alert('Failed to upload image.');
      }
   }
}
