import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Posting } from '../models/posting';
import BaseFirestoreService from './base.service';

@Injectable({
  providedIn: 'root',
})
export class PostService extends BaseFirestoreService<Posting> {
  constructor(protected firestore: AngularFirestore) {
    super(firestore, 'postings');
  }
}
