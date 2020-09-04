import { Component, OnInit, AfterViewInit, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { Posting } from 'src/app/models/posting';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user-service';
import { PostService } from 'src/app/services/post.service';
import { Subscription } from 'rxjs';
import { formatPhoneNumber } from 'src/app/services/form-util';
import { ResponseService } from 'src/app/services/response.service';
import { Response } from 'src/app/models/response';
import * as moment from 'moment';

@Component({
  selector: 'list-detail-two',
  templateUrl: './ListingDetailTwo.component.html',
  styleUrls: ['./ListingDetailTwo.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ListingDetailTwoComponent implements OnInit, OnDestroy {
  post: Posting;
  responses: Response[] = [];
  loading = false;
  subs: Subscription[] = [];
  distance: string = 'Loading distance...';
  lat = -34.397;
  lng = 150.644;
  smallGalleryTitle: string = 'Gallery';
  smallGalleryData: any = [
    {
      image: 'assets/images/dp-1.jpg',
    },
    {
      image: 'assets/images/dp-4.jpg',
    },
    {
      image: 'assets/images/dp-3.jpg',
    },
    {
      image: 'assets/images/dp-5.jpg',
    },
  ];

  constructor(
    protected router: Router,
    protected userService: UserService,
    protected postService: PostService,
    protected route: ActivatedRoute,
    protected responseService: ResponseService
  ) {}

  get navigationState() {
    return window.history.state;
  }

  get userIsPoster() {
    return this.post.user.uid === this.userService.user.uid;
  }

  subscribeToQueryParams(onQueryParams: (postId: string) => any) {
    return this.route.queryParams.subscribe(async (params) => {
      if (params && params.postId) {
        onQueryParams(params.postId);
      }
    });
  }

  async ngOnInit() {
    this.loading = true;
    if (this.navigationState && this.navigationState.post) {
      this.post = this.navigationState.post;
      this.getDistance();
      this.responses = await this.responseService.getPostResponses(this.post.id);
      this.loading = false;
    } else {
      this.subs.push(
        this.subscribeToQueryParams(async (postId) => {
          this.post = await this.postService.get(postId);
          this.getDistance();
          this.responses = await this.responseService.getPostResponses(postId);
          this.loading = false;
        })
      );
    }
  }

  async getDistance() {
    this.distance = await this.postService.distanceFromUser({ lat: this.post.address.lat, lng: this.post.address.lng });
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => {
      if (sub && !sub.closed) {
        sub.unsubscribe();
      }
    });
  }

  format(phone) {
    return formatPhoneNumber(phone);
  }

  getTime(time: number) {
    return moment(time).fromNow();
  }

  getAvatar(response: Response) {
    if (response && response.responder && response.responder.avatar) {
      return response.responder.avatar;
    }
    return 'assets/images/avatar-placeholder.png';
  }
}
