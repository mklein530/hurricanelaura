import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Response, Decision } from 'src/app/models/response';
import { Posting } from 'src/app/models/posting';
import { PostService } from 'src/app/services/post.service';
import { ResponseService } from 'src/app/services/response.service';
import { UserService } from 'src/app/services/user-service';
import * as moment from 'moment';
import { formatPhoneNumber } from 'src/app/services/form-util';
import { MatDialog } from '@angular/material/dialog';
import { MessageModalComponent } from 'src/app/globalFrontendComponents/review-response-modal/review-response-modal.component';
import { SnackService } from 'src/app/services/snack-service';

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

  constructor(
    protected postService: PostService,
    protected responseService: ResponseService,
    protected userService: UserService,
    protected modal: MatDialog,
    protected snackService: SnackService
  ) {}

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

  approve(response: Response) {
    this.openApprovalModal(true, response.id, response.postId);
  }

  reject(response: Response) {
    this.openApprovalModal(false, response.id, response.postId);
  }

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

  openApprovalModal(approve: boolean, responseId: string, postId: string) {
    const initialValues: Decision = {
      approved: approve,
      rejected: !approve,
      message: '',
      createdAt: new Date().getTime(),
    };
    const ref = this.modal.open(MessageModalComponent, {
      data: {
        // @ts-ignore
        form: this.responseService.buildForm(initialValues, '', Decision),
        header: approve ? 'Approve Helper' : 'Reject Helper',
        subheader: 'Enter a message to let this user know about your decision. (Optional)',
        messagePlaceholder: 'Explanation',
      },
      height: '22rem',
      width: '50rem',
      panelClass: 'custom-dialog-container',
    });
    ref.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.responseService.update(responseId, { decision: result });
          if (this.joinedResponses[postId]) {
            const index = this.joinedResponses[postId].responses.findIndex((r) => r.id === responseId);
            this.joinedResponses[postId].responses[index].decision = result;
          }
          this.snackService.showMessage('Review sent!');
        } catch (error) {
          this.snackService.showMessage('Unable to submit review');
        }
      }
    });
  }
}
