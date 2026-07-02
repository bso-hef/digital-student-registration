/**
 * Conventional Commits, with the project's own type vocabulary.
 * Enforced by the `commit-msg` husky hook (`yarn commitlint --edit`).
 *
 * Allowed types match the branch-name prefixes used across the org:
 *   feature, bugfix, patch, docs, test, ci, revert, release, hotfix
 *
 * Examples:
 *   feature: add student export to Excel
 *   bugfix(classes): correct student count after deletion
 *   feature!: drop legacy onboarding endpoint   (breaking change)
 */
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feature",
        "bugfix",
        "patch",
        "docs",
        "test",
        "ci",
        "revert",
        "release",
        "hotfix",
      ],
    ],
    "header-max-length": [2, "always", 120],
  },
};

export default config;
