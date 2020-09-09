
import { FormGroup, AbstractControl } from '@angular/forms';
import { formErrors } from '../models/error';
import { Injectable } from '@angular/core';

@Injectable()
export class BaseComponent {
  form: FormGroup;
  errors: any = {};

  getError(formControl: AbstractControl) {
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

  getErrors = (formControlName: string) => {
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
