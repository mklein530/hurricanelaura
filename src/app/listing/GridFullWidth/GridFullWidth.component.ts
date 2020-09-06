import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/services/user-service';
import { User } from '../../models/user';
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
  unfilteredData: User[] = [];
  filters = {
    helper: 'all',
    rating: 'all',
    search: ''
  }
  distancePromises = [];
  distances: string[] = [];
  page: number = 1;
  constructor(protected userService: UserService, protected postService: PostService, protected router: Router) { }
  changePage($event) {
    this.page = $event;
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  filterData() {
    this.users = this.unfilteredData.filter(data => {
      let meetsCriteria = true;
      if (this.filters.rating !== 'all') {
        meetsCriteria = Number(data.rating) === Number(this.filters.rating);
      }
      if (!meetsCriteria) return false;
      if (this.filters.helper !== 'all') {
        meetsCriteria = this.filters.helper === 'contractors' ? data.isContractor : data.isVolunteer;
      }
      if (!meetsCriteria) return false;
      if (this.filters.search) {
        const fullName = data.firstName + ' ' + data.lastName;
        meetsCriteria = fullName.toLowerCase().indexOf(this.filters.search.toLowerCase()) > -1;
      }
      return meetsCriteria;
    });
  }

  setFilter(value, type: string) {
    this.filters[type] = value;
    this.filterData();
  }

  async ngOnInit() {
    this.users = this.unfilteredData = await this.userService.getHelpers();
    this.distancePromises = this.users.map((user, index) => this.getDistance(user));
    this.distances = (await Promise.all(this.distancePromises)).map((distance, index) => distance);
  }

  ngAfterViewInit() { }

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
