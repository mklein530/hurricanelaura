import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/services/user-service';
import { PostService } from 'src/app/services/post.service';
import { ResponseService } from 'src/app/services/response.service';
import { Posting } from 'src/app/models/posting';
import { Router } from '@angular/router';
import { getAddressDisplay } from 'src/app/services/form-util';
import { SnackService } from 'src/app/services/snack-service';

@Component({
  selector: 'admin-list',
  templateUrl: './List.component.html',
  styleUrls: ['./List.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ListComponent implements OnInit {
  Data: any[] = [];
  posts: Posting[] = [];
  //  Data : any = [
  //                    {
  //                       badge    : 'Open',
  //                       category : 'Eat & Drink',
  //                       title    : 'Cafe Bar',
  //                       address  : 'Wall Street, New York',
  //                       image    : 'assets/images/most-img-1.jpg',
  //                       review   : '(12 reviews)'
  //                    },

  constructor(
    protected userService: UserService,
    protected postService: PostService,
    protected responseService: ResponseService,
    protected router: Router,
    protected snackService: SnackService
  ) {}

  async getResponses() {
    const promises = [];
    this.Data.forEach((post) => {
      promises.push(this.responseService.getPostResponses(post.postId));
    });
    const responses = await Promise.all(promises);
    responses.forEach((responses, i) => {
      this.Data[i] = { ...this.Data[i], response: responses.length };
    });
  }

  async buildPosts() {
    const posts = await this.postService.getUserPosts(this.userService.user.uid);
    this.posts = posts;
    this.Data = posts.map((post) => {
      const address = post.address;
      return {
        postId: post.id,
        badge: 'Help Needed',
        category: 'Cleanup',
        title: post.title,
        address: getAddressDisplay(address.street, address.city, address.state, address.zip),
        image: post.images && post.images.length ? post.images[0] : null,
        contractors: post.numContractors,
        volunteers: post.numVolunteers,
        wantContractors: post.wantContractors,
        wantVolunteers: post.wantVolunteers,
        responses: 'Loading...',
        post,
      };
    });
  }

  selectPost(item) {
    // [state]="{ post: list.post }" [queryParams]="{ post: list.id }" [routerLink]="['/listing/detail/version2']
    this.router.navigate(['listing', 'detail', 'version2'], {
      queryParams: {
        postId: item.post.id,
      },
      state: {
        post: item.post,
      },
    });
  }

  async ngOnInit() {
    await this.buildPosts();
    await this.getResponses();
  }

  notify() {
    this.snackService.showMessage('Feature not available yet');
  }

  edit(item) {
    this.notify();
  }

  remove(item) {
    this.notify();
  }

  complete(item) {
    this.notify();
  }
}
