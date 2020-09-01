import { Address } from "./address";
import { BaseEntity } from "./base-entity";

export class Posting extends BaseEntity {
  title: string;
  descripton: string;
  address: Address;
  price: string;
  wantVolunteers: boolean;
  wantContractors: boolean;
  numVolunteers: number;
  numContractors: number;
  name: string;
  email: string;
  website: string;
  phoneNumber: string;
  facebook: string;
  images: string[];
  geohash: string = '';
}