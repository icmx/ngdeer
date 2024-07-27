import { Injectable, Provider } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

export const BASE_TITLE = 'ngdeer';

@Injectable()
export class BaseTitleStrategy extends TitleStrategy {
  constructor(private _title: Title) {
    super();
  }

  override updateTitle(routerStateSnapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(routerStateSnapshot);

    if (title) {
      this._title.setTitle(`${title} - ${BASE_TITLE}`);
    } else {
      this._title.setTitle(BASE_TITLE);
    }
  }
}

export const provideBaseTitle = (): Provider => {
  return {
    provide: TitleStrategy,
    useClass: BaseTitleStrategy,
    deps: [Title],
  };
};
