import { Injectable } from "@angular/core";
import BaseFirestoreService from "./base.service";
import { Posting } from "../models/posting";
import { AngularFirestore } from "@angular/fire/firestore";
import { FormBuilder } from "@angular/forms";


@Injectable({
  providedIn: 'root'
})
export class PostService extends BaseFirestoreService<Posting> {
  constructor(protected firestore: AngularFirestore, protected formBuilder: FormBuilder) {
    super(firestore, 'postings', formBuilder);
  }

  getPosts() {
    return this.getAll();
  }

  createPost(post: Posting, id: string) {
    return this.create(post, id);
  }

  updatePost(id: string, post: Partial<Posting>) {
    return this.update(id, post);
  }
}