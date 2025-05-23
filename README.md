<h1 align= "center">CookNify (Restaurant Catalog)</h1>

<div align= "center">

[![Netlify Status](https://api.netlify.com/api/v1/badges/c8ee2906-cd6d-4941-8de8-6adc9f7d05ab/deploy-status?branch=main)](https://app.netlify.com/sites/cooknify/deploys)

</div>

<details open="open">
<summary>Table of Contents</summary>

- [Overview](#overview)
  - [Short Description:](#short-description)
  - [Main Features:](#main-features)
  - [Technology used:](#technology-used)
- [Instructions for use](#instructions-for-use)
  - [Page Navigation:](#page-navigation)
  - [Offline Mode](#offline-mode)
- [Testing](#testing)
  - [Integration Testing:](#integration-testing)
  - [End to End Testing:](#end-to-end-testing)
- [Project assistance](#project-assistance)
- [Contributing](#contributing)
- [Authors \& contributors](#authors--contributors)
- [License](#license)

</details>

## Overview

### Short Description:

The restaurant catalog app that supports offline-first using **Service Worker** and **IndexedDB**. This project uses **MVC** architecture, **JavaScript OOP**, **Clean Code**, and implementation of **Web Component** with **Shadow DOM**.

### Main Features:

- Hash-Based Routing (`/, /favorite, /list-resto, /list-resto/detail/:id, /about`).
- Lazy loading of pages, UI elements, and images.
- Offline-first with Service Worker and IndexedDB.
- Skeleton loader for improve user experience.
- Performance optimization with Webpack module bundler (dynamic import and split chunks).

### Technology used:

- **Web Component** (Custom Elements + Shadow DOM)
- **SCSS**
- **Webpack 5**
- **IndexedDb** (with `idb` third party library)
- **Service Worker**
- **Intersection Observer API**
- **HTML5 & ES Modules**

## Instructions for use

### Page Navigation:

- Home Page (`/`): Displays overview of this app.
- Favorites Page (`/favorite`): Displays restaurants marked as favorites.
- Restaurant Details (`/list-resto`): Displays a list of popular restaurants.
- Restaurant Details (`/list-resto/detail/:id`): Displays complete information about a restaurant.
- About (`/about`): Information about this application.

### Offline Mode

The application continues to function even if there is no internet connection, thanks to caching with **Service Worker** and **IndexedDB**.

## Testing

### Integration Testing:

- Integration testing focuses on testing how various modules or application units work together. It aims to verify the interactions between smaller components.
- Library used: Jest
- Test files are available in the `tests/integration` directory.

### End to End Testing:

- E2E testing focuses on testing the entire flow of the application, making sure it works as expected from the user's perspective.
- Library used: Playwright
- Test files are available in the `tests/e2e` directory.

## Project assistance

If you want to say **thank you** or/and support active development of Cooknify:

Add a [GitHub Star](https://github.com/wahyukmr/CookNify__Catalog-Restaurant) to the project.

## Contributing

First off, thanks for taking the time to contribute! Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make will benefit everybody else and are **greatly appreciated**.

Please read [our contribution guidelines](CONTRIBUTING.md), and thank you for being involved!

## Authors & contributors

The original setup of this repository is by [Wahyukmr](https://github.com/wahyukmr).

For a full list of all authors and contributors, see [the contributors page](https://github.com/wahyukmr/CookNify__Catalog-Restaurant/contributors).

## License

This project is licensed under the **MIT license**.

See [LICENSE](LICENSE) for more information.
