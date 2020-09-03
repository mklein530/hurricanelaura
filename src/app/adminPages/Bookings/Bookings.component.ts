import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Response } from 'src/app/models/response';
import { Posting } from 'src/app/models/posting';
import { PostService } from 'src/app/services/post.service';
import { ResponseService } from 'src/app/services/response.service';
import { UserService } from 'src/app/services/user-service';
import * as moment from 'moment';
import { formatPhoneNumber } from 'src/app/services/form-util';

@Component({
  selector: 'admin-bookings',
  templateUrl: './Bookings.component.html',
  styleUrls: ['./Bookings.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BookingsComponent implements OnInit {
  responses: Response[] = [];
  posts: Posting[] = [];
  loading = false;
  joinedResponses: { [postId: string]: { post: Posting; responses: Response[] } } = {};

  constructor(protected postService: PostService, protected responseService: ResponseService, protected userService: UserService) {}

  getPostAttribute(postId: string, attr: keyof Posting) {
    return this.joinedResponses[postId].post[attr];
  }

  async getResponses() {
    const promises = [];
    this.posts.forEach((post) => {
      promises.push(this.responseService.getPostResponses(post.id));
    });
    const responses = await Promise.all(promises);
    responses.forEach((res) => {
      if (res && res.length) this.responses.push(...res);
    });
  }

  async getPosts() {
    this.posts = await this.postService.getUserPosts(this.userService.user.uid);
  }

  async ngOnInit() {
    this.loading = true;
    await this.getPosts();
    await this.getResponses();
    this.joinResponses();
    this.loading = false;
  }

  ngAfterViewInit() {}

  getAvatar(response: Response) {
    if (response.responder && response.responder.avatar) {
      return response.responder.avatar;
    }
    return 'assets/images/avatar-placeholder.png';
  }

  getDate(response: Response) {
    return moment(response.createdAt).format('YYYY-MM-DD');
  }

  formatPhone(phone: string) {
    return formatPhoneNumber(phone);
  }

  approve(response: Response) {}

  reject(response: Response) {}

  getLink(link: string) {
    if (!link.startsWith('http') && !link.startsWith('https')) {
      return 'http://' + link;
    }
  }

  joinResponses() {
    this.posts.forEach((post) => {
      const responses = [];
      this.responses.forEach((res) => {
        if (res.postId === post.id) {
          responses.push(res);
        }
      });
      this.joinedResponses[post.id] = {
        post,
        responses,
      };
    });
  }
}
