# SSO+ · Your connected world

A MERN self-service account prototype. Customers can review account details, manage services and preferences, make simulated payments, and track saved changes with previous and updated values. All **92 supplied tools across 11 service areas** are directly accessible. Visible selectable avatars guide customers through billing, security, service configuration, and privacy with contextual actions and saved-change tracking. Household profiles, rewards, and opt-in LiveAvatar video remain available.

## Welcome splash

A blue animal guide gently bounces on a continuously spinning transparent AT&T logo, with synchronized squash, landing shadow, ripple, and logo recoil. Enter the account or start signup. The splash appears once per tab session; open `/?splash=1` to replay it. Direct signup links bypass it. Animations use CSS and stop for reduced-motion preferences; no avatar API requests are made.

## Run

Requires Node.js 20.19+ (or 22.12+), with optional MongoDB.

```sh
npm install
npm run dev
```

Open http://127.0.0.1:5173. Express runs on port 4000. Without MongoDB, **Browser demo** saves state in localStorage. For MongoDB, copy `backend/.env.example` to `backend/.env` only if that file does not already exist, and set `MONGODB_URI`. Preserve any configured LiveAvatar credentials. On first database load, the fictional household is initialized automatically.

```sh
npm test       # fixture coverage, account actions, and mocked avatar lifecycle tests
npm run build
npm start      # serves the build at http://127.0.0.1:4000
```

The top-right **settings button** provides presentation identity and reset controls. **Change history** shows before/after values, actor, time, and export; global search finds tools across every section. See [DEMO_GUIDE.md](DEMO_GUIDE.md) for the account, walkthrough, avatar usage controls, and verification details. `npm run demo:seed` deliberately replaces the MongoDB demo snapshot when configured.

## Deploy to Render

Deploy the repository as one **Web Service**. Express serves both the built React app and `/api` routes. Keep the service root at the repository root so npm workspaces and `shared/` are available.

Push this folder to a Git repository, then in Render choose **New → Blueprint** and connect that repository. The included `render.yaml` configures Node 22, the build, start command, and health check. Alternatively, create a Node web service manually with:

- Root directory: leave blank.
- Build command: `npm ci --include=dev && npm run build`.
- Start command: `npm start`.
- Health check path: `/api/health`.
- Environment: `NODE_VERSION=22`, `NODE_ENV=production`.

Render supplies `PORT`; the server listens on `0.0.0.0`. After deployment, open the service URL and verify `/api/health` returns `{"mode":"browser-demo"}` (or `mongodb` when connected). Device images are bundled from `frontend/public/devices/`.

MongoDB is optional. To enable it, add `MONGODB_URI` in Render's environment settings and allow the service to reach the database. Without it, demo changes persist in each browser's localStorage. Configure optional LiveAvatar credentials as server environment variables using the names in `backend/.env.example`; do not upload `.env` files. LiveAvatar usage reservations are stored on the local filesystem and reset when Render replaces the instance; durable usage limits require persistent storage before enabling public avatar access.

## Squirrel Fund

**Squirrel Fund** lets household members chip in $0.50–$25 at a time and opt into daily or weekly demo contributions with a monthly cap up to $100. Members can pause their schedule and return their unused contributions. The owner reviews and applies reserved funds to the bill; balances and change history update immediately. Scheduling checks run while the app is open and when reopened, using UTC dates without catching up missed payments. All contributions are simulated, with no bank, card, or payment-provider requests.

## Personal experience

Home, service sections, Feature store, Squirrel Fund, and rewards explain the benefit of each action in direct, personal language. Greetings and profile details follow the active household member; owner/member copy reflects shared-account permissions. Cost comparisons remain estimates, rewards remain demo entitlements, and optional exploration is not required to complete account tasks.

## Account priorities

Home starts with **Needs your attention** for actionable bill and service-request checklist reminders, beside **Make it yours** for optional plan, device, feature, Squirrel Fund, and reward exploration. The header bell shows the active profile’s outstanding task count and returns to Home. Bill tasks use the remaining statement balance and clear after payment; checklist progress persists per member, appears in change history, and does not award credits. Completed tasks remain reviewable. Avatar assistance begins collapsed and is available on demand.

Document verification is a demonstration checklist, with no document collection or actual identity approval. Alerts are in-app only; email, SMS, push, and provider-driven verification events require future integrations. The displayed bill deadline belongs to the fictional November 2026 statement.

## AT&T phone catalog

Shopping and signup use Apple iPhone 17, Samsung Galaxy S26, and Google Pixel 11 from AT&T product pages checked October 29, 2026, with official product images saved locally. Full retail prices are dated snapshots before tax; promotional trade-in credits remain explicitly illustrative. Cards link to current AT&T pages. Demo drafts do not place orders or confirm eligibility. Older household-owned devices remain existing inventory. Sources: [device asset notes](frontend/public/devices/README.md).

## Profile pictures

