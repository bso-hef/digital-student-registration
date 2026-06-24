# Roadmap

This is a living document describing the planned direction of **Digital Student
Registration**. It is grounded in the current state of the codebase as of
**v2.1.0** — items below reference real gaps and scaffolding that already exist
in the repository. Priorities may change; nothing here is a delivery commitment.

To propose a change, open a [feature request](./.github/ISSUE_TEMPLATE/feature_request.yml)
or start a [discussion](https://github.com/bso-hef/digital-student-registration/discussions).
See [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a PR.

## Guiding principles

- **Student data is sensitive.** Privacy, auditability, and least-privilege
  access come before feature breadth.
- **Bilingual by default.** Every user-facing change ships in both English and
  German (`src/locales/en.json`, `src/locales/de.json`).
- **Deployable by a school's own IT.** The Docker path must stay simple; no
  managed-cloud dependency should become mandatory.

---

## Now — in progress

- **Contributor readiness.** Community health files, issue/PR templates, and
  git hooks (husky + commitlint + lint-staged) are in place. Remaining: align CI
  with the new `format:check` script and document the workflow. _(This work.)_
- **Documentation accuracy.** Auditing all docs in `docs/` and the root
  Markdown files against the actual code so they are factually correct.

## Next — near term

- **Re-enable integration tests.** The `tests/integration/` suite is currently
  excluded in `vitest.config.ts` due to unresolved `@/` path-alias resolution in
  the node test environment. Fix the alias/setup so integration tests run in CI
  again.
- **Stabilize coverage gates.** Coverage currently sits at roughly **28%** of
  statements; the `autoUpdate` thresholds in `vitest.config.ts` can leave a plain
  `vitest run` failing its own gate. Decide on a deliberate threshold policy and
  raise coverage on the weakest areas first — `src/utils/pdf.utils.tsx` (≈0%) and
  `src/utils/qr.utils.ts` (≈23%).
- **End-to-end tests.** There is currently **no** E2E suite (despite earlier doc
  mentions of Playwright). Introduce a real E2E setup covering the critical
  flows: first-run setup wizard, login, class/student management, and the student
  onboarding wizard.
- **Migrate off `next lint`.** `next lint` is deprecated and slated for removal
  in a future Next.js major. Move the `lint` script to the ESLint CLI using the
  existing flat config (`eslint.config.mjs`), and consider adding `commitlint` to
  CI.
- **Complete audit logging.** Wire the remaining audit events — e.g. password
  reset is flagged as not-yet-logged in
  `src/app/api/auth/reset-password/route.ts`.

## Later — exploratory

- **Real-time features.** The `socket.io-client` dependency is present but not
  yet wired into the app. Candidate uses: live dashboard statistics and
  push notifications for onboarding progress.
- **Onboarding polish.** Step transition animations are stubbed
  (`src/components/organisms/DynamicPageStepper`); smoother UX and resumable
  drafts across devices.
- **Reporting & exports.** Build on the existing PDF/Excel/CSV export to offer
  configurable report templates per school year.
- **Bulk import.** Streamline importing students at the start of a school year
  (the `Student.status: "imported"` state already anticipates this).

---

## Known gaps & technical debt

These are verified against the current codebase, not aspirational:

| Area              | Gap                                                   | Reference                                  |
| ----------------- | ----------------------------------------------------- | ------------------------------------------ |
| Integration tests | Disabled in the Vitest config (alias resolution)      | `vitest.config.ts`                         |
| E2E tests         | None exist                                            | —                                          |
| Coverage          | ~28% statements; self-failing `autoUpdate` thresholds | `vitest.config.ts`                         |
| Real-time         | `socket.io-client` declared but unused                | `package.json`                             |
| Linting           | Uses deprecated `next lint`                           | `package.json`                             |
| Audit log         | Password reset not yet audited                        | `src/app/api/auth/reset-password/route.ts` |

---

_Have a use case we're missing? Open a discussion — roadmaps are better with
input from the schools actually using this._
