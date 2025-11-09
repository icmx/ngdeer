import { inject, Injectable, InjectionToken } from '@angular/core';
import { Persistence } from '../../../common/classes/persistence.class';

export const HIDDEN_USERS_IDS_PERSISTENCE = new InjectionToken<
  Persistence<string[]>
>('HIDDEN_USERS_IDS_PERSISTENCE', {
  factory: (): Persistence<string[]> => {
    return new Persistence({
      key: 'ngdeer:hiddenUsersIds',
      initialValue: [],
    });
  },
});

@Injectable()
export class HiddenUsersIdsService {
  private _persistence = inject(HIDDEN_USERS_IDS_PERSISTENCE);

  ids = this._persistence.value;

  add(id: string): void {
    this._persistence.updateValue((ids) => [...ids, id]);
  }

  remove(id: string): void {
    this._persistence.updateValue((ids) =>
      ids.filter((prevId) => prevId !== id),
    );
  }
}
