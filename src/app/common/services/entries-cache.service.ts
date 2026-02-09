import { Injectable } from '@angular/core';

export type Entry = {
  id: string;
};

@Injectable()
export class EntriesCacheService<T extends Entry> {
  private _entries = new Map<string, T>();

  /**
   * Sets one or multiple entries my using their ids. Existing ids will
   * be over-written.
   */
  set(...entries: T[]): void {
    entries.forEach((entry) => {
      this._entries.set(entry.id, entry);
    });
  }

  /**
   * Get existing entry by id or null.
   */
  get(id: string): T | null {
    return this._entries.get(id) || null;
  }
}
