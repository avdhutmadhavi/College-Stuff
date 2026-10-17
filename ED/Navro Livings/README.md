# NAVRO Living

NAVRO Living is a responsive botanical lifestyle website for garden design, plant-care enquiries, growing guides, and a sample product catalogue. The visual identity uses the supplied NAVRO Living logo and images, warm ivory, forest green, sage, and terracotta.

The current catalogue is explicitly a demonstration. Its products, prices, stock, and guide entries are samples; sample products are unavailable for purchase. The checkout foundation accepts real catalogue items only after they have been configured and never handles payment-card details.

## Technology

- React, TypeScript, Vite, Tailwind CSS, React Router, and Lucide React
- Node.js and Express
- MySQL 8 with `mysql2/promise` and a pooled connection
- Zod request validation, Helmet, CORS, and rate limiting for enquiries

## Project structure

```text
Navro Livings/
├── assets/                   # Supplied logo and garden photography
├── client/                   # React/Vite/TypeScript frontend
│   └── src/                  # Routes, shared components, API client, styles
├── server/                   # Express API and MySQL pool
│   └── src/
├── sql/
│   ├── schema.sql            # Non-destructive, repeatable table creation
│   ├── demo-seed.sql         # Optional, clearly marked sample data
│   └── create-app-user.example.sql
└── README.md
```

## Prerequisites

- Node.js 20 or newer and npm
- MySQL Server 8.0, running locally or otherwise reachable
- A MySQL administrator account for the initial schema and application-user setup

MySQL Workbench is a database client, not the database server. On the machine inspected for this project, the **MySQL80 service was running**, MySQL Server 8 and Workbench were installed, and the MySQL command-line client was installed outside `PATH`. Node.js 24.22.0 and npm 11.19.1 were installed under `C:\Program Files\nodejs`, but that directory was not in the current shell's `PATH`. Git 2.55.0 was available.

For the current Windows shell, add the existing Node installation for this terminal:

```powershell
$env:Path = "C:\Program Files\nodejs;$env:Path"
node --version
npm --version
```

To make `node` and `npm` available in future terminals, add `C:\Program Files\nodejs` to the Windows user `PATH` and open a new terminal. If using the MySQL command-line client, its usual location in this installation is `C:\Program Files\MySQL\MySQL Server 8.0\bin`; otherwise use Workbench.

## MySQL setup (Windows / Workbench)

1. Confirm that the **MySQL Server** Windows service is running. In PowerShell, check `Get-Service MySQL80`; start the service through Windows Services if it is stopped.
2. Open MySQL Workbench and connect using an administrator account you already control. The application must not connect as `root`.
3. Open `sql/schema.sql` in Workbench and execute it with your administrator connection. It creates `navro_living` only if absent and creates tables only if absent. It does not drop or reset databases or tables. Review any existing database with the same name before proceeding; this script does not migrate existing table definitions.
4. Open `sql/create-app-user.example.sql`, replace the example password with a unique local password, and execute it in Workbench. Keep this password private; do not commit it. The account receives only `SELECT`, `INSERT`, `UPDATE`, and `DELETE` rights on `navro_living`.
5. From the `server` directory, make a local environment file and enter the application account's credentials:

   ```powershell
   Copy-Item .env.example .env
   notepad .env
   ```

   Set `DB_USER`, `DB_PASSWORD`, and, if needed, `DB_HOST`, `DB_PORT`, `DB_NAME`, `FRONTEND_URL`, and `HOST`. The committed `.env.example` has placeholders only. The development host defaults to `127.0.0.1`; configure the host binding required by your deployment platform in production.
6. Optional: add the clearly labelled demonstration catalogue and plant guides:

   ```powershell
   npm run db:seed:demo
   ```

   This uses the application account and can be run again safely. Demo products have zero stock, are marked as samples, and are rejected by order submission. Skip this step if you do not want sample records.

The server does not create or change application accounts, and the application has no hardcoded administrator account. If a Workbench connection is not already configured, use your own MySQL setup process; do not put administrator credentials in the application `.env`.

## Install and run

Run these commands from the project directory after adding Node to `PATH`.

### Backend terminal

```powershell
cd "C:\Users\Avdhut\Desktop\College Stuff\ED\Navro Livings\server"
npm install
Copy-Item .env.example .env   # only the first time
notepad .env                  # enter your local application DB credentials
npm run dev
```

The Express API listens on `http://127.0.0.1:5000`.

### Frontend terminal

```powershell
cd "C:\Users\Avdhut\Desktop\College Stuff\ED\Navro Livings\client"
npm install
npm run dev
```

Open `http://127.0.0.1:5173`. To use another API origin, create `client/.env` from `.env.example` and set `VITE_API_URL` before starting Vite. Do not put database credentials in frontend variables.

## Publish a free public preview

