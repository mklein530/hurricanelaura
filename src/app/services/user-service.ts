import { Injectable } from '@angular/core';
import { auth as firebaseAuth } from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import _ from 'lodash';
import { FormBuilder, FormControl, Validators, ValidatorFn } from '@angular/forms';
// import { CloudFunctionService } from '../functions/cloud-function.service';
import firebase from 'firebase';
import BaseFirestoreService from './base.service';
import { User } from '../models/user';
import { hasUpperCase, hasLowerCase, hasNumber } from './user-util';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseFirestoreService<User> {
  //@ts-ignore
  cachedDetails: { email: string; password: string } = {};
  authSubscription: firebase.Unsubscribe;

  constructor(
    protected firestore: AngularFirestore,
    private auth: AngularFireAuth,
    protected formBuilder: FormBuilder,
    // protected functions: CloudFunctionService
  ) {
    super(firestore, 'users');
  }

  async login(email: string, password: string) {
    const _user = await this.signInWithEmail(email, password);
    if (_user) {
      this.user = await this.getUser(_user.user.uid);
    }
  }

  async autoLogin(): Promise<firebase.User> {
    return new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  }

  async doAutoLogin() {
    await this.setPersistence();
    try {
      const user = await this.autoLogin();
      this.user = await this.getUser(user.uid);
    } catch (error) {
      console.error('Failed to log in');
    }
    return this.user;
  }

  retrieveCredential() {
    // return this.localStorage.get<firebaseAuth.AuthCredential>('credential');
  }

  loginWithCredential(credential: firebaseAuth.AuthCredential) {
    return this.auth.signInWithCredential(credential);
  }

  /**
   * Creates a new user with email and password
   * @param {*} email
   * @param {*} password
   */
  createUserWithEmail(email, password): Promise<firebase.User> {
    return this.auth.createUserWithEmailAndPassword(email, password).then((user) => user.user);
  }

  anonymouslyLogin() {
    return this.auth.signInAnonymously();
  }

  /**
   * Logs in an existing user with email and password
   * @param {*} email
   * @param {*} password
   */
  signInWithEmail(email: string, password: string): Promise<firebaseAuth.UserCredential> {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  async convertAnonymousUser(email: string, password: string) {
    const credential = firebaseAuth.EmailAuthProvider.credential(email, password);
    const currentUser = await this.auth.currentUser;
    await currentUser.linkWithCredential(credential);
    return this.signInWithEmail(email, password).then((user) => user.user);
  }

  signOut() {
    return this.auth.signOut();
  }

  sendForgotPasswordEmail(email: string): Promise<void> {
    return this.auth.sendPasswordResetEmail(email);
  }

  async getUser(userId: string, email?: string): Promise<User> {
    if (email) {
      const result = await this.getByAttribute('email', '==', email);
      return result && result.length ? result[0] : null;
    }
    return this.get(userId);
  }

  userWithEmailExists(email: string): Promise<boolean> {
    return this.auth.fetchSignInMethodsForEmail(email).then((results) => {
      return results && results.length ? true : false;
    });
  }

  createAnonUser(id: string, anonUser: User) {
    return this.create(anonUser, id);
  }

  async createUser(_user: User): Promise<User> {
    const user = _.cloneDeep(_user);
    let userCredential = user.isAnonymous
      ? await this.convertAnonymousUser(user.email, user.password)
      : await this.createUserWithEmail(user.email, user.password);
    const newUser = this.convertFirebaseUser(user, userCredential);
    await this.create(JSON.parse(JSON.stringify(newUser)), newUser.uid);
    this.user = newUser;
    return this.user;
  }

  async updateUser(id: string, values: Partial<User>) {
    await this.update(id, values);
    this.user = { ...this.user, ...values };
  }

  getAuthUser(forceRefresh: boolean = false) {
    return this.auth.currentUser.then((currentUser) => currentUser.getIdTokenResult(forceRefresh));
  }

  refreshClaims() {
    return this.auth.currentUser.then((currentUser) => currentUser.getIdToken(true));
  }

  convertFirebaseUser(user: Partial<User>, userCredential: firebase.User) {
    (user as any).password = null;
    //@ts-ignore
    const newUser: User = {
      ...user,
      uid: userCredential.uid,
      id: userCredential.uid,
      // emailVerified: user.emailVerified || userCredential.emailVerified,
      phoneNumber: user.phoneNumber,
    };
    return newUser;
  }

  buildAuthForm = (user: User = new User(), fullName: boolean = true) => {
    if (user) {
      const name = user.firstName && user.lastName ? user.firstName + ' ' + user.lastName : '';
      return this.formBuilder.group({
        fullName: fullName ? new FormControl(name, [Validators.required]) : undefined,
        email: new FormControl(user.email, [Validators.required, Validators.email]),
        password: new FormControl(user.password, [Validators.required, this.validatePassword]),
      });
    } else {
      return this.formBuilder.group({
        email: new FormControl(user.email, [Validators.required, Validators.email]),
        password: new FormControl(user.password, [Validators.required, this.validatePassword]),
      });
    }
  };

  validatePassword: ValidatorFn = (password: FormControl) => {
    const errors: any = {};
    if (!password.value) {
      errors.characters = 'Password must have 8 characters.';
      return;
    }
    if (password.value.length < 8) errors.characters = 'Password must have 8 characters.';
    if (!hasUpperCase(password.value)) errors.uppercase = 'Password must contain at least one uppercase letter.';
    if (!hasLowerCase(password.value)) errors.lowercase = 'Password must contain at least one lowercase letter.';
    if (!hasNumber(password.value)) errors.number = 'Password must contain at least one number.';
    return errors;
  };

  async setPersistence() {
    try {
      await this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    } catch (error) {
      console.error('Failed to persist auth');
    }
  }

  async logout() {
    await this.auth.signOut();
  }
}
