import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { BaseEntity } from '../models/base-entity';
import { User } from '../models/user';
import { FormBuilder, FormArray, FormControl, FormGroup } from '@angular/forms';

export default class BaseFirestoreService<T extends BaseEntity> {
  collection: AngularFirestoreCollection<T>;
  _user: User;
  entity: any;

  constructor(protected firestore: AngularFirestore, protected collectionName: string, protected formBuilder: FormBuilder) {
    this.collection = firestore.collection(collectionName);
  }

  get user() {
    return this._user;
  }

  set user(user: User) {
    this._user = user;
  }

  createId() {
    return this.firestore.createId();
  }

  async get(id: string) {
    const doc = await this.collection.doc(id).get().toPromise();
    return doc.exists && (doc.data() as T);
  }

  async getByAttribute(attribute: string, operator: firestore.WhereFilterOp, value: any) {
    const result = await this.collection.ref.where(attribute, operator, value).get();
    return result.docs.length ? result.docs.map((doc) => doc.data() as T) : [];
  }

  async update(id: string, object: Partial<T>) {
    return this.collection.doc(id).update(object);
  }

  async delete(id: string) {
    return this.collection.doc(id).delete();
  }

  async create(object: T, _id?: string) {
    const id = _id ? _id : this.createId();
    return this.collection.doc(id).set(object);
  }

  async add(object: T) {
    return this.collection.add(object);
  }

  private buildFormArray(defaultValues: any[], validationKey: string = ''): FormArray {
    const controls = [];
    defaultValues.forEach((property) => {
      if (Array.isArray(property)) {
        controls.push(this.buildFormArray(property));
      } else if (typeof property === 'object' && Object.prototype.toString.call(property) !== '[object Date]') {
        controls.push(this.buildForm(property, validationKey));
      }
    });
    return this.formBuilder.array(controls);
  }

  private buildFormControl(controls: any | any[], values: any, key: string, validationKey: string = '') {
    if (key === 'validations') {
      return;
    }
    const property = values[key];
    if (Array.isArray(property)) {
      controls[key] = this.buildFormArray(property, validationKey + key + '.');
    } else if (property && typeof property === 'object' && Object.prototype.toString.call(property) !== '[object Date]') {
      controls[key] = this.buildForm(property, validationKey + key + '.');
    } else {
      const entity = this.entity as any;
      // tslint:disable-next-line: max-line-length
      const validations =
        entity.validations && entity.validations[validationKey + key] ? (<[]>entity.validations[validationKey + key]).slice(1) : null;
      controls[key] = new FormControl(values[key], validations);
    }
  }

  public buildForm(defaultValues: Object, validationKey: string = '', Entity?: new () => T): FormGroup {
    this.entity = this.entity || new Entity();
    const controls = {};
    Object.keys(defaultValues).forEach((key: string) => {
      this.buildFormControl(controls, defaultValues, key, validationKey);
    });
    return this.formBuilder.group(controls);
  }
}
