# Inovus Smart Door — Web Dashboard

A production-ready Next.js web dashboard for the **Inovus Smart Door** RFID access control system. Built with Next.js 14, TypeScript, Tailwind CSS, and Firebase.

## 🚀 Features

- **Real-time Access Logs** — Live feed of all door access events from Firebase RTDB
- **RFID Card Management** — Add, update, and remove authorized RFID cards
- **Analytics Dashboard** — Access granted/denied stats, activity charts
- **Secure Auth** — Firebase Authentication (email/password) with route protection
- **Discord Alerts** — View and manage Discord webhook notifications

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Firebase RTDB + Firebase Auth |
| Hosting | Vercel |

## 📋 Firebase Data Structure

```
Firebase RTDB
├── /cards
│   └── {rfid_uid}    → owner name (string)
└── /logs
    └── {timestamp}
        ├── owner     string  (owner name or "Manual Switch")
        ├── tag       string  (RFID UID)
        ├── status    boolean (true = granted, false = denied)
        └── time      number  (unix epoch)
```

## ⚙️ Setup & Development

### 1. Prerequisites

- Node.js 18+
- npm 9+
- Firebase project with:
  - **Realtime Database** enabled
  - **Authentication** enabled (Email/Password provider)

### 2. Clone & Install

```bash
git clone <repo-url>
npm install
```

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in your Firebase credentials:

```bash
cp .env.example .env.local
```

Get your Firebase config from: **Firebase Console → Project Settings → Your apps → SDK setup and configuration**

### 4. Firebase Auth

Create an admin user in **Firebase Console → Authentication → Users → Add user**.

### 5. Firebase RTDB Rules

Set your Realtime Database rules (for auth-only access):

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🚢 Deployment (Vercel)

1. Push to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local` in Vercel project settings
4. Deploy!

## 📁 Project Structure

```
app/
├── page.tsx              # Landing page
├── login/
│   └── page.tsx          # Login page
├── dashboard/
│   ├── layout.tsx        # Protected dashboard layout (sidebar)
│   ├── page.tsx          # Dashboard home (stats + live log)
│   ├── cards/
│   │   └── page.tsx      # RFID Card Manager
│   └── settings/
│       └── page.tsx      # Settings
├── layout.tsx            # Root layout
└── globals.css           # Global styles
lib/
├── firebase.ts           # Firebase app initialization
├── auth.tsx              # Auth context provider
└── hooks/
    ├── useAuth.ts        # Auth state hook
    ├── useLogs.ts        # Real-time logs hook
    └── useCards.ts       # Real-time cards hook
components/
├── Navbar.tsx
├── Sidebar.tsx
├── StatCard.tsx
├── LogTable.tsx
├── CardList.tsx
├── AddCardModal.tsx
└── LiveBadge.tsx
```

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_DATABASE_URL` | Firebase RTDB URL |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |


