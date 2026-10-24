# CyberShield AI

CyberShield AI is a responsive cybersecurity education and triage prototype. Its browser UI uses a transparent baseline rules engine, local demo records, and optional screenshot OCR. It does not monitor other apps, browse submitted URLs, or connect to live threat intelligence.

## Run the frontend

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal (normally `http://127.0.0.1:5173`). `npm test` runs the baseline detector checks. `npm run build` creates the production frontend in `dist/`.

## Optional FastAPI starter

Python 3.10+ is needed for the API starter. Run these commands from this project folder:

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn main:app --app-dir backend --reload
```

The API exposes `GET /api/health` and `POST /api/analyze` with `{ "text": "..." }`. It uses local rules only. The current frontend runs fully without the API. No AI key is required or used.

## Features

- Dashboard with local activity, risk distribution, and quick actions.
- Built-in demo message inbox that separates flagged examples from ordinary messages and can speak a short Hindi/English risk summary after a scan when the browser supports speech synthesis. The Codex in-app browser may not expose voice playback; summaries remain visible as text.
- Scroll Animation Demo in the Learn navigation group, built from the reusable Framer Motion `ContainerScroll` component and a local CyberShield preview card.
- Message analysis for urgency, credential/OTP requests, payments, rewards, KYC, links, impersonation, and secrecy patterns.
- URL text inspection without opening or fetching the URL.
- Screenshot upload with file checks, preview, optional Tesseract OCR, and editable manual fallback.
- SafeVault copy, filter, search, notes, report action, and delete, stored in browser local storage.
- Incident records with local prototype statuses.
- Situation-specific cyber emergency checklists and official Indian reporting links.
- Local guidance assistant, interactive lessons and quizzes, pattern radar, illustrative analytics, and preferences.

## Privacy and limitations

Scans, SafeVault records, reports, settings, and lesson progress live in the browser's local storage. This is device-local demo storage, not encrypted or synced storage. Screenshot OCR is processed in the browser. There is no authentication, role management, live threat feed, reputation lookup, native inbox integration, or external AI integration. Browser alerts are demonstrations and do not run in the background. Do not enter passwords, OTPs, PINs, recovery codes, or full payment credentials. Automated assessments are guidance, not a guarantee that content is safe or fraudulent.

## Sign-in demo

Open the sign-in page at `/`. Select `Open CyberShield Demo` to continue into `/app`; no credentials are required because there is no authentication backend. Form values are never persisted or sent. Opening the root link starts at the sign-in page each time. The sidebar profile button returns to the sign-in page. Google/GitHub, signup, and password recovery controls display a setup notice.

This project uses Vite + React + TypeScript, with components in `src/` and shared styles in `src/style.css`. It does not currently use Tailwind or shadcn, so the sign-in screen is styled with existing CSS. The reusable component lives at `src/components/ui/sign-in-page.tsx`; `components/ui` is shadcn's conventional location, and its CLI-generated imports use that path so components can be added and reused consistently. Tailwind/shadcn setup is not needed to run this integrated page.

### Optional Tailwind + shadcn setup for this Vite app

If you want to convert other screens to shadcn components later, follow the [official shadcn Vite guide](https://ui.shadcn.com/docs/installation/vite):

1. Install Tailwind's Vite plugin: `npm install -D tailwindcss @tailwindcss/vite`.
2. Add `tailwindcss()` to the plugins in `vite.config.ts`, and add `@import "tailwindcss";` to the global CSS file. Keep the existing app styles while migrating gradually.
3. Configure the `@/*` TypeScript path alias to point to `./src/*` and the matching `@` alias in Vite. This enables imports such as `@/components/ui/button`.
4. Run `npx shadcn@latest init` from the app directory, then add components with `npx shadcn@latest add button` (or another component name). Keep generated reusable UI files in `src/components/ui/`.

TypeScript is already installed and configured in this project.
