import { Injectable } from '@angular/core';
import BaseFirestoreService from './base.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';
import { Contact } from '../models/contact';

@Injectable({
  providedIn: 'root',
})
export class ContactService extends BaseFirestoreService<Contact> {
  constructor(protected firestore: AngularFirestore, protected formBuilder: FormBuilder) {
    super(firestore, 'contact', formBuilder);
  }
}
