import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/services/user-service';
import { SnackService } from 'src/app/services/snack-service';
import { StorageService } from 'src/app/services/storage.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { getPlaceAsAddress } from 'src/util/address';
import { getAddressFromValue, getAddressDisplay } from 'src/app/services/form-util';
import { BaseComponent } from '../BaseComponent';
import { formErrors } from '../../models/error';

@Component({
  selector: 'admin-profile',
  templateUrl: './Profile.component.html',
  styleUrls: ['./Profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent extends BaseComponent implements OnInit {
  form: FormGroup;

  constructor(protected userService: UserService, protected snackService: SnackService, protected storageService: StorageService) {
    super();
  }

  ngOnInit() {
    this.form = this.userService.buildForm({ ...new User(), ...this.userService.user }, '', User);
    this.buildAddress(getAddressFromValue(this.userService.user.address, 'address'));
    super.ngOnInit();
    this.setEmailValidators();
  }

  get address() {
    const form = this.form.value;
    if (form.address) {
      return getAddressDisplay(form.address.street, form.address.city, form.address.state, form.address.zip);
    }
  }

  ngAfterViewInit() { }

  async updateUser() {
    this.form.markAllAsTouched();
    this.form.markAsDirty();
    this.form.get('email').setValue('');
    ['firstName', 'email'].forEach(name => {
      this.errors[name] = this.getErrors(name);
    })
    if (this.form.valid) {
      try {
        await this.userService.updateUser(this.userService.user.uid, this.form.value);
        this.snackService.showMessage('Successfully updated!');
      } catch (error) {
        this.snackService.showMessage('Something went wrong.');
      }
    } else {
      this.snackService.showMessage('Your form has errors');
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

  setEmailValidators() {
    this.form.valueChanges.subscribe(values => {
      if (values.isContractor || values.isVolunteer) {
        this.form.get('email').setValidators([Validators.required, Validators.email]);
        const required = Validators.required(this.form.get('email'));
        const format = Validators.email(this.form.get('email'));
        if (required) {
          this.errors.email = formErrors.required;
        }
        if (format) {
          this.errors.email = formErrors.email;
        }
      } else {
        this.form.get('email').setValidators([]);
        this.form.get('email').setErrors(null);
      }
    })
  }

  async handleFileInput(files: FileList) {
    try {
      const file = files.item(0);
      const response = await this.storageService.uploadUserImage(file, this.userService.user.uid, 'avatar');
      const downloadUrl = await response.ref.getDownloadURL();
      this.form.get('avatar').setValue(downloadUrl);
    } catch (error) { }
  }
}
