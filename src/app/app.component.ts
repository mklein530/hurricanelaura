import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(protected userService: UserService) { }

  async ngOnInit() {
    await this.userService.doAutoLogin();
  }
}
