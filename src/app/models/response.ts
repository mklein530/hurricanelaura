import { BaseEntity } from './base-entity';
import { User } from './user';

export class Response extends BaseEntity {
  id = '';
  postId = '';
  // @ts-ignore
  responder: User = {};
  createdAt: number = 0;
  message: string = '';
}
