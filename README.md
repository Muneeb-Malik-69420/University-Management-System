# Campus — University Management System

A university management portal for administrators, teachers, students, and parents. Campus brings student records, class management, attendance, assessments, timetables, and fee records into one role-based workspace.

Built with **React**, **Node.js**, **Express**, and a configurable **PostgreSQL** storage adapter. A persistent local demo is included for evaluation without database setup.

## Features

| Module | Functionality |
| --- | --- |
| Dashboard | Student and faculty counts, attendance overview, today's schedule, and summary export |
| Student management | Add, edit, search, filter, export, and manage active/inactive students |
| Teacher management | Faculty records, departments, contact information, and class assignments |
| Class management | Class codes, departments, assigned teachers, rooms, and student counts |
| Attendance | Daily registers, bulk marking, revisions, monthly summaries, and CSV reports |
| Results | Assessment entry, marks validation, calculated grades, and student/term filters |
| Report cards | Download individual HTML report cards; print or save as PDF through the browser |
| Timetable | Weekly schedules with checks for overlapping classes, teachers, and rooms |
| Fees | Generate vouchers, track unpaid balances, record payments, and export fee records |
| Parent portal | View attendance, results, timetable, and fees for linked children |
| User accounts | Create role-based accounts linked to teacher or student records |
| Interface | Responsive layouts, system-based light/dark appearance, and keyboard focus states |

## Technology stack

- **Frontend:** React 19, Vite, CSS, Lucide icons
- **Backend:** Node.js, Express 5
- **Storage:** PostgreSQL through `pg`, or a local JSON file for the demo
- **Validation and security:** Zod, bcryptjs, Helmet, CSRF tokens, login rate limiting, and HttpOnly session cookies
- **Testing:** Node.js test runner, business-rule unit tests, and API integration tests

## Quick start

### Requirements

- Node.js **22.12 or later**; Node.js 24 is recommended
- npm
- Git, if cloning the repository
- PostgreSQL only when using PostgreSQL mode

### 1. Clone and install

```sh
git clone https://github.com/Muneeb-Malik-69420/University-Management-System.git
cd University-Management-System
npm install
```

### 2. Create the environment file

**Windows Command Prompt:**

```cmd
copy .env.example .env
```

**PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS / Linux:**

```sh
cp .env.example .env
```

The example configuration enables fictional demo records. Keep `DATABASE_URL` blank to try the local demo immediately.

### 3. Build and start

```sh
npm run build
npm start
```

