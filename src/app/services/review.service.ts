import { Injectable } from '@angular/core';
import BaseFirestoreService from './base.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';
import { Review } from '../models/review';

@Injectable({
  providedIn: 'root',
})
export class ReviewService extends BaseFirestoreService<Review> {
  constructor(protected firestore: AngularFirestore, protected formBuilder: FormBuilder) {
    super(firestore, 'reviews', formBuilder);
  }

  getUserReviews(revieweeId: string) {
    return this.getByAttribute('reviewee.uid', '==', revieweeId);
  }
}
