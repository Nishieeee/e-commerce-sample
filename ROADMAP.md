# Backend Engineering Roadmap: NexusCommerce MVP

Welcome to the team. As your Senior Developer, my goal is to ensure you don't just write code that "works," but code that is scalable, maintainable, and enterprise-ready. I will not sugarcoat my code reviews—if your controllers are bloated or your queries are causing N+1 issues, I will call it out and expect you to refactor it. 

We will follow this strict workflow for every feature:
1. **You Code**: You take a stab at implementing the feature based on the requirements.
2. **I Review**: I critique your architecture, security, and performance.
3. **We Test**: We ensure unit/feature tests pass and edge cases are handled.
4. **We Push**: Only when the code meets standard.

Since you cannot run Docker locally, we will simulate and configure infrastructure like Redis, Queues, and Load Balancing directly on your local environment or through conceptual architecture designs.

Here is the roadmap we will follow to build this backend like a real-world engineering team.

---

## Phase 1: Foundation, Security, and Auth (The Gatekeeper)
*Before we scale, we must secure the perimeter.*
- [x] **Step 1: Models & Relationships Deep Dive**
  - Setting up strict Eloquent models, mass-assignment protection, and defining the ERD relationships (One-to-Many, Many-to-Many).
- [x] **Step 2: API Authentication (Laravel Sanctum)**
  - Implementing stateful/stateless authentication.
  - Issuing and revoking Bearer tokens.
- [ ] **Step 3: Role-Based Access Control (RBAC)**
  - Creating middleware and Gates/Policies to separate Customer actions from Admin actions.
- [ ] **Step 4: Strict Request Validation**
  - Moving validation out of controllers and into Form Request classes. Custom error messaging.

## Phase 2: Architectural Patterns (Scaling the Codebase)
*If we put everything in controllers, the app will become a nightmare to maintain. We need structure.*
- [x] **Step 1: The Service Pattern**
  - Extracting business logic (like Checkout or Cart management) into dedicated Service classes. 
- [x] **Step 2: API Resources (Transformers)**
  - Normalizing JSON responses. Never return raw database models to the client; always format them through Resource classes to hide sensitive data and control payload size.
- [x] **Step 3: Data Transfer Objects (DTOs)** (Bonus)
  - Passing structured, typed data into services instead of raw arrays or HTTP Request objects.

## Phase 3: Database Optimization & Concurrency (Scaling Data)
*E-commerce platforms live and die by their database performance and accuracy.*
- [ ] **Step 1: Eradicating the N+1 Problem**
  - Enforcing Laravel's Strict Mode. Using Eager Loading to optimize relations (e.g., loading products with their images efficiently).
- [ ] **Step 2: Atomic Transactions & Locking**
  - Implementing Pessimistic Locking (`lockForUpdate()`) during checkout to ensure we **never** oversell inventory when two people buy the last hoodie at the exact same millisecond.
- [ ] **Step 3: Database Indexing**
  - Analyzing slow queries and adding composite indexes for heavy filtering routes.

## Phase 4: Caching & Traffic Management (Scaling Traffic)
*Hitting the database for every catalog request is too slow. We need memory-based storage.*
- [ ] **Step 1: Redis Configuration**
  - Installing and connecting Redis locally as our primary cache and queue driver.
- [ ] **Step 2: Catalog Caching & Invalidation**
  - Caching the main product catalog. 
  - Designing a cache invalidation strategy (e.g., clearing the cache automatically when an Admin updates a product price using Eloquent Observers).
- [ ] **Step 3: Rate Limiting & API Throttling**
  - Protecting auth endpoints from brute-force attacks and throttling heavy data endpoints.

## Phase 5: Asynchronous Processing (Scaling Time)
*Never make the user wait for something that can happen in the background.*
- [ ] **Step 1: Laravel Queues & Workers**
  - Setting up Redis queues and running local queue workers.
- [ ] **Step 2: Background Jobs**
  - Offloading tasks like sending "Order Confirmation" emails or generating PDF invoices to the background.
- [ ] **Step 3: Scheduled Tasks (Cron Jobs)**
  - Automatically clearing out abandoned shopping carts every 24 hours using Laravel Task Scheduling.

## Phase 6: Enterprise Concepts & Event-Driven Design
*Taking it to the next level.*
- [ ] **Step 1: Event-Driven Architecture**
  - Firing an `OrderPlaced` event and having decoupled Listeners handle inventory reduction, notifications, and analytics.
- [ ] **Step 2: Mocking & Third-Party Integrations**
  - Implementing a mock Payment Gateway (Stripe-like) using interfaces so we can swap it out easily later without breaking the app.
- [ ] **Step 3: Load Balancing Concepts**
  - Since we can't use Docker, we will conceptually map out how an Nginx Load Balancer distributes traffic to multiple Laravel instances, and why centralized sessions (Redis) and centralized storage (S3) become mandatory.

## Phase 7: Automated Testing (The Safety Net)
*Untested code is broken code.*
- [ ] **Step 1: Feature Testing**
  - Writing tests for the critical path: Auth, Cart, and Checkout.
- [ ] **Step 2: Edge-Case Testing**
  - Writing tests that intentionally try to break the concurrency (e.g., forcing a checkout race condition) to prove our pessimistic locks work.

---
**Your First Assignment:**
We start at Phase 1, Step 1.
Your task is to implement the Eloquent Models for `User`, `Product`, `Category`, and `Order`. I want to see the relationships defined properly (e.g. `$user->orders()`), and I want you to make sure mass-assignment vulnerabilities are closed off (using `$fillable` or `$guarded`).

Let me know when you are ready to write the code for this, or if you want to push a first draft for me to review!
