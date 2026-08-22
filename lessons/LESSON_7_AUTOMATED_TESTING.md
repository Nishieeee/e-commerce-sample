# Phase 7: Automated Testing (The Safety Net)

We have already touched on testing by writing `AuthFeatureTest`, but in an enterprise environment, tests are not optional. You cannot deploy to production if the test suite fails.

## The Testing Pyramid

### 1. Unit Tests (`Tests\Unit`)
Unit tests test a single, isolated piece of code. They do not boot the Laravel framework, and they do not hit the database. Because of this, they execute in milliseconds. You can run 5,000 unit tests in 2 seconds.
- **Example:** Testing that a helper function correctly calculates 20% VAT on a given integer.

### 2. Feature Tests (`Tests\Feature`)
Feature tests boot the entire Laravel framework and use an in-memory SQLite database (or a dedicated testing database). They simulate a real HTTP request hitting your API.
- **Example:** Testing that a `POST /checkout` request correctly deducts inventory, creates an order, and returns a 201 status code.

## Continuous Integration (CI)
In a real team, you configure GitHub Actions or GitLab CI. Whenever a developer opens a Pull Request, the CI server automatically boots up a container, installs dependencies, and runs `php artisan test`.

If a single test fails, the "Merge" button turns red and the developer is blocked from deploying their broken code.

### Senior Best Practices:
1. **RefreshDatabase:** Always use the `RefreshDatabase` trait in Feature tests so the database is wiped clean before every single test. This prevents state from leaking between tests.
2. **Factories:** Use Model Factories (`User::factory()->create()`) to easily mock up data instead of writing raw SQL inserts.
3. **Mocking:** If your code hits an external API (like Stripe), you must **mock** it during tests. You never want your automated tests actually hitting the real Stripe API and causing real charges.

---

## Final Project Assignment
By the end of this project, you will have a comprehensive test suite covering the full checkout flow (Cart -> Inventory Lock -> Order Creation -> Job Dispatch). We will achieve at least 80% code coverage.
