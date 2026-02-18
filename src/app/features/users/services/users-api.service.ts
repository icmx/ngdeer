import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestWithPath } from '../../../common/types/request-options.type';
import { BASE_URL } from '../../../common/providers/base-url.provider';
import { WithApiUser } from '../types/with-api-user.type';

export type GetProfileByUserIdRequest = RequestWithPath<'userId'>;

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  private _http = inject(HttpClient);

  private _baseUrl = inject(BASE_URL);

  getProfileByUserId({
    path,
  }: GetProfileByUserIdRequest): Observable<WithApiUser> {
    return this._http.get<WithApiUser>(
      `${this._baseUrl}/profile/${path.userId}`,
    );
  }
}
