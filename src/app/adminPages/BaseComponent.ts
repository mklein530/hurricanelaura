import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { SnackService } from '../services/snack-service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { PostService } from '../services/post.service';
import { formErrors } from '../models/error';
import { UserService } from '../services/user-service';

export class BaseComponent implements OnInit {
  form: FormGroup;
  errors: any = {};

  getError(formControl: FormControl) {
    const errors = formControl.errors;
    if (errors) {
      const keys = Object.keys(errors);
      const firstKey = keys && keys.length && keys[0];
      if (errors[firstKey] && typeof errors[firstKey] === 'string') {
        return errors[firstKey];
      }
      return formErrors[firstKey];
    }
  }

  getErrors(formControlName: string) {
    const errors = this.form.get(formControlName) && this.form.get(formControlName).errors;
    if (errors) {
      const keys = Object.keys(errors);
      const firstKey = keys && keys.length && keys[0];
      if (errors[firstKey] && typeof errors[firstKey] === 'string') {
        return errors[firstKey];
      }
      return formErrors[firstKey];
    }
  }

  subscribeToErrors(): void {
    this.form.valueChanges.subscribe((values) => {
      if (values) {
        Object.keys(values).forEach((key) => {
          this.errors[key] = this.getErrors(key);
        });
        console.log(this.errors);
      }
    });
    this.form.statusChanges.subscribe((values) => {
      if (values) {
        Object.keys(values).forEach((key) => {
          this.errors[key] = this.getErrors(key);
        });
        console.log(this.errors);
      }
    });
  }

  ngOnInit() {
    this.subscribeToErrors();
  }
}
