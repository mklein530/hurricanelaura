import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { SnackService } from '../../services/snack-service';
import { getAddressDisplay, getAddressFromValue } from '../../services/form-util';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { getPlaceAsAddress } from '../../../util/address';
import { PostService } from '../../services/post.service';
import { Posting } from '../../models/posting';
import { UserService } from '../../services/user-service';
import { geohash } from '../../services/geolocation';

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
export class AddListComponent implements OnInit, AfterViewInit {
  form: FormGroup;

  constructor(
    protected postService: PostService,
    protected userService: UserService,
    protected snackService: SnackService,
    protected storageService: StorageService
  ) {}
  // title: string = '';
  // descripton: string = '';
  // // @ts-ignore
  // address: Address = {};
  // price: string = '';
  // wantVolunteers: boolean = true;
  // wantContractors: boolean = false;
  // numVolunteers: number = 0;
  // numContractors: number = 0;
  // name: string = '';
  // email: string = '';
  // website: string = '';
  // phoneNumber: string = '';
  // facebook: string = '';
  // images: string[] = [];
  // geohash: string = '';

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
    this.form = this.postService.buildForm({ ...new Posting(), id: this.postService.createId(), user: this.userService.user }, '', Posting);
    this.buildAddress(getAddressFromValue(this.userService.user.address, 'address'));
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
    try {
      this.form.get('geohash').setValue(geohash(this.coords.lat, this.coords.lng));
      await this.postService.createPost(this.form.value, this.form.get('id').value);
      this.snackService.showMessage('Successfully created post!');
    } catch (error) {
      this.snackService.showMessage('Something went wrong.');
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
    } catch (error) {}
  }
}
