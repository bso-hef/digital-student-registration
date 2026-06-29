# Third-Party Notices

This product, **Digital Student Registration**, is licensed under the MIT License
(see [`LICENSE`](./LICENSE)). It incorporates third-party open-source software.
The relevant licenses and notices are reproduced or referenced below.

The vast majority of bundled dependencies are distributed under permissive
licenses (MIT, ISC, Apache-2.0, BSD-2/3-Clause). The full per-package license
text is available in each package's directory under `node_modules/` after
installation, and in the dependency manifest (`yarn.lock` / `package.json`).

This file documents only the dependencies that warrant an explicit notice —
namely those offered under a dual license (where we elect a permissive option)
or under a weak-copyleft license (MPL-2.0, LGPL-3.0).

---

## Dual-licensed dependencies — elected option

For the following dependencies we elect to use the **permissive** option of
their dual license:

| Package     | Offered as                  | Elected option | Role                             |
| ----------- | --------------------------- | -------------- | -------------------------------- |
| `jszip`     | MIT **OR** GPL-3.0-or-later | **MIT**        | Runtime (direct dependency)      |
| `dompurify` | MPL-2.0 **OR** Apache-2.0   | **Apache-2.0** | Runtime (transitive via `jspdf`) |

No GPL or MPL obligations are triggered by this election.

---

## Weak-copyleft dependencies (MPL-2.0)

The following packages are licensed under the **Mozilla Public License 2.0**.
MPL-2.0 is a _file-level_ copyleft license: it only requires that modifications
to the MPL-licensed source files themselves be made available under MPL-2.0. It
imposes no obligations on the rest of this project. These packages are used
**unmodified** and are **build/development tooling only** — they are not part of
the distributed application bundle.

| Package                 | License | Role                                                 |
| ----------------------- | ------- | ---------------------------------------------------- |
| `axe-core`              | MPL-2.0 | Dev/test (accessibility checks via Storybook/ESLint) |
| `lightningcss`          | MPL-2.0 | Build/test (transitive via Vite/Vitest)              |
| `postcss-values-parser` | MPL-2.0 | Dev tooling (transitive via `madge`)                 |

MPL-2.0 source is available from each project's upstream repository.

---

## LGPL component — `sharp` / libvips

Next.js' optional image optimization uses [`sharp`](https://github.com/lovell/sharp),
which on this platform pulls in a prebuilt native binary
(`@img/sharp-win32-x64`) licensed under **Apache-2.0 AND LGPL-3.0-or-later**
(the LGPL portion covers the bundled `libvips` native library).

This component is consumed as a **separate, dynamically loaded, unmodified**
native library. LGPL-3.0 explicitly permits linking against and distributing
such a library alongside software under a different license (here, MIT). We do
not modify or statically link `libvips`. Its source is available from the
[libvips project](https://github.com/libvips/libvips) and the
[`sharp` project](https://github.com/lovell/sharp).

---

## Full license inventory

A complete machine-readable inventory of all dependency licenses can be
regenerated at any time, e.g.:

```bash
npx license-checker --production --summary   # runtime dependencies
npx license-checker --summary                # including dev dependencies
```

The audit performed for this release found **no** AGPL, no unconditional GPL,
no proprietary/UNLICENSED, and no missing-license packages. All dependencies are
compatible with distributing this project under the MIT License.
