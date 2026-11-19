# Contributing

Thank you for helping improve the WasteNot landing site. This guide covers the workflow and standards every change is expected to follow.

## Workflow

1. Branch from `main` with a descriptive prefix: `feat/`, `fix/`, `refactor/`, `docs/`, or `chore/`.
2. Keep each commit to one logical change. Write a single-line message in the [Conventional Commits](https://www.conventionalcommits.org/) format, for example `fix(hero): keep the download button above the fold on small screens`.
3. Run `make check` before pushing.
4. Open a pull request against `main`. CI must pass before merging; merging to `main` deploys the site.

## Standards

- **Formatting and lint.** Format with `make fmt`. ESLint and the TypeScript type-check must pass.
- **Content Security Policy.** Never add inline scripts or third-party script origins. Self-host fonts and images under `public/`.
- **Content.** Site content is in Indonesian. Clearly separate shipped features from planned ones.
- **Privacy policy.** Update `public/privacy/index.html` whenever the Android app, the backend, or the AI workers change what data they collect or keep. Check it in light and dark mode at 320 px width.
- **Accessibility.** Keep visible focus states, touch-sized targets, and text alternatives for images.

## Security

Never commit secrets or deployment credentials. Report vulnerabilities privately to the maintainers rather than in a public issue.
