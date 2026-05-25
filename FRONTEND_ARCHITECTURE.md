# Frontend Architecture (Next.js App Router)

## Folder Strategy

- `src/app`: Route ownership, segment layouts, and page entrypoints.
- `src/features`: Domain modules (auth, student, tpo) with page-specific UI and logic.
- `src/shared`: Cross-feature providers, config, and generic shared UI.
- `src/services`: API client and integration layer (to connect real backend next).
- `src/components/ui`: Design-system components (shadcn/radix).

## Route Groups

- `(auth)`: `/login`, `/register`
- `(student)`: `/student/*`
- `(tpo)`: `/tpo/*`

This isolates role-specific layout and avoids coupling between student and TPO UX.

## Current Migration Status

- Migrated to Next app router structure.
- Implemented modular auth pages and role-based shells.
- Implemented student home and TPO dashboard as feature pages.
- Scaffolded remaining pages with clear module ownership for incremental migration.

## Engineering Practices

- Keep business logic in `src/features/<domain>/services` and `src/services`.
- Keep app routes thin; route files should compose feature modules only.
- Use shared route constants from `src/shared/config/routes.ts`.
- Avoid cross-feature imports except through `shared`.
- Add tests per feature module (`__tests__` colocated with domain).

## Next Backend Integration (Next Step)

- Add server actions / route handlers under `src/app/api`.
- Move localStorage mock auth/state to backend-integrated services.
- Add typed DTOs and schema validation at service boundaries.
