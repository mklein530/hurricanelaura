import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/services/user-service';
import { User } from 'src/app/models/user';
import { PostService } from 'src/app/services/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'grid-full-width',
  templateUrl: './GridFullWidth.component.html',
  styleUrls: ['./GridFullWidth.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GridFullWidthComponent implements OnInit {
  users: User[] = [];
  Data: any = [
    {
      badge: 'Now Open',
      category: 'Eat & Drink',
      title: 'Tom Restaurant',
      address: '964 School Street, New York',
      image: 'assets/images/most-img-1.jpg',
      rating: '5',
      review: '(12 reviews)',
    },
  ];
  distancePromises = [];
  distances: string[] = [];
  page: number = 1;
  constructor(protected userService: UserService, protected postService: PostService, protected router: Router) {}

  async ngOnInit() {
    this.users = await this.userService.getHelpers();
    this.distancePromises = this.users.map((user, index) => this.getDistance(user));
    this.distances = (await Promise.all(this.distancePromises)).map((distance, index) => distance);
  }

  ngAfterViewInit() {}

  getAvatar(user: User) {
    if (user.avatar) {
      return user.avatar;
    }
    return 'assets/images/avatar-placeholder.png';
    // return '../../../assets/images/thumb-4.jpg';
  }

  userDistance(user: User, index: number) {
    return this.distances.length ? this.distances[index] : 'Loading...';
  }

  async getDistance(user: User) {
    return this.postService.distanceFromUser(user.address && { lat: user.address.lat, lng: user.address.lng });
  }

  selectUser(user: User) {
    return this.router.navigate(['pages', 'user-profile'], { queryParams: { user: user.uid }, state: { user } });
  }

  getStat(user: User, prop: keyof User): number {
    if (user[prop] !== undefined && user[prop] !== null) {
      return user[prop] as number;
    }
    return 0;
  }

  ratings(user: User) {
    return Array(user.rating || 3).fill(1);
  }
}
