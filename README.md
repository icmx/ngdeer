# ngdeer [![Netlify Status](https://api.netlify.com/api/v1/badges/10f5c8ff-868b-4127-9a5d-3732e1ac3283/deploy-status)](https://ngdeer.netlify.app/)

Client application for [ideer.ru](https://ideer.ru/), a "social entertaining project" of sharing personal secrets and revelations anonymously.

**[Check it here](https://ngdeer.netlify.app/)** — full-featured live demo, deployed on Netlify

## Features

- Nearly-classic experience as in original app:
  - Latest stories
  - Random stories
  - Stories by category
  - Advanced search for stories
  - Comments
- Distraction-free: just the content, no ratings, no likes, no reactions, no extra involving patterns
- Control your content:
  - Hide comments from unwanted users

## Technical

- Built with [Angular 21](https://angular.dev/)
- No extra dependencies (see [package.json](./package.json))
- Uses official ideer API
- URL-driven state for search screen (see [example](https://ngdeer.netlify.app/search?text=%D0%BA%D0%BE%D1%82%D1%8B&categoryId=12))
- Infinite scroll loading for stories and comments pages
- Responsive design
- Light and dark themes with auto-switch

## Development

```sh
# clone repository
git clone https://github.com/icmx/ngdeer && cd ngdeer

# install dependencies
npm install

# serve for local development
# available at localhost:4200
ng serve

# build in case you need to
ng build
```

Note: this project is built with [Angular CLI](https://angular.dev/tools/cli) and supports standard code scaffolding like `ng g c` and so on.

## License

[MIT](./LICENSE).

Original stories belong to [ideer.ru](https://ideer.ru/) owners as stated in [agreement](https://ideer.ru/info/agreement).

[😈 devilhorns](https://github.com/mozilla/fxemoji/blob/270af343bee346d8221f87806d2b1eee0438431a/svgs/FirefoxEmoji/u1F608-devilhorns.svg) emoji favicon image is made by Mozilla.
