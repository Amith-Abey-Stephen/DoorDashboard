# Stanly — Comprehensive Documentation & Reference Guide

This document serves as the primary technical reference for building, configuring, and maintaining the **Stanly (Inovus Smart Door)** ecosystem.

---

## 🛠️ 1. Getting Started

### **Hardare Requirements (BOM)**
To build the IoT unit, you will need:
- **Microcontroller**: 1x ESP32 DevKit V1
- **RFID Module**: 1x MFRC522 RFID Reader + 13.56MHz Tags (Cards/Fobs)
- **Actuator**: 1x 5V Single Channel Relay Module (to control the door strike)
- **Status LEDs**: 1x RGB LED (Common Cathode) or 3 individual LEDs (Red, Green, Blue)
- **Status LED (System)**: 1x Yellow/Amber LED (Ready indicator)
- **Input**: 1x Push Button (Momentary)
- **Power**: 5V/2A Micro-USB power supply

### **Software Requirements**
- **Arduino IDE** or **VS Code + PlatformIO**
- **Node.js 18+** & **npm 9+**
- **Google Firebase Account**
- **Vercel Account** (for web deployment)

---

## 🚀 2. Technology Stack

### **Web Dashboard (Admin Panel)**
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Turbopack)
- **Language**: TypeScript
- **State Management**: React Hooks (Context API for Auth)
- **Styling**: Tailwind CSS 4.0 (Vanilla CSS fallback for custom components)
- **Animations**: Framer Motion (Interactive transitions)
- **Visualizations**: Recharts (Access analytics)
- **Icons**: Lucide React
- **Deployment**: Vercel

### **Hardware Firmware (IoT Unit)**
- **Controller**: ESP32 (System-on-Chip)
- **Language**: C++ / Arduino Framework
- **Core Libraries**:
  - `Firebase_ESP_Client`: Real-time connectivity with Google Firebase.
  - `MFRC522`: High-level interface for the RFID reader.
  - `ArduinoJson`: Efficient parsing of card data and logs.
  - `WiFiClientSecure`: Encrypted communication for Discord Webhooks.

---

## 📊 3. Database Architecture (NoSQL)

The system utilizes **Firebase Realtime Database (RTDB)** for its low-latency, real-time synchronization capabilities. 

### **Data Structure**
The schema is structured under a unified `SmartDoor/` root to separate it from other potential IoT services.

```json
{
  "SmartDoor": {
    "cards": {
      "A1B2C3D4": "Amith Abey",
      "E5F6G7H8": "Technical Admin"
    },
    "logs": {
      "1713112345": {
        "owner": "Amith Abey",
        "tag": "A1B2C3D4",
        "status": true,
        "time": 1713112345
      },
      "1713112399": {
        "owner": "Unknown",
        "tag": "Z9Y8X7W6",
        "status": false,
        "time": 1713112399
      }
    }
  }
}
```

### **Table Roles**
1.  **`cards` (Registry)**: Acts as the "Allow List." Each entry maps a hardware UID to a human-readable name.
2.  **`logs` (Audit Trail)**: A time-series log of every interaction. Status `true` indicates a successful unlock; `false` indicates a denied attempt.

---

## 🔐 4. Security & Access Control

### **Authentication**
- **Admin Users**: Authenticated via **Firebase Auth** (Email/Password).
- **Session Management**: A server-side middleware (`proxy.ts`) checks for an `auth-token` cookie to protect the `/dashboard` routes.
- **Hardware Auth**: The ESP32 authenticates using a **Firebase API Key** configured in `secrets.h`.

### **Authorization (Database Rules)**
Access to the data is restricted by server-side rules ensuring that only authorized clients can interact with the system.
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

---

## 🌐 5. Web Dashboard Experience

The website serves as the central command center for the security system, allowing administrators to bridge the gap between digital data and physical security.

