import { BaseEntity } from './base-entity';
import { User } from './user';
import { Validators } from '@angular/forms';
import { Posting } from './posting';

export class Response extends BaseEntity {
  id = '';
  postId = '';
  // @ts-ignore
  responder: User = {};
  createdAt: number = 0;
  message: string = '';
  post: Posting = null;
  decision: {
    approved: boolean;
    rejected: boolean;
    message: string;
    createdAt: number;
  };

  validations = {
    'responder.firstName': ['', Validators.required],
    'responder.lastName': ['', Validators.required],
    'responder.email': ['', Validators.required, Validators.email],
    message: ['', Validators.required],
  };
}

export class Decision {
  approved = false;
  rejected = false;
  message = '';
  createdAt = 0;
}
