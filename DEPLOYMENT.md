# Deploy the evaluation demo

This repository includes a Render Blueprint for one Express web service and one PostgreSQL database. Express serves the React production build and API from the same HTTPS origin. No separate frontend host or CORS setup is required.

## Before deploying

1. Commit and push the updated source, including `shared/`, `tests/`, `render.yaml`, and `.github/workflows/ci.yml`, to your GitHub repository. Do not upload `.env`, `data/`, or `node_modules/`.
2. Check that the GitHub **Tests and build** workflow passes. It installs dependencies, runs all tests, and builds the frontend.
3. Use fictional sample records only. `SEED_DEMO=true` creates the documented demo users on the first startup of an empty database. The demo administrator has write access; public visitors can change demo records.

## Render setup

1. Sign in at [Render](https://dashboard.render.com/).
2. Choose **New > Blueprint**, connect GitHub, and select `Muneeb-Malik-69420/University-Management-System` and your updated branch.
3. Render reads the root `render.yaml`. Review both resources: the web service and `campus-db` must both use the **Free** plan. Review any account/payment requirements before creating resources.
4. Create the Blueprint and wait for the database and web service to become ready. The database connection is supplied through `DATABASE_URL`; do not paste it into source files.
5. Open the web service's assigned HTTPS address from its dashboard. Use that exact address as the live demo link.

The Blueprint runs `npm ci --include=dev && npm test && npm run build`, then `npm start`. It configures Node 22, `NODE_ENV=production`, `HOST=0.0.0.0`, `TRUST_PROXY=1`, `COOKIE_SECURE=true`, and `SEED_DEMO=true`. Render supplies `PORT`.

Production startup deliberately refuses to run without `DATABASE_URL`. Local JSON files on a free hosting service are not durable storage.

## Check the hosted app before resubmitting

- Open `/api/health` on the assigned HTTPS domain. It should report `ok: true` and `storage: "PostgreSQL"`.
- Sign in with `admin@campus.edu` / `Campus123!`. Confirm students, attendance, results, timetable, and fees load.
- Create a fictional student, refresh, and confirm it remains. Restart the service and verify it remains afterward; signing in again after a restart is expected.
- Check teacher, student, and parent logins using the accounts in README.md.
- Download a report card and fee voucher. Open the files and confirm their contents.
- Record a fee payment and check collected/outstanding totals.
- Put the verified live address alongside the GitHub link in your updated submission. Mention the 8 business-rule unit tests and 13 API integration tests only after your own checks pass.

## Free-plan limits and application scope

Render's [free-plan documentation](https://render.com/docs/free) states that free web services sleep after 15 minutes idle and can take about a minute to wake. Free PostgreSQL databases expire 30 days after creation. Arrange longer-lived hosting before that expiry if the mentor needs extended access. Review current usage limits before deploying; a free compute plan is not an unlimited usage guarantee.

Sessions and rate limits remain in memory. Run one web-service instance; visitors must log in again after a restart or idle spin-down. This is a coursework demo, not a production campus installation. Database data is stored in a transactional JSONB state row, rather than a normalized relational schema.

For Railway or another conventional Node host, use the same build/start commands and a persistent PostgreSQL connection. Set `TRUST_PROXY=1` only if that host's proxy topology is appropriate. Vercel requires adapting session storage and deployment routing before using this project reliably across serverless instances.

References: [Render Express deployment](https://render.com/docs/deploy-node-express-app), [web-service port binding](https://render.com/docs/web-services), [Blueprint specification](https://render.com/docs/blueprint-spec).
