# Contributing to Digital Student Registration

Thanks for your interest in contributing! This document explains how to get a
development environment running, the conventions we follow, and how to get your
changes merged.

By participating you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).
Report violations to <roehlevalentin@gmail.com>.

---

## Prerequisites

| Tool    | Version    | Notes                          |
| ------- | ---------- | ------------------------------ |
| Node.js | `v22.20.0` | Pinned in [`.nvmrc`](./.nvmrc) |
| Yarn    | `1.22.22`  | Classic (v1) — not Berry       |
| MongoDB | `7.0+`     | Local install or via Docker    |
| Git     | Latest     |                                |

Alternatively, everything runs in containers — see the Docker path below.

## Quick start

```bash
# 1. Install dependencies (also wires up the git hooks via husky)
yarn install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local — at minimum set MONGODB_URI and NEXTAUTH_SECRET

# 3. Run the dev server (HTTPS, Turbopack)
yarn dev                 # → https://localhost:3000
```

Prefer containers? Spin up the whole stack with zero local config:

```bash
docker compose up -d     # → https://localhost:3000
```

See [`docs/development/SETUP.md`](./docs/development/SETUP.md) for the full setup
guide (MongoDB, SSL certificates, VS Code config) and
[`QUICK-START.md`](./QUICK-START.md) for the Docker testing walkthrough.

## Before you open a pull request

Run the same checks CI runs. All four must pass:

```bash
yarn test:ts        # TypeScript type check (tsc --noEmit)
yarn lint           # ESLint
yarn test:unit      # Vitest unit + integration tests with coverage
yarn format:check   # Prettier formatting check
```

The git hooks installed by husky run a fast subset automatically (see
[Git hooks](#git-hooks) below), but running the full set yourself before pushing
avoids round-trips with CI.

---

## Git workflow

**Base branch:** `main`. Feature work also targets `develop` where it exists.

**Branch naming.** Branches must start with one of the allowed type prefixes
followed by a short topic. This is enforced by the `pre-push` hook:

```text
feature/student-export
bugfix/class-count-off-by-one
docs/contributing-guide
```

Allowed prefixes: `feature`, `bugfix`, `patch`, `docs`, `test`, `ci`, `revert`,
`release`, `hotfix`. (`main`, `develop`, and `dependabot/*` are also allowed.)

Rebase onto the latest base branch before opening a PR; avoid merge commits on
feature branches.

## Commit messages

All commits follow [Conventional Commits 1.0](https://www.conventionalcommits.org/en/v1.0.0/).
The `commit-msg` hook runs `commitlint` and rejects non-conforming messages.

**Format:** `<type>(<optional scope>): <summary>`

```text
feature: add student export to Excel
bugfix(classes): correct student count after deletion
docs: document the docker quick-start flow
```

**Allowed types:** `feature`, `bugfix`, `patch`, `docs`, `test`, `ci`,
`revert`, `release`, `hotfix`.

**Breaking changes:** append `!` to the type (`feature!: …`) and add a
`BREAKING CHANGE:` footer in the commit body.

> **Never** use `--no-verify` or `--force` to bypass hooks or rewrite shared
> history. The bypass exists only for genuine WIP-on-your-own-branch emergencies.

## Pull requests

1. Fill out the [PR template](./.github/PULL_REQUEST_TEMPLATE.md) — summary,
   test plan, screenshots for UI changes, linked issues.
2. Keep PRs focused — one concern per PR. Split unrelated changes.
3. Make sure CI is green before requesting review.
4. Respond to review feedback with new commits (no force-pushes during review).
5. PRs are squash-merged; keep the PR title Conventional-Commits-compliant.

---

## Project conventions

### Internationalization

The UI is bilingual (English & German). Every user-visible string must go
through `t()` and be added to **both** locale files:

- [`src/locales/en.json`](./src/locales/en.json)
- [`src/locales/de.json`](./src/locales/de.json)

### Testing

We use Vitest with React Testing Library and MSW. Add or update tests when you
change behavior. Tests live under [`tests/`](./tests/) (`unit/`, `integration/`).
See [`docs/development/TESTING.md`](./docs/development/TESTING.md).

### Code style

ESLint + Prettier enforce style; `lint-staged` formats staged files on commit.
An [`.editorconfig`](./.editorconfig) keeps editors consistent. Don't hand-format
against the tools.

## Git hooks

`yarn install` runs `husky` and activates the hooks in [`.husky/`](./.husky):

| Hook         | What it does                                                |
| ------------ | ----------------------------------------------------------- |
| `pre-commit` | `lint-staged` (formats/lints staged files) + `yarn test:ts` |
| `commit-msg` | `commitlint` — enforces Conventional Commits                |
| `pre-push`   | Validates the branch name against the allowed pattern       |

## Reporting issues

- **Bugs / features:** use the [issue templates](./.github/ISSUE_TEMPLATE).
- **Security vulnerabilities:** do **not** open a public issue — follow
  [`SECURITY.md`](./SECURITY.md).

## License

By contributing, you agree that your contributions are licensed under the
[MIT License](./LICENSE).
