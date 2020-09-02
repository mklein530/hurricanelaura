import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/services/user-service';
import { SnackService } from 'src/app/services/snack-service';
import { StorageService } from 'src/app/services/storage.service';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from 'src/app/models/user';
import { getPlaceAsAddress } from 'src/util/address';
import { getAddressFromValue, getAddressDisplay } from 'src/app/services/form-util';

@Component({
  selector: 'admin-profile',
  templateUrl: './Profile.component.html',
  styleUrls: ['./Profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit {
  form: FormGroup;

  constructor(protected userService: UserService, protected snackService: SnackService, protected storageService: StorageService) {}

  ngOnInit() {
    this.form = this.userService.buildForm({ ...new User(), ...this.userService.user }, '', User);
    this.buildAddress(getAddressFromValue(this.userService.user.address, 'address'));
  }

  get address() {
    const form = this.form.value;
    if (form.address) {
      return getAddressDisplay(form.address.street, form.address.city, form.address.state, form.address.zip);
    }
  }

  ngAfterViewInit() {}

  async updateUser() {
    try {
      await this.userService.updateUser(this.userService.user.uid, this.form.value);
      this.snackService.showMessage('Successfully updated!');
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
      Object.keys(result).forEach((key) => {
        const addressControl = this.form.get('address');
        if (addressControl.get(key)) {
          this.form.get('address').get(key).setValue(result[key]);
        } else {
          (<FormGroup>addressControl).addControl(key, new FormControl(result[key]));
        }
      });
    }
  }

  async handleFileInput(files: FileList) {
    try {
      const file = files.item(0);
      const response = await this.storageService.uploadUserImage(file, this.userService.user.uid, 'avatar');
      const downloadUrl = await response.ref.getDownloadURL();
      this.form.get('avatar').setValue(downloadUrl);
    } catch (error) {}
  }
}
