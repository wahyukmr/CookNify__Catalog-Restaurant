# 📌 Contribution Guide

Thank you for your interest in contributing to this project! This guide outlines the steps for developers who want to add new features, fix bugs, or make improvements.

## 🔖 Table of Contents

- [📌 Contribution Guide](#-contribution-guide)
  - [🔖 Table of Contents](#-table-of-contents)
  - [✅ Requirements](#-requirements)
  - [🔧 Setting Up the Development Environment](#-setting-up-the-development-environment)
  - [🌿 Branching Strategy](#-branching-strategy)
  - [🚀 Developing and Making Changes](#-developing-and-making-changes)
  - [🧪 Testing and Validation](#-testing-and-validation)
  - [🔀 Submitting a Pull Request](#-submitting-a-pull-request)
  - [🎯 Conclusion](#-conclusion)

## ✅ Requirements

Before you start contributing, ensure you have the following installed:

- **Node.js** (Latest LTS version)
- **npm** or **yarn**
- **Git**
- **Playwright** (for E2E testing, if required)

Make sure you have access to this repository.

## 🔧 Setting Up the Development Environment

1. **Fork and Clone the Repository**
   ```sh
   git clone https://github.com/wahyukmr/CookNify__Catalog-Restaurant.git
   cd CookNify__Catalog-Restaurant
   ```
2. **Install Dependencies**
   ```sh
   npm ci
   ```
3. **Set Up Environment Variables**
   Create a `.env` file in the root directory and configure it as required.
4. **Create a New Branch for Your Changes**
   ```sh
   git checkout -b your-branch-name
   ```

## 🌿 Branching Strategy

We use a GitFlow-inspired branching strategy:

- `main` → Production branch, always stable.
- `dev` → Development branch, used for feature integration.
- `your-branch-name` → Your branch, used to apply the changes you make.

## 🚀 Developing and Making Changes

1. **Write code following project standards**
2. **Ensure there are no errors by running linting**
   ```sh
   npm run lint
   ```
3. **Commit changes with clear messages**

   ```sh
   git add .
   git commit -m "your-commit-message"
   ```

   > We follow [Conventional Commits](https://www.conventionalcommits.org/):
   >
   > - `feat:` → A new feature
   > - `fix:` → A bug fix
   > - `docs:` → Documentation updates
   > - `refactor:` → Code refactoring (no feature change)
   > - `test:` → Adding or updating tests
   >
   > Example:
   >
   > ```bash
   > git commit -m "feat: add user authentication"
   > ```

4. **Push to the remote repository**
   ```sh
   git push origin your-branch-name
   ```

## 🧪 Testing and Validation

1. **Run unit tests (if applicable)**
   ```sh
   npm run test
   ```
2. **Run Playwright for E2E testing (if applicable)**
   ```sh
   npm run e2e
   ```
3. **Ensure all tests pass before submitting a PR**

## 🔀 Submitting a Pull Request

1. **Open a Pull Request (PR) to `dev` branch.**

   - Ensure tests and linting pass before requesting a review.
   - Wait for approval before merging.

2. **Merging to `main` branch.**

   - Only maintainers can merge `dev` into `main`.
   - Upon merging, deployment to Netlify is triggered automatically.

## 🎯 Conclusion

By following this guide, we can maintain code quality and ensure a smooth development process. If you have any questions, feel free to open an issue or contact the project maintainers. Happy coding! 🚀
