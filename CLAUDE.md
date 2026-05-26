# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

NestJS 11 REST API backing a flag quiz application. Persists `Flag` entities (country + ISO code + optional description) in PostgreSQL via TypeORM and serves them with a `flagUrl` derived at response time from `https://flagcdn.com`.

## Commands

```bash
npm run start:dev           # watch-mode dev server (port 3000, override with $PORT)
npm run start               # one-shot run
npm run start:prod          # run compiled output from dist/
npm run build               # nest build → dist/

npm test                    # jest unit tests (src/**/*.spec.ts)
npm test -- flags.service   # run a single suite by name pattern
npm run test:cov            # with coverage
npm run test:e2e            # uses test/jest-e2e.json (*.e2e-spec.ts)

npm run lint                # eslint --fix
npm run format              # prettier write
```

A running PostgreSQL is required for the app to boot (TypeORM connects eagerly in `AppModule`). Connection settings come from `.env` (`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`) loaded by `@nestjs/config`.

## Architecture

- `src/main.ts` bootstraps the Nest app and registers a global `ValidationPipe` with `whitelist: true` and `forbidNonWhitelisted: true`, so unknown fields in request bodies are rejected.
- `src/app.module.ts` wires `ConfigModule.forRoot({ isGlobal: true })` and configures `TypeOrmModule.forRootAsync` with `synchronize: true` and `autoLoadEntities: true`. Schema is auto-synced from entities on every boot — fine for local dev, but do not enable in production; introduce migrations before deploying.
- Feature modules follow the standard Nest CLI layout (`flags/` = `controller` + `service` + `module` + `entities/` + `dto/` + `models/`). New domains should mirror this and register their repository via `TypeOrmModule.forFeature([...])` in the feature module.
- `FlagsService` does not store the flag image URL. It builds `flagUrl` from `countryCode` at read time (`getFlagUrlByCountryCode`) and returns a `FlagModel` (in `flags/models/`) that decorates the entity. Keep derived fields out of the entity/DB and compose them in the service's response mapping.
- `Flag.countryCode` carries a unique constraint; `FlagsService.create` catches Postgres `23505` violations and surfaces them as `409 Conflict`.
