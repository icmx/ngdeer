import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsCacheService {
  private _records = new Map<Post['id'], Post>();

  add(...entries: Post[]): void {
    entries.forEach((entry) => {
      this._records.set(entry.id, entry);
    });
  }

  get(postId: string): Post | undefined {
    return this._records.get(postId);
  }
}