Open the profile button, then **Change profile picture** on your active member. Choose one of nine locally stored AI-generated portraits spanning varied skin tones, ages, and personal styles, including head coverings, upload a JPG/PNG/WebP (up to 5 MB), or use initials. Preview before saving; Cancel discards the draft. Uploads are center-cropped and resized to 192px JPEG in the browser, then stored with the demo account. Selections persist across refresh and appear throughout household views. No image generation or LiveAvatar calls occur. Change history records picture type rather than image data. Switch to another member to edit that member's photo; profiles remain simulated identities.

## Simplified navigation

Six primary destinations keep navigation compact: Overview, Billing & savings, Plans & devices, Account & household, Help & updates, and Change history. Group pages provide access to every existing section, including the Feature store, Squirrel Fund, and rewards. Global search still finds all 92 tools. The overview highlights account priorities, optional exploration, the current statement, and account details; services, recent changes, and support expand on demand.

## Household rewards

**Your rewards** provides separate member wallets, one-time account-care activities, a progress indicator, and confirmed personal reward redemption. Billing/usage/privacy reviews earn credits; owner payment/configuration awards feed the same ledger without duplicate household issuance. Existing credits migrate to the owner, while other/new members begin at zero. Privacy can remain off while earning review credits. Balances, claims, and redemptions persist with account state. These are demo entitlements with no cash value or real carrier benefits.

## Feature store

The **Feature store** previews plan swaps, feature toggles, conditional discounts, and automatic/manual payments instantly. Review and confirm to save a next-cycle demo configuration, with before/after history and a separate estimate on the overview. The current statement remains unchanged. Pricing rules, examples, and limitations are documented in [DEMO_GUIDE.md](DEMO_GUIDE.md).

## Incremental signup

Select **New member sign up** in the header, or open `/?signup=1`. The guided flow asks for profile details, number of lines, per-line number/device choices, device and account features, suggested/custom billing date, optional add-ons, and optional added/transferred members, followed by review and consent. Drafts resume after refresh; submissions save a separate demo setup request with pending statuses and a before/after history entry. No authentication, purchases, invitations, or carrier transfers occur. See [DEMO_GUIDE.md](DEMO_GUIDE.md) for the walkthrough.

## Avatar guide

Andi, Maya, and Leo are local guides with distinct fictional human profile portraits with four interactive workflows, contextual transcripts, and optional installed local speech. They advance through reviews, saved updates, and change history without making changes automatically. Opening it consumes no LiveAvatar requests. The server-side LiveAvatar integration starts only from **Start sandbox avatar** and narrates a selected story stop on request. Sandbox is configured by default, with a 60-second limit, two start reservations per UTC day, lazy-loaded WebRTC, explicit stop, idle/background cleanup, and no automatic reconnects. Household reset does not reset usage. Live stream testing is intentionally left to the presenter; automated tests use mocks.

Keys belong in `backend/.env`, which is ignored. Copy the empty settings from `.env.example` when configuring a fresh checkout. Never put secrets in frontend `VITE_*` variables. LiveAvatar account metadata was verified; no streaming sessions were created during development.

Each service area has a tailored visual workspace: billing breakdowns, plan comparisons, device collections, usage charts, network diagrams, privacy-aware household maps, specialist guides, and notification feeds. All visual cards open existing self-service controls.

## Structure

- `frontend/`: React, Vite, Lucide, responsive CSS, category catalog, account UI, local and live avatar guide.
- `backend/`: Express, Mongoose state/events, opt-in LiveAvatar API, persistent session budget, seed command, tests.
- `shared/`: synthetic presentation fixtures, feature-specific examples, story stops, and account actions.

## Prototype limits

All accounts, carrier operations, location data, payments, diagnostics, and reward entitlements are simulated. The account agent uses scripted matching; the optional LiveAvatar repeats walkthrough narration. Hubs are demo profiles, without authentication or server-enforced authorization. MongoDB mode stores one shared demo household and whole-snapshot updates can overwrite concurrent changes. No real customer data should be entered. Production tenancy, authentication, authorization, payment integration, privacy controls, and reliable concurrent updates remain future work. Real MongoDB persistence and live streamed audio/video have not been verified in this environment.

### FirstNet

The FirstNet navigation tab renders the reusable `frontend/src/FirstNet.jsx` component. `frontend/src/firstnet-content.js` contains concise summaries and source URLs reviewed November 1, 2026 from FirstNet.com: the network overview, security, eligibility and eligible-role PDF, coverage, certified devices/help, app catalog, FirstNet Assist, FirstNet Central, Response Operations Group, FirstNet and Family, and customer support. Every benefit links to its official source; the component displays the review date and identifies the content as a saved snapshot. Refresh these summaries and their review date together when the official information changes.

All household profiles can browse and search public information. The Your features panel renders service shortcuts only for the existing demo owner (index 0 with role Owner); other members receive a profile-switch action. The role check controls this demo UI, not FirstNet authorization. Actual services, billing, activation, agency tools, eligibility verification, and uplift remain behind FirstNet's own authentication and permissions. This component does not collect credentials or eligibility documents, scrape authenticated pages, establish a FirstNet connection, or claim any live subscriber entitlement. Official links open in new tabs with `noopener noreferrer`.
