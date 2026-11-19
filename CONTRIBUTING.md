# Contributing

Thanks for helping out with the WasteNot website. Here's how we work.

## Workflow

1. Branch off `main` with a prefix that says what you're doing: `feat/`, `fix/`, `refactor/`, `docs/`, or `chore/`.
2. Keep each commit to one change, with a one-line [Conventional Commits](https://www.conventionalcommits.org/) message such as `fix(hero): keep the download button above the fold on small screens`.
3. Run `make check` before you push.
4. Open a pull request against `main`. It can merge once CI is green, and merging deploys the site.

## Standards

Format with `make fmt`. ESLint and the TypeScript type-check have to pass.

Keep the Content Security Policy strict: no inline scripts and no third-party script origins. Fonts and images are served from `public/`.

All site copy is in English. Be clear about which features have shipped and which are still planned, and don't claim results the app can't back up.

Update `public/privacy/index.html` whenever the Android app, the backend, or the AI workers change what data they collect or how long they keep it. Check it in light and dark mode at 320 px wide.

Keep focus rings visible, tap targets large enough, and text alternatives on meaningful images.

## Security

Never commit secrets or deployment credentials. If you find a vulnerability, tell the maintainers privately instead of opening a public issue.
