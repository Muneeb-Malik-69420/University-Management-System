# Campus — University Management System

A React application with an Express API, role-based permissions, and PostgreSQL support. Includes a persistent local demo so you can review the project without configuring a database.

## Run locally

Requires Node.js 22.12+ (Node 24 recommended).

```powershell
cd E:\Projects\Uni-Management-System
npm install
Copy-Item .env.example .env
npm run dev
```

Open **http://127.0.0.1:5173**. The API runs at **http://127.0.0.1:4000**. `.env.example` opts in to sample records with `SEED_DEMO=true`. Copy it only when you want a demo workspace. Existing data is never overwritten by the seeder.

Alternatively, a prebuilt `dist` folder is included in the packaged release:

```powershell
npm start
```

Open **http://127.0.0.1:4000**. To rebuild after changing the interface, run `npm run build`.

## Demo accounts

All four demo accounts use password **Campus123!**.

| Role | Email | Access |
| --- | --- | --- |
| Administrator | admin@campus.edu | All records, account creation, and fee payment recording |
| Teacher | teacher@campus.edu | Assigned classes, their students, attendance, and result entry |
| Student | student@campus.edu | Ali Hassan's attendance, results, timetable, and fees |
| Parent | parent@campus.edu | Linked child Ali Hassan's attendance, results, timetable, and fees |

The example teacher is assigned to CS-5A. Account permissions are enforced on the server, independently of the interface.

## Included workflows

- **Overview:** student and faculty counts, attendance chart, today's schedule, and CSV summary.
- **Students and teachers:** create, search, filter, edit, export, and delete unlinked records. Referenced students can be marked inactive.
- **Classes:** department, code, teacher assignment, room, and student counts.
- **Attendance:** daily register; Present, Absent, Late, and Excused; bulk mark-present; save and revise; monthly summaries and CSV downloads. Future attendance and cross-class entries are rejected.
- **Results:** enter and revise assessments, validate marks against totals, calculate grades, and filter by student and term.
- **Report cards:** select a student on Results and download a self-contained HTML report card. Open it in a browser and use Print → Save as PDF for a PDF copy.
- **Timetable:** weekly schedule; create, edit, and delete slots; reject overlapping class, teacher, or room bookings.
- **Fees:** generate student vouchers, filter records, export CSV, and record verified payments. Paid vouchers cannot be deleted. Download vouchers as HTML and print or save as PDF.
- **Accounts:** create admin, teacher, student, or parent accounts linked to existing records. Parents can be linked to multiple students.
- **Security:** bcrypt password hashes, expiring HttpOnly session cookies, CSRF tokens, login throttling, security headers, validation, and HTML/CSV export escaping.
- **Responsive UI:** desktop sidebar, mobile navigation, forms, success/error messages, loading states, and empty states. Fonts are bundled locally.

Fees are bookkeeping records. This application does not process bank or card payments or send email notifications.

## Connect PostgreSQL

Use a dedicated database rather than an existing application's database.

1. Create a database named `campus` and a user with access to that database.
2. Set `DATABASE_URL` in `.env`:

```dotenv
DATABASE_URL=postgresql://campus:YOUR_URL_ENCODED_PASSWORD@localhost:5432/campus
SEED_DEMO=true
```

3. Restart the API. It creates its `campus_state` table and seeds it only when the table is empty and `SEED_DEMO=true`. The footer shows **PostgreSQL connected**.

For a disposable Docker database, set `POSTGRES_PASSWORD` in `.env`, then run `docker compose up -d db`. Use the same password in `DATABASE_URL` (URL-encode reserved characters). Docker is optional.

PostgreSQL storage uses a single JSONB state row, with a transaction and `SELECT ... FOR UPDATE` for atomic writes. This keeps the starter's local and PostgreSQL data behavior consistent. It is suitable for this small project; a large deployment should normalize entities into relational tables, add indexes and migrations, and avoid loading all records per request. The local JSON mode is for a single application process. Local demo data is saved at `data/campus.json`; changing `DATABASE_URL` selects a separate data store and does not migrate existing local records.

## Empty workspace / real data

Set `SEED_DEMO=false` **before the first start** against a fresh dedicated database or local data directory. Create the first administrator:

```powershell
$env:ADMIN_PASSWORD = 'Choose-a-strong-unique-password'
node server/create-admin.js
Remove-Item Env:ADMIN_PASSWORD
```

The script asks for name and email. It does not echo the password. Then create teachers → classes → students → linked accounts using the interface.

## Verification

```powershell
npm test
npm run build
```

The integration suite checks authentication, CSRF, all role scopes, student CRUD, references, duplicate records, attendance transactions, grading validation, timetable collisions, payment restrictions, account links, persistence, and logout. Tests create temporary local storage and never change the demo or an external database. A live PostgreSQL connection is not required by the test suite.

## Structure

```text
src/main.jsx        React screens, forms, reports, exports
src/styles.css      Responsive design
server/app.js       Express API, validation, authorization
server/store.js     PostgreSQL / atomic local JSON persistence
server/seed.js      Fictional demo records and accounts
server/index.js     Local server entry point
server/create-admin.js  First administrator setup
tests/api.test.js   Backend integration tests
```

## Deployment notes

This is a complete local project starter, not a hardened multi-tenant service. Sessions and rate limiting are in memory, so sessions end when the server restarts; multiple server instances need a shared session and limiter store. Set `NODE_ENV=production`, use HTTPS with `COOKIE_SECURE=true`, configure a trusted reverse proxy and origin policy for your deployment, and store database credentials in environment secrets. The API binds to loopback by default. Add backups, account recovery, password changes, audit retention, pagination, and monitoring before using real campus records at scale. Demo accounts should never be seeded in a real deployment.
