import { Injectable } from '@angular/core';
import BaseFirestoreService from './base.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';
import { Response } from '../models/response';

@Injectable({
  providedIn: 'root',
})
export class ResponseService extends BaseFirestoreService<Response> {
  constructor(protected firestore: AngularFirestore, protected formBuilder: FormBuilder) {
    super(firestore, 'responses', formBuilder);
  }

  getPostResponses(postId: string) {
    return this.getByAttribute('postId', '==', postId);
  }
}