The public preview is a static frontend build. It uses a small in-bundle sample catalogue and guide list, makes no requests to your local API, and does not accept or store enquiries or orders. The preview displays a notice on every page and does not show personal-information forms. Local development (`npm run dev`) continues to use the Express API as before.

To build and check the static preview locally:

```powershell
cd "C:\Users\Avdhut\Desktop\College Stuff\ED\Navro Livings\client"
npm run build:preview
npm run preview -- --host 127.0.0.1
```

One free static-hosting option is Render:

1. Push the project changes to the GitHub repository. Keep `server/.env` and all database credentials out of GitHub.
2. In Render, create **New > Static Site** and connect the GitHub repository.
3. Leave the repository root directory unset so the build can access both `ED/Navro Livings/client` and `ED/Navro Livings/assets`.
4. Set the build command to `cd "ED/Navro Livings/client" && npm ci && npm run build:preview`.
5. Set the publish directory to `ED/Navro Livings/client/dist`.
6. Deploy the site. The static preview uses hash-based routes, so use links such as `https://your-site.onrender.com/#/shop` for direct visits and bookmarks.
7. Test the home, shop, guide, contact, and checkout routes on the provided public URL.

Render account authorization happens in Render/GitHub's own sign-in flow; never send a password, access token, or database credential in chat. This free static preview has no persistent backend and is not a live store. Hosting/API/database plans and usage limits can change, so review the provider's current terms before launch.

## API routes

All endpoints use the `/api` prefix and return JSON.

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Checks API and MySQL connectivity |
| GET | `/api/categories` | Lists product categories |
| GET | `/api/guide-categories` | Lists plant-guide topics |
| GET | `/api/products` | Lists active products; supports `search`, `category`, `sort`, `page`, and `limit` |
| GET | `/api/products/:slug` | Product details and images |
| GET | `/api/guides` | Paginated published guides; supports `search`, `category`, `page`, and `limit` |
| GET | `/api/guides/:slug` | Published guide details |
| POST | `/api/enquiries` | Validates and stores a garden enquiry; rate-limited |
| POST | `/api/orders` | Rechecks current database stock/prices and records a pending order in a transaction |

The order endpoint rejects demonstration products. It does not process payment, and a created order has pending payment status.

## Check the enquiry flow

1. Start MySQL, configure the application user and server `.env`, and start the API.
2. Visit `http://127.0.0.1:5000/api/health`; a successful response is `{"status":"ok","database":"connected"}`.
3. Open `http://127.0.0.1:5173/contact`, complete the required fields, agree to the enquiry consent, and submit.
4. A successful save returns a reference number and creates a row in `navro_living.enquiries`. Inspect the row in Workbench using your own authorized database connection.
5. Try invalid form data or submit without consent; the browser and API validation reject the request. If MySQL is unavailable, the page shows an error rather than a success message.

The API error handler returns a generic client error and logs only a database error code or error name, not credentials, SQL, or stack traces.

Run the backend's database-independent API validation and error-handling tests from the `server` directory with `npm test`. These tests use deliberately invalid test-only database credentials and do not create or modify database records.

## Catalogue and demo data

`sql/demo-seed.sql` creates illustrative plant, planter, kit, and tool listings plus three original starter growing notes. The records are labelled as demonstrations in the UI; prices are examples, stock is zero, and checkout cannot submit these products. Replace or remove the sample records after real descriptions, prices, images, and stock are confirmed. There are no fabricated enquiries, orders, reviews, or customer accounts.

Cart contents persist in the visitor's browser. Order totals and stock are recalculated on the server from the current database. Do not treat a sample cart or pending order request as a purchase.

## Included and not yet implemented

Included: responsive home and about pages; overview and detail pages for balcony, rooftop, kitchen, and maintenance services; enquiry form persisted to MySQL; searchable/filterable sample shop, product details, and browser-persisted cart; guide listing and detail pages; and a server-recalculated, pending-payment checkout foundation.

Not included: administrator dashboard or authorization, customer accounts, CRUD management screens, payment gateway, live Instagram integration, production hosting/domain, or verified business contact details and inventory. No administrator credentials are created. The privacy and terms pages are clearly development-stage templates; review them for the actual business and applicable law before launch.

## Production considerations

- Use HTTPS, production secrets in the hosting provider's secret store, and an explicitly configured frontend origin.
- Use a dedicated least-privilege MySQL application account; do not use `root`.
- Plan and review schema migrations separately before deploying updates to an existing database.
- Add authenticated and authorized admin features before exposing catalogue or enquiry management.
- Configure a real payment provider before collecting payment; this application does not process payments.
- Confirm business contact details, services, product data, privacy/retention requirements, delivery terms, and domain before launch.
- Review database backups, monitoring, retention/deletion, spam protection, and deployment security for the chosen host.
