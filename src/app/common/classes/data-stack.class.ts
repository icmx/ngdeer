export class DataStack<T> {
  private _items: T[] = [];

  private _tags = new Set<string>();

  hasItems(): boolean {
    return this._items.length > 0;
  }

  getItems(): T[] {
    return [...this._items];
  }

  setItems(items: T[] | ((items: T[]) => T[])): DataStack<T> {
    if (Array.isArray(items)) {
      this._items = [...items];

      return this;
    }

    if (typeof items === 'function') {
      this._items = [...items(this._items)];

      return this;
    }

    throw new Error('Wrong "items" argument: expected array or function');
  }

  addTag(tag: unknown): DataStack<T> {
    const value = DataStack.getTagValue(tag);

    this._tags.add(value);

    return this;
  }

  hasTag(tag: unknown): boolean {
    const value = DataStack.getTagValue(tag);

    return this._tags.has(value);
  }

  clear(): void {
    this.setItems([]);
    this._tags.clear();
  }

  static getTagValue(tag: unknown): string {
    try {
      return JSON.stringify(tag);
    } catch {
      return '{}';
    }
  }
}
