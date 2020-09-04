import { Posting } from './posting';
import { User } from './user';

export class Review {
  id = '';
  post: Partial<Posting> = {};
  reviewer: Partial<User> = {};
  reviewee: Partial<User> = {};
  createdAt: number = 0;
  message: string = '';
  rating: string | number = 'Rating';
  response: ReviewResponse;
}

export class ReviewResponse {
  message: string = '';
  createdAt: number = 0;
}
