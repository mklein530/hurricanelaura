import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { UserService } from '../../services/user-service';
import { SnackService } from '../../services/snack-service';
import { BaseComponent } from '../../adminPages/BaseComponent';
import { Contact } from '../../models/contact';

@Component({
  selector: 'contact-us',
  templateUrl: './Contact.component.html',
  styleUrls: ['./Contact.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContactComponent extends BaseComponent implements OnInit {

  constructor(protected contactService: ContactService, protected userService: UserService,
    protected snackService: SnackService) {
    super();
  }

  ngOnInit() {
    this.form = this.contactService.buildForm({ ...new Contact(), userId: this.userService.user.uid }, '', Contact);
    super.ngOnInit();
  }

  async submit() {
    this.form.markAllAsTouched();
    this.form.markAsDirty();
    if (this.form.valid) {
      try {
        await this.contactService.create(this.form.value, this.contactService.createId());
        this.snackService.showMessage('Successfully sent message!');
      } catch (error) {
        this.snackService.showMessage('Failed to send message');
      }
    } else {
      this.snackService.showMessage('Your form has errors');
    }
  }

  ngAfterViewInit() {

  }
}
