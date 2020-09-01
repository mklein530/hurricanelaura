import { Component, OnInit, AfterViewInit, ViewEncapsulation, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { User } from '../../models/user';

@Component({
  selector: 'signup',
  templateUrl: './SignUp.component.html',
  styleUrls: ['./SignUp.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SignUpComponent implements OnInit {
  form: FormGroup;
  error: string = '';
  type: 'login' | 'signup' | 'reset' = 'signup';
  loading = false;

  serverMessage: string;

  constructor(private userService: UserService, private fb: FormBuilder, protected router: Router) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.minLength(6), Validators.required]
      ],
      passwordConfirm: ['', []]
    });
  }

  changeType(val) {
    this.type = val;
  }

  get isLogin() {
    return this.type === 'login';
  }

  get isSignup() {
    return this.type === 'signup';
  }

  get isPasswordReset() {
    return this.type === 'reset';
  }

  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }

  get passwordConfirm() {
    return this.form.get('passwordConfirm');
  }

  get passwordDoesMatch() {
    if (this.type !== 'signup') {
      return true;
    } else {
      return this.password.value === this.passwordConfirm.value;
    }
  }

  async onSubmit() {
    this.loading = true;

    const email = this.email.value;
    const password = this.password.value;
    const name = this.form.get('name').value;
    const [firstName, lastName] = name.split(' ');
    this.error = '';
    try {
      if (this.isLogin) {
        await this.userService.login(email, password);
      }
      if (this.isSignup) {
        await this.userService.createUser({ ...new User(), email, password, firstName, lastName });
      }
      if (this.isPasswordReset) {
        await this.userService.sendForgotPasswordEmail(email);
        this.serverMessage = 'Check your email';
      }
      this.router.navigateByUrl('/admin/profile');
    } catch (err) {
      this.serverMessage = err;
      this.error = 'Registration failed';
    }

    this.loading = false;
  }

  routeToLogin() {
    return this.router.navigate(['login'])
  }
}
