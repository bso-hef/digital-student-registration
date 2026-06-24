# Security Policy

## Supported Versions

Only the latest released minor version receives security updates. Older versions
are not supported — please upgrade before reporting.

| Version | Supported          |
| ------- | ------------------ |
| 2.1.x   | :white_check_mark: |
| < 2.1   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, use one of the following private channels:

1. **GitHub Security Advisories** (preferred) —
   [open a private advisory](https://github.com/bso-hef/digital-student-registration/security/advisories/new).
2. **Email** — <roehlevalentin@gmail.com>.

Please include as much of the following as you can:

- Affected version(s) and deployment type (Docker, local, Windows container).
- A description of the vulnerability and its impact.
- Step-by-step reproduction instructions, ideally with a proof of concept.
- Any mitigation or workaround you have already identified.

## Response Timeline

- **Acknowledgement** within 5 working days.
- **Initial assessment** within 10 working days.
- For **high / critical** issues we aim for a fix and coordinated disclosure
  within 30 days.
- Lower-severity issues are scheduled into the next regular release.

## Scope

Given this is a student-data application, we are particularly interested in:

- Authentication / session handling flaws (NextAuth, password reset, setup flow).
- Authorization gaps between admin and student roles.
- Exposure of personally identifiable student data (logs, errors, API responses).
- Injection (NoSQL/Mongoose), SSRF, or path-traversal issues.
- Insecure handling of secrets or environment configuration.

### Out of scope

- Vulnerabilities in upstream dependencies that already have a public advisory
  (report those upstream; we track them via Dependabot).
- Issues requiring physical access to a deployed machine.
- Social-engineering attacks against maintainers or users.

## Safe Harbor

We will not pursue legal action against researchers who act in good faith: who
avoid privacy violations and service disruption, give us reasonable time to
remediate before disclosure, and do not exploit a finding beyond what is
necessary to demonstrate it.
