import { Posting } from './posting';
import { User } from './user';
import { Validators } from '@angular/forms';

export class Review {
  id = '';
  post: Partial<Posting> = {};
  reviewer: Partial<User> = {};
  reviewee: Partial<User> = {};
  createdAt: number = 0;
  message: string = '';
  rating: string | number = 'Rating';
  response: ReviewResponse;

  validations = {
    rating: ['', Validators.required, Validators.min(1), Validators.max(5)],
    message: ['', Validators.required],
    'reviewer.firstName': ['', Validators.required],
  };
}

export class ReviewResponse {
  message: string = '';
  createdAt: number = 0;

  validations = {
    message: ['', Validators.required],
  };
}
