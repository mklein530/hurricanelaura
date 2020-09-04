import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/services/user-service';
import { PostService } from 'src/app/services/post.service';
import { Posting } from 'src/app/models/posting';
import { Router } from '@angular/router';

@Component({
  selector: 'list-full-width',
  templateUrl: './ListFullWidth.component.html',
  styleUrls: ['./ListFullWidth.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ListFullWidthComponent implements OnInit {
  Data;
  posts: Posting[] = [];
  page: number = 1;
  constructor(protected userService: UserService, protected postService: PostService, protected router: Router) {}

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

  async buildPosts() {
    const posts = await this.postService.getPosts();
    this.posts = posts;
    const addressResults = [];
    this.Data = posts.map((post) => {
      addressResults.push(
        this.postService.distanceFromUser(post.address ? { lat: post.address.lat, lng: post.address.lng } : { lat: null, lng: null })
      );
      return {
        postId: post.id,
        badge: 'Help Needed',
        category: 'Cleanup',
        title: post.title,
        address: 'Loading...',
        image: post.images && post.images.length ? post.images[0] : null,
        contractors: post.numContractors,
        volunteers: post.numVolunteers,
        wantContractors: post.wantContractors,
        wantVolunteers: post.wantVolunteers,
        post,
      };
    });
    return addressResults;
  }

  async resolveAddresses(addressResults: Promise<string>[]) {
    const addresses = await Promise.all(addressResults);
    return addresses.map((address, i) => {
      return { ...this.Data[i], address };
    });
  }

  async ngOnInit() {
    const addresses = await this.buildPosts();
    this.Data = await this.resolveAddresses(addresses);
  }
  // 1 contractor signed up
  // 2 volunteers signed up
  //  Data: any = [
  //     {
  //        badge: 'Help Needed',
  //        category: 'Cleanup',
  //        title: 'Clean up trees',
  //        address: '3 miles away',
  //        image: 'assets/images/roadtrees.jpg',
  //        rating: '5',
  //        review: '(12 reviews)',
  //        contractors: '1',
  //        volunteers: '2'
  //     },
  //     {
  //        badge: 'Contractors Needed',
  //        category: 'Repair',
  //        title: 'Sticky Band',
  //        address: 'Bishop Avenue, New York',
  //        image: 'assets/images/most-img-2.jpg',
  //        rating: '5',
  //        review: '(23 reviews)'
  //     },
  //     {
  //        badge: 'Volunteers Needed',
  //        category: 'Hotels',
  //        title: 'Hotel Govendor',
  //        address: '778 Country Street, New York',
  //        image: 'assets/images/most-img-3.jpg',
  //        rating: '5',
  //        review: '(17 reviews)'
  //     },
  //     {
  //        badge: 'Now Open',
  //        category: 'Eat & Drink',
  //        title: 'Burger House',
  //        address: '2726 Shinn Street, New York',
  //        image: 'assets/images/most-img-4.jpg',
  //        rating: '5',
  //        review: '(31 reviews)'
  //     },
  //     {
  //        badge: 'Now Open',
  //        category: 'Airport',
  //        title: 'Burger House',
  //        address: '1512 Duncan Avenue, New York',
  //        image: 'assets/images/most-img-2.jpg',
  //        rating: '5',
  //        review: '(46 reviews)'
  //     },
  //     {
  //        badge: 'Now Closed',
  //        category: 'Eat & Drink',
  //        title: 'Think Coffee',
  //        address: '215 Terry Lane, New York',
  //        image: 'assets/images/most-img-6.jpg',
  //        rating: '5',
  //        review: '(15 reviews)'
  //     }

  //  ];

  ngAfterViewInit() {}
}
