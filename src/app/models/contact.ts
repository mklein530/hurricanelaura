import { Validators } from "@angular/forms";
import { BaseEntity } from "./base-entity";

export class Contact extends BaseEntity {
  firstName = '';
  lastName = '';
  email = '';
  message = '';
  subject = '';
  createdAt = new Date().getTime();
  userId = '';

  validations = {
    firstName: ['', Validators.required],
    email: ['', Validators.email, Validators.required],
    message: ['', Validators.required],
    subject: ['', Validators.required]
  }
}