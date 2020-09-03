import { Injectable } from '@angular/core';
import BaseFirestoreService from './base.service';
import { Posting } from '../models/posting';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';
import haversine from 'haversine-distance';

@Injectable({
  providedIn: 'root',
})
export class PostService extends BaseFirestoreService<Posting> {
  constructor(protected firestore: AngularFirestore, protected formBuilder: FormBuilder) {
    super(firestore, 'postings', formBuilder);
  }

  getPosts() {
    return this.getAll();
  }

  getUserPosts(userId: string) {
    return this.getByAttribute('user.uid', '==', userId);
  }

  createPost(post: Posting, id: string) {
    return this.create(post, id);
  }

  updatePost(id: string, post: Partial<Posting>) {
    return this.update(id, post);
  }

  async distanceFromUser(coords: { lat: any; lng: any }) {
    if (coords.lat && coords.lng) {
      const position = await this.getLocation();
      if (position && position.coords && position.coords.latitude && position.coords.longitude) {
        const distanceInMeters = this.getDistance(
          { latitude: position.coords.latitude, longitude: position.coords.longitude },
          { latitude: coords.lat, longitude: coords.lng }
        );
        const milesAway = Math.round(this.metersToMiles(distanceInMeters));
        return milesAway + ' miles away';
      }
    }
    return 'Location unknown';
  }

  getLocation(): Promise<Position> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position);
          },
          (err) => {
            resolve();
          }
        );
      }
    });
  }

  metersToMiles(meters: number) {
    return meters * 0.00062137;
  }

  /**
   * Gets the haversine distance between coordinates
   * @param start
   * @param end
   */
  getDistance(start: { latitude: number; longitude: number }, end: { latitude: number; longitude: number }): number {
    return haversine(start, end);
  }
}
