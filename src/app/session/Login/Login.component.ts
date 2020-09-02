import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user-service';

@Component({
  selector: 'login',
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  error = '';

  constructor(protected router: Router, protected formBuilder: FormBuilder, protected authService: UserService) {}

  get passwordError() {
    const errors = this.form.get('password').errors;
    const touched = this.form.get('password').touched;
    if (errors && touched) {
      let error = '';
      Object.keys(errors).forEach((key) => {
        error = 'Please enter a valid password.';
      });
      return error;
    }
  }

  get emailError() {
    const errors = this.form.get('email').errors;
    const touched = this.form.get('email').touched;
    if (errors && touched) {
      let error = '';
      Object.keys(errors).forEach((key) => {
        error = 'Please enter a valid email.';
      });
      return error;
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngAfterViewInit() {}

  routeToSignup() {
    return this.router.navigate(['signup']);
  }

  async onSubmit() {
    this.loading = true;
    this.error = '';
    try {
      await this.authService.login(this.form.get('email').value, this.form.get('password').value);
      this.router.navigateByUrl('/admin/profile');
    } catch (error) {
      if (error && (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found')) {
        this.error = 'Username or password is invalid';
      }
    } finally {
      this.loading = false;
    }
  }
}
