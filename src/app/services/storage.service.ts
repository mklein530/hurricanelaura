import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

const storageUrl = 'laura-dcbcf.appspot.com';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(protected storage: AngularFireStorage) {}

  get posts() {
    return 'posts/';
  }

  get users() {
    return 'users/';
  }

  uploadUserImage(image: any, userId: string, fileName: string, metadata: firebase.storage.UploadMetadata = {}) {
    return this.storage.ref(this.users + userId + '/' + fileName).put(image, { cacheControl: 'public, max-age=31536000', ...metadata });
  }

  uploadPostImage(image: any, postId: string, fileName: string, metadata: firebase.storage.UploadMetadata = {}) {
    return this.storage.ref(this.posts + postId + '/' + fileName).put(image, { cacheControl: 'public, max-age=31536000', ...metadata });
  }

  getPostImages(postId: string) {
    return this.storage.ref(this.posts + postId).listAll();
  }

  async uploadPostImages(images: { fileName: string; image: any }[], postId: string) {
    const results = images.map((image) => this.uploadPostImage(image.image, postId, image.fileName));
    const urls: Promise<string>[] = [];
    for (const result of results) {
      const url = result.then((task) => {
        return task.ref.getDownloadURL() as Promise<string>;
      });
      urls.push(url);
    }
    return Promise.all(urls);
  }
}
