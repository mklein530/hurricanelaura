import { User } from './user';
import { BaseEntity } from './base-entity';

export class Message extends BaseEntity {
  message = '';
  // @ts-ignore
  sender: User = {};
  recepientUserId = '';
  createdAt = 0;
}
