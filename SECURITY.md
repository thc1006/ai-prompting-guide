# Security Policy

This repository hosts a **static documentation website** built with Docusaurus and
served from GitHub Pages. It has **no backend server, no database, no user accounts,
and accepts no user input at runtime**. As a result, classic web-application risks
such as SQL injection, CSRF, session hijacking, and server-side rate limiting do not
apply here. Our security surface is limited to the build toolchain, third-party
dependencies, and the published static assets.

## Supported Versions

Security fixes are applied to the latest released line only.

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| < 2.0   | :x:                |

## Reporting a Vulnerability

Please report security issues **privately** — do not open a public GitHub issue.

- **Preferred:** Use GitHub's private vulnerability reporting: open the repository's
  **Security** tab → **"Report a vulnerability"**
  (https://github.com/thc1006/ai-prompting-guide/security/advisories/new).
- **Alternative:** email the maintainer at **hctsai1006@cs.nctu.edu.tw**.

When reporting, please include:

- A description of the issue and its potential impact
- Affected file(s) and location (branch/commit or URL)
- Steps to reproduce, and a proof of concept if available

We aim to acknowledge reports within **5 business days** and to provide a remediation
plan or fix as quickly as the severity warrants. This is a community-maintained
project, so timelines are best-effort.

## What We Actually Do

- **Dependency scanning:** `npm audit` and CodeQL run in CI
  (`.github/workflows/security-scan.yml`), and GitHub Dependabot monitors dependencies
  for known vulnerabilities.
- **Secret scanning:** TruffleHog runs in CI to catch accidentally committed
  credentials; contributors must never commit API keys, tokens, or passwords.
- **Static analysis:** ESLint security rules run in CI as advisory checks.

## What We Cannot Do (and Why)

Because the site is served by GitHub Pages, the following are **outside our control**
and are intentionally not claimed:

- **HTTP security headers** (CSP, HSTS, X-Frame-Options, etc.) cannot be set — GitHub
  Pages does not allow custom response headers. HTTPS is enforced by GitHub Pages itself.
- **Rate limiting, CSRF protection, secure cookies, and authentication** are not
  applicable — there is no server, no session, and no user-submitted data.

## For Contributors

- Run `npm audit` before submitting a pull request and avoid introducing dependencies
  with known high/critical vulnerabilities.
- Never commit secrets. If a secret is exposed, rotate it immediately.
- Keep dependencies reasonably up to date.

---

_Last updated: 2026-06-03_