### **Functional Capabilities**
-   **Live Audit Trail**: Provides an instantaneous feed of every door interaction. Admins can see who entered (or who was rejected) as it happens, without refreshing.
-   **Credential Management**:
    -   **Grant Access**: Register new RFID tags by their hardware UIDs.
    -   **Revoke Access**: Instantly delete a card from the database, which informs the hardware at the next scan to deny entry.
    -   **Identity Updates**: Change the owner name associated with any tag.
-   **Security Analytics**: 
    -   Daily success/failure rates.
    -   Weekly trends to identify peak usage times or suspicious unauthorized attempts.
    -   Unique user tracking to monitor system reach.

### **Who Can Access?**
Access is strictly managed via a verified identity system:
-   **Authenticated Administrators**: Only users with valid email/password credentials stored in Firebase Auth can enter the dashboard.
-   **Route Protection**: 
    -   The system uses a **Server-Side Proxy (`proxy.ts`)** that intercepts every request.
    -   If an unauthenticated user attempts to visit `/dashboard`, they are forcefully redirected to the login page.
    -   Secure sessions are maintained via encrypted tokens stored in browser cookies.
-   **Role Structure**: Currently, the system is designed for a **Single-Level Admin Role**, where any authenticated user has full visibility and control over the card registry and logs.

---

## 🔌 6. System Integration & Communication Flow

### **The "Heartbeat" Flow**
1.  **Boot**: ESP32 connects to WiFi, syncs NTP time, and fetches the entire `/SmartDoor/cards.json` registry.
2.  **Scan**: User scans an RFID tag.
3.  **Local Decision**: ESP32 checks its local cache (fast response). 
    - If Match: Green LED + Relay Trigger (5 seconds).
    - If No Match: Red LED + Denied buzzer (if installed).
4.  **Reporting**: 
    - **Firebase**: ESP32 pushes a log entry to `/SmartDoor/logs`.
    - **Discord**: ESP32 sends a rich embed notification via Webhook.
5.  **Observation**: The Next.js Dashboard, listening to Firebase via WebSockets, updates the UI instantly without a page refresh.

---

## ⚙️ 7. Setup & Configuration Guide

### **Firebase Setup (Manual Steps)**
1.  **Project**: Create a new project in the Firebase Console.
2.  **Auth**: Enable Email/Password authentication. Create an admin user.
3.  **Database**: Create a **Realtime Database** (RTDB). Note the `databaseURL`.
4.  **Security Rules**: Apply the `.read` and `.write` rules (`auth != null`).
5.  **Web App**: Register a Web App in settings to get the JSON config.

### **Environment Variables (.env.local)**
Create this file in the `web/` directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_DATABASE_URL="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
```

### **Firmware Setup (secrets.h)**
Create this file in `ESP32 code/Code_V_1/`:
```cpp
#define WIFI_SSID       "Your_Network"
#define WIFI_PASSWORD   "Your_Password"
#define FIREBASE_URL     "https://your-rtdb.firebaseio.com"
#define FIREBASE_API_KEY "your_api_key"
#define DISCORD_WEBHOOK  "https://discord.com/..."
```

---

## 🚢 8. Deployment Lifecycle
- **Web**: Continuous Deployment via GitHub to Vercel. 
- **Hardware**: Serial flashing via Arduino IDE. Ensure the `SmartDoor/` prefix is consistent across all versions.

---

## 🔍 9. Troubleshooting

| Issue | Likely Cause | Solution |
| :--- | :--- | :--- |
| **Orange LED Stays On** | WiFi/Firebase Connection | Check `secrets.h` and serial log for errors. |
| **Card Not Recognized** | Tag Frequency / Incorrect UID | Ensure tag is 13.56MHz and UID is in `/SmartDoor/cards`. |
| **Login Loop** | Cookie Issues | Check if `auth-token` is being set; ensure domain matches. |
| **Discord Not Firing** | Webhook URL Incorrect | Verify the URL has `/api/webhooks/` in it. |

---

*Analysis Date: April 15, 2026*
*Prepared by Antigravity AI*
