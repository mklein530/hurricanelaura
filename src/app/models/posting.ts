import { Address } from './address';
import { BaseEntity } from './base-entity';
import { User } from './user';

export class Posting extends BaseEntity {
  id: string = '';
  title: string = '';
  description: string = '';
  // @ts-ignore
  address: Address = {};
  price: string = '';
  done = false;
  wantVolunteers: boolean = true;
  wantContractors: boolean = false;
  numVolunteers: number = 0;
  numContractors: number = 0;
  name: string = '';
  email: string = '';
  website: string = '';
  phoneNumber: string = '';
  facebook: string = '';
  images: string[] = [];
  geohash: string = '';
  // @ts-ignore
  user: User = {};
}
