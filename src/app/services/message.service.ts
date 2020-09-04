import { Injectable } from '@angular/core';
import BaseFirestoreService from './base.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';
import { Response } from '../models/response';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root',
})
export class MessageService extends BaseFirestoreService<Message> {
  constructor(protected firestore: AngularFirestore, protected formBuilder: FormBuilder) {
    super(firestore, 'messages', formBuilder);
  }

  getReceivedMessages(recepientUserId: string) {
    return this.getByAttribute('recepientUserId', '==', recepientUserId);
  }
}