Open **[http://127.0.0.1:4000](http://127.0.0.1:4000)**. Keep the server terminal open while using the application.

For development with automatic reload:

```sh
npm run dev
```

Open **[http://127.0.0.1:5173](http://127.0.0.1:5173)**. Vite forwards API requests to the backend on port 4000.

## Demo accounts

All demo accounts use the password **`Campus123!`**. Select a demo role on the sign-in screen and enter the password.

| Role | Email | Permissions |
| --- | --- | --- |
| Administrator | `admin@campus.edu` | Manage campus records, create accounts, and record fee payments |
| Teacher | `teacher@campus.edu` | View assigned classes and students; mark attendance and enter results |
| Student | `student@campus.edu` | View the student's own academic records, timetable, and fees |
| Parent | `parent@campus.edu` | View records for linked children |

The demo teacher is assigned to **CS-5A**. The student and parent accounts are linked to **Ali Hassan**. Permissions are enforced by the API as well as the interface.

## Environment variables

| Variable | Example / default | Purpose |
| --- | --- | --- |
| `PORT` | `4000` | Backend port |
| `DATABASE_URL` | Blank | PostgreSQL connection string; blank selects local JSON storage |
| `SEED_DEMO` | `true` in `.env.example` | Seed fictional records when the selected store is empty |
| `COOKIE_SECURE` | `false` | Set to `true` for cookies served over HTTPS |

Do not commit `.env`, database passwords, or personal records.

## Storage modes

### Local demo

With `DATABASE_URL` blank, records persist in `data/campus.json`. This is the current default evaluation setup. It supports one application process and does **not** use PostgreSQL in this mode.

Sample accounts are created only when the selected data store is initially empty and `SEED_DEMO=true`. Existing records are never overwritten by the seeder. If the server was started before `.env` was created, restarting alone will not add demo users to an already-created empty store. For a fresh local demo, stop the server and back up or rename the existing `data/campus.json` before restarting.

### PostgreSQL

Create a dedicated database and user with access to it. Set the following in `.env`, replacing the example credentials:

```dotenv
DATABASE_URL=postgresql://campus:YOUR_URL_ENCODED_PASSWORD@localhost:5432/campus
SEED_DEMO=true
```

Restart the server. The application creates its `campus_state` table automatically. The health endpoint and application footer indicate which storage mode is connected.

The PostgreSQL adapter stores application state in a JSONB row and uses transactions with row locking for atomic updates. It is a small-project storage design rather than a normalized relational schema. Switching storage modes selects a separate store; it does not migrate existing local data.

An optional `compose.yaml` is included for a local PostgreSQL container. Set `POSTGRES_PASSWORD` in `.env`, run `docker compose up -d db`, and use matching credentials in `DATABASE_URL`. URL-encode reserved characters in the connection password.

## Suggested evaluation walkthrough

1. Sign in as an administrator and explore the dashboard.
2. Review teachers and classes, then add a student to an existing class.
3. Open **Attendance**, select a class/date, mark all students, and save. Switch to **Monthly report** to export the summary.
4. Open **Results**, enter an assessment, select a student, and download a report card.
5. Open **Timetable** and create a non-overlapping class slot.
6. Open **Fees & payments**, generate a voucher, download it, and record a verified payment.
7. Sign in as the teacher, student, and parent to check their restricted views.

Report cards and vouchers download as self-contained HTML files. Open a downloaded file in a browser and choose **Print → Save as PDF** for a PDF copy.

## Scripts and tests

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the API and Vite development server |
| `npm run build` | Build frontend assets into `dist/` |
| `npm start` | Start the API and serve the built frontend |
| `npm test` | Run all unit and API integration tests |
| `npm run test:unit` | Run the 8 business-rule unit tests |
| `npm run test:api` | Run the 13 API integration tests |

The **21 tests passed on November 6, 2026**: 8 unit tests cover grade thresholds, invalid marks, non-100 totals, fee precision, and paid/outstanding reconciliation; 13 API integration tests cover authentication, role visibility, CSRF, CRUD, attendance, results, timetables, payment restrictions, accounts, persistence, logout, decimal fee validation, and HTTPS proxy behavior. Shared business functions are used by the application itself.

Tests use isolated temporary local data and do not modify the demo workspace. They do not validate a live PostgreSQL connection. In environments that restrict test subprocesses, run:

```sh
node --test --test-isolation=none tests/business.test.js tests/api.test.js
```

## Live deployment

Follow [DEPLOYMENT.md](DEPLOYMENT.md) to deploy the Express application and PostgreSQL database using the included Render Blueprint. A live URL has not been provisioned as part of this source update. The deployment guide includes a hosted verification checklist and free-plan limits.

## Project structure

```text
University-Management-System/
├── src/
│   ├── main.jsx              # React screens, forms, reports, and exports
│   ├── styles.css            # Base interface styles
│   └── redesign.css          # Updated visual design and responsive themes
├── server/
│   ├── index.js              # Server entry point
│   ├── app.js                # API routes, permissions, and validation
│   ├── store.js              # PostgreSQL and local persistence
│   ├── seed.js               # Fictional demo data
│   └── create-admin.js       # First administrator setup
├── shared/business.js       # Shared grade and fee rules
├── tests/business.test.js    # Business-rule unit tests
├── tests/api.test.js         # API integration tests
├── render.yaml               # Render web service and PostgreSQL
├── DEPLOYMENT.md             # Hosting and verification guide
├── .env.example              # Example configuration
├── compose.yaml              # Optional local PostgreSQL service
├── vite.config.js
└── package.json
```

`dist/` is generated by `npm run build`. `node_modules/`, `.env`, and `data/` are excluded from version control.

## Troubleshooting

| Problem | Resolution |
| --- | --- |
| `Copy-Item` is not recognized | In Command Prompt, use `copy .env.example .env` |
| Sign-in shows “Failed to fetch” | Start the server with `npm start`, keep its terminal open, and reload the page |
| Demo credentials are rejected | Check that `.env` enables demo seeding and that the selected store actually contains demo accounts |
| Changes do not appear | Run `npm run build` after source changes and hard-refresh the browser |
| Port 4000 is already in use | Stop the previous application instance before starting another |

Production startup requires `DATABASE_URL`. For hosting, set `NODE_ENV=production`, `HOST=0.0.0.0`, and `COOKIE_SECURE=true`. The included Render configuration also sets `TRUST_PROXY=1` for its reverse proxy.

## Scope and limitations

This project is intended for coursework and demonstration. Fees are bookkeeping records; there is no bank/card payment gateway. Sessions and login rate limits are held in memory, so signing in again is required after a server restart. Password recovery, email notifications, shared multi-instance sessions, and large-scale database optimization are outside the current scope.

Use fictional records for evaluation. A deployment with real campus data would require HTTPS, secure environment configuration, backups, and additional operational hardening.
