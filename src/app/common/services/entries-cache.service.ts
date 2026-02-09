import { Injectable } from '@angular/core';

export type Entry = {
  id: string;
};

@Injectable()
export class EntriesCacheService<T extends Entry> {
  private _entries = new Map<string, T>();

  add(...entries: T[]): void {
    entries.forEach((entry) => {
      this._entries.set(entry.id, entry);
    });
  }

  get(id: string): T | null {
    return this._entries.get(id) || null;
  }
}
