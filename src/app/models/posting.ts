import { Address } from './address';
import { BaseEntity } from './base-entity';
import { User } from './user';
import { Validators } from '@angular/forms';

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
  cleanup: boolean = false;
  repair: boolean = false;
  other: boolean = false;
  showInfo: boolean = false;

  validations = {
    email: ['', Validators.email, Validators.required],
    title: ['', Validators.required],
    description: ['', Validators.required],
  };
}

export function getCategories(post: Posting) {
  const categories = ['cleanup', 'repair', 'other'].filter(cat => {
    return post[cat] === true;
  });
  if (categories.length === 0) {
    return ['cleanup'];
  }
  return categories;
}