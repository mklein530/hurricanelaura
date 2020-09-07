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
  modalShowing = false;

  constructor(
    protected firestore: AngularFirestore,
    private auth: AngularFireAuth,
    protected formBuilder: FormBuilder // protected functions: CloudFunctionService
  ) {
    super(firestore, 'users', formBuilder);
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

  async signOut() {
    await this.auth.signOut();
    this.user = null;
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
    const name = userCredential.displayName ? userCredential.displayName.split(' ') : ['', ''];
    const [firstName, lastName] = name;
    //@ts-ignore
    const newUser: User = {
      ...user,
      uid: userCredential.uid,
      id: userCredential.uid,
      email: userCredential.email,
      avatar: user.avatar || userCredential.photoURL,
      providerId: userCredential.providerId,
      firstName,
      lastName,
      // firstName: userCredential
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

  async googleSignIn() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      ['email', 'profile'].forEach((scope) => provider.addScope(scope));
      const result = await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      let user = await this.getUser(result.user.uid);
      if (!user) {
        user = this.convertFirebaseUser(new User(), result.user);
        await this.create(JSON.parse(JSON.stringify(user)), user.uid);
      }
      this.user = user;
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async facebookSignIn() {
    try {
      const provider = new firebase.auth.FacebookAuthProvider();
      ['email', 'user_link'].forEach((scope) => provider.addScope(scope));
      const result = await this.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
      let user = await this.getUser(result.user.uid);

      if (!user) {
        let avatar = '';
        //@ts-ignore
        if (result.additionalUserInfo.profile.picture && result.additionalUserInfo.profile.picture.data) {
          //@ts-ignore
          avatar = result.additionalUserInfo.profile.picture.data.url || result.user.photoURL;
        }
        user = this.convertFirebaseUser({ ...new User(), avatar }, result.user);
        await this.create(JSON.parse(JSON.stringify(user)), user.uid);
      }
      this.user = user;
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async getHelpers() {
    const [contractors, volunteers] = await Promise.all([
      this.getByAttribute('isContractor', '==', true),
      this.getByAttribute('isVolunteer', '==', true),
    ]);
    const contractorsMap = {};
    contractors.forEach((c) => (contractorsMap[c.uid] = c));
    volunteers.forEach((v) => {
      if (!contractorsMap[v.uid]) {
        contractors.push(v);
      }
    });
    return contractors;
  }

  handleFacebookError() {
    // // An error happened.
    // if (error.code === 'auth/account-exists-with-different-credential') {
    //   // Step 2.
    //   // User's email already exists.
    //   // The pending Facebook credential.
    //   var pendingCred = error.credential;
    //   // The provider account's email address.
    //   var email = error.email;
    //   // Get sign-in methods for this email.
    //   auth.fetchSignInMethodsForEmail(email).then(function (methods) {
    //     // Step 3.
    //     // If the user has several sign-in methods,
    //     // the first method in the list will be the "recommended" method to use.
    //     if (methods[0] === 'password') {
    //       // Asks the user their password.
    //       // In real scenario, you should handle this asynchronously.
    //       var password = promptUserForPassword(); // TODO: implement promptUserForPassword.
    //       auth
    //         .signInWithEmailAndPassword(email, password)
    //         .then(function (user) {
    //           // Step 4a.
    //           return user.linkWithCredential(pendingCred);
    //         })
    //         .then(function () {
    //           // Facebook account successfully linked to the existing Firebase user.
    //           goToApp();
    //         });
    //       return;
    //     }
    //     // All the other cases are external providers.
    //     // Construct provider object for that provider.
    //     // TODO: implement getProviderForProviderId.
    //     var provider = getProviderForProviderId(methods[0]);
    //     // At this point, you should let the user know that they already has an account
    //     // but with a different provider, and let them validate the fact they want to
    //     // sign in with this provider.
    //     // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
    //     // so in real scenario you should ask the user to click on a "continue" button
    //     // that will trigger the signInWithPopup.
    //     auth.signInWithPopup(provider).then(function (result) {
    //       // Remember that the user may have signed in with an account that has a different email
    //       // address than the first one. This can happen as Firebase doesn't control the provider's
    //       // sign in flow and the user is free to login using whichever account they own.
    //       // Step 4b.
    //       // Link to Facebook credential.
    //       // As we have access to the pending credential, we can directly call the link method.
    //       result.user.linkAndRetrieveDataWithCredential(pendingCred).then(function (usercred) {
    //         // Facebook account successfully linked to the existing Firebase user.
    //         goToApp();
    //       });
    //     });
    //   });
    // }
  }
}
