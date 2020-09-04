import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/services/user-service';
import { PostService } from 'src/app/services/post.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReviewService } from 'src/app/services/review.service';
import { User } from 'src/app/models/user';
import { Posting } from 'src/app/models/posting';
import { Review, ReviewResponse } from 'src/app/models/review';
import * as moment from 'moment';
import { SnackService } from 'src/app/services/snack-service';
import { MatDialog } from '@angular/material/dialog';
import { ReviewModalComponent } from 'src/app/globalFrontendComponents/review-modal/review-modal.component';
import { ReviewResponseModalComponent } from 'src/app/globalFrontendComponents/review-response-modal/review-response-modal.component';

@Component({
  selector: 'user-profile',
  templateUrl: './UserProfile.component.html',
  styleUrls: ['./UserProfile.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserProfileComponent implements OnInit {
  loading = false;
  subs: Subscription[] = [];
  user: User;
  posts: Posting[] = [];
  distance: string = 'Loading...';
  distances: string[] = [];
  distancePromises: any[] = [];
  reviews: Review[] = [];
  constructor(
    protected userService: UserService,
    protected postingService: PostService,
    protected reviewService: ReviewService,
    protected route: ActivatedRoute,
    protected snackService: SnackService,
    protected modal: MatDialog
  ) {}

  subscribeToQueryParams(onQueryParams: (user: string) => any) {
    return this.route.queryParams.subscribe(async (params) => {
      if (params && params.user) {
        onQueryParams(params.user);
      }
    });
  }

  get navigationState() {
    return window.history.state;
  }

  get status() {
    if (this.user.isVolunteer && this.user.isContractor) {
      return 'Volunteer & Contractor';
    }
    if (this.user.isContractor) {
      return 'Contractor';
    }
    if (this.user.isVolunteer) {
      return 'Volunteer';
    }
  }

  async ngOnInit() {
    this.loading = true;
    if (this.navigationState && this.navigationState.user) {
      this.user = this.navigationState.user;
      this.posts = await this.postingService.getUserPosts(this.user.uid);
      this.getDistance();
      this.getPostDistances();
      this.reviews = await this.reviewService.getUserReviews(this.user.uid);
      this.loading = false;
    } else {
      this.subs.push(
        this.subscribeToQueryParams(async (userId) => {
          [this.user, this.posts] = await Promise.all([this.userService.getUser(userId), this.postingService.getUserPosts(userId)]);
          this.getDistance();
          this.getPostDistances();
          this.reviews = await this.reviewService.getUserReviews(this.user.uid);
          this.loading = false;
        })
      );
    }
  }

  async getDistance() {
    this.distance = await this.postingService.distanceFromUser(this.user.address && { lat: this.user.address.lat, lng: this.user.address.lng });
  }

  async getPostDistances() {
    this.distancePromises = this.posts.map((p, index) =>
      this.postingService.distanceFromUser(p.address && { lat: p.address.lat, lng: p.address.lng })
    );
    this.distances = (await Promise.all(this.distancePromises)).map((distance, index) => distance);
  }

  getPostDistance(index) {
    return this.distances.length ? this.distances[index] : 'Loading...';
  }

  ngAfterViewInit() {}

  getAvatar(user: User) {
    if (user.avatar) {
      return user.avatar;
    }
    return 'assets/images/avatar-placeholder.png';
    // return '../../../assets/images/thumb-4.jpg';
  }

  getImage(post: Posting) {
    if (post.images && post.images.length) {
      return post.images[0];
    }
    return 'assets/images/avatar-placeholder.png';
    // return '../../../assets/images/thumb-4.jpg';
  }

  get facebook() {
    const facebook = this.user.facebook;
    if (facebook && !facebook.startsWith('http') && !facebook.startsWith('https')) {
      return 'http://' + facebook;
    }
    return facebook;
  }

  get website() {
    const website = this.user.website;
    if (website && !website.startsWith('http') && !website.startsWith('https')) {
      return 'http://' + website;
    }
    return website;
  }

  formatDate(date: number) {
    return moment(date).fromNow();
  }

  get isCurrentUser() {
    return this.userService.user.uid === this.user.uid;
  }

  openReviewModal() {
    const initialValues: Review = {
      ...new Review(),
      reviewer: this.userService.user,
      createdAt: new Date().getTime(),
      reviewee: this.user,
    };
    const ref = this.modal.open(ReviewModalComponent, {
      data: {
        form: this.reviewService.buildForm(initialValues, '', Review),
      },
      height: '25rem',
      width: '50rem',
      panelClass: 'custom-dialog-container',
    });
    ref.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          const review = { ...result, id: this.reviewService.createId() };
          await this.reviewService.create(review);
          this.reviews.push(review);
          this.snackService.showMessage('Review sent!');
        } catch (error) {
          this.snackService.showMessage('Unable to submit review');
        }
      }
    });
  }

  openReviewResponseModal(reviewId: string, index: number) {
    const initialValues: ReviewResponse = {
      ...new ReviewResponse(),
      createdAt: new Date().getTime(),
    };
    const ref = this.modal.open(ReviewResponseModalComponent, {
      data: {
        // @ts-ignore
        form: this.reviewService.buildForm(initialValues, '', ReviewResponse),
      },
      height: '25rem',
      width: '50rem',
      panelClass: 'custom-dialog-container',
    });
    ref.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          const reviewResponse = { ...result };
          await this.reviewService.update(reviewId, { response: reviewResponse });
          this.reviews[index].response = reviewResponse;
          this.snackService.showMessage('Response sent!');
        } catch (error) {
          this.snackService.showMessage('Unable to send response');
        }
      }
    });
  }
}
