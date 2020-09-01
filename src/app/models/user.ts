import { Address } from "./address";
import { BaseEntity } from "./base-entity";

export class User extends BaseEntity {
  uid: string = '';
  contractorId: string = '';
  volunteerId: string = '';
  isContractor: boolean = false;
  isVolunteer: boolean = false;
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  phoneNumber: string = '';
  facebook: string = '';
  avatar: string = '';
  // @ts-ignore
  address: Address = {};
  website: string = '';
  password: string;
}
