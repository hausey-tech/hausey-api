# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Hausey API is a Node.js/TypeScript REST API for a telehealth-style platform connecting patients, professionals, secretaries, and teams — handling appointments, prescriptions, medical records, messaging, and subscription-based plans (including a family-plan/dependents feature). Package manager is **yarn**.

## Commands

```bash
yarn                      # install dependencies
yarn dev:server            # run dev server (ts-node-dev, hot reload, --inspect)
yarn dev:docker            # start local Postgres via docker-compose
yarn build                 # tsc compile to dist/
yarn start                 # run compiled server (dist/shared/server.js)

# migrations (TypeORM, data source at ./src/shared/typeorm)
yarn migration:run
yarn migration:revert
yarn name='migration-name' yarn migration:generate   # generate from entity diffs
yarn typeorm migration:create ./src/shared/typeorm/migrations/<name>  # empty migration
```

There is no test suite configured in this repo (no test script/framework present).

Linting: ESLint (airbnb-base + typescript-eslint + prettier) runs automatically on staged `*.ts` files via husky pre-commit + lint-staged (`eslint 'src/**' --fix`). Run manually with `npx eslint 'src/**'`.

Local dev requires a Postgres DB (e.g. via `yarn dev:docker`) and a `.env` file (`DATABASE_URL`, JWT secret, etc. — see `src/config/auth.ts` and `src/shared/typeorm/index.ts`).

## Architecture

### Module structure

Code lives under `src/modules/<domain>/`, each following the same internal layout (not every module has every folder):

- `entities/` — TypeORM entities (snake_case columns via `SnakeNamingStrategy`)
- `contracts/` — interfaces: `repositories/` (repo interfaces, e.g. `IPatientsRepository`) and `dtos/`
- `repositories/` — TypeORM repository implementations of the contracts
- `services/` — one class per use case, named like `create-patient.ts` exporting `CreatePatientService`, with a single `execute()` method. This is where business logic lives.
- `controllers/` — thin Express handlers; resolve a service from the tsyringe container, call `execute`, return JSON
- `routes/` — Express `Router` wiring paths to controller methods, with `ensureAuthentication`/`personalizatedAuthentication` middleware and `celebrate` validation schemas
- `celebrate-schemas/` — Joi validation schemas used by routes

Modules commonly depend on each other directly (e.g. `patients` services import from `integrations`, `professionals`, `appointments`) — there is no strict module isolation.

### Dependency injection

Uses `tsyringe`. All repository interfaces are bound to implementations in `src/shared/container/index.ts` via `container.registerSingleton<IFooRepository>('FooRepository', FooRepository)`. Services are `@injectable()` and receive repositories via `@inject('FooRepository')` in their constructor. Controllers resolve services on-demand with `container.resolve(SomeService)` rather than being injected themselves. A pino `Logger` instance is also registered in the container.

### Request lifecycle

`src/shared/server.ts` bootstraps: loads `reflect-metadata` and `express-async-errors`, imports `./container` (populates DI bindings), initializes `PostgresDataSource`, then runs `setupSwagger` → `setupMiddlewares` → `setupRoutes` → `setupErrorHandler` (see `src/shared/utils/`).

All routes are mounted under `/v1` (`src/shared/utils/setup-routes.ts`), with the full route table assembled in `src/shared/routes/index.ts`. Stripe webhook routes are mounted **before** the global `express.json()` body parser (needs raw body for signature verification); other integration routes are mounted after.

Auth middleware (`src/shared/middlewares/ensure-authentication.ts`) supports two mutually exclusive schemes on a single route: a JWT bearer token (decoded to `{ id, role }`, role is `'patient' | 'professional' | 'manager'`, attached to `request.user`) OR a static `api-key` header. A separate `personalizatedAuthentication` middleware checks a fixed `BMX_TOKEN` bearer value for specific integration routes.

### Error handling

Throw `AppError(message, statusCode?)` (default 400) from anywhere in services/controllers — it's caught centrally by `src/shared/errors/error-handler.ts`, which also has special handling for celebrate/Joi validation errors, multer upload errors, and TypeORM `QueryFailedError`. Unhandled errors fall through to a generic 500 and are persisted via `CreateErrorService` (the `errors` module logs internal errors to the DB).

### Payments / subscriptions domain

This is the most complex cross-cutting flow — see `readme.md` and `docs/subscription-flow-map.md` before changing plan/payment logic:

- **BR region**: Pagarme. Customer created in Pagarme, checkout happens on a separate web app, subscriptions/orders created via Pagarme, payment confirmation arrives via webhook and updates `expiresAt`. Seller/referral split logic applies if the patient is linked to a seller code.
- **US/EU region**: Stripe. Customer + Stripe Checkout, webhook updates `expiresAt`, then seller split transfers are created if applicable.
- **Sellers (vendedores/representantes)**: registered via the admin portal; BR sellers get a Pagarme `recipient`, US/EU sellers get a Stripe connected account.
- Integration-specific code (Pagarme, Stripe, Twilio, Memed, S3, SurveyMonkey, video SDK) lives in `src/modules/integrations/services/<provider>/`.
- **Family plan / dependents**: `src/modules/dependents/` plus `plans.plan_type`/`plans.max_dependents` columns. A holder `Patient` owns the plan; dependents inherit `expiresAt` from the holder and lose access when the holder's plan lapses. See `docs/family-plan-implementation.md` for the full design (plan types `individual`/`family_1`/`family_2`, invite-token flow for dependents with app access vs. holder-managed dependents without one).

### Deployment

CodeDeploy-based: `appspec.yml` + `scripts/install_dependencies.sh` / `start_service.sh` / `stop_service.sh`, running as `web: node dist/shared/server.js` (`Procfile`). Pushes to `develop` auto-deploy to the test API; pushes to `master` deploy to production via a manual CodePipeline step.
