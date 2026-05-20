# 💖 WeCheck — Calming Couples Check-In Space

**WeCheck** is a premium, beautifully crafted Progressive Web App (PWA) designed to facilitate mindful, therapeutic, and interactive weekly relationship check-ins. Built with a soothing, relaxation-therapeutic light pastel design system, WeCheck makes it easy for partners to reflect, express gratitude, align on goals, and track their emotional connection over time.

---

## ✨ Features

### 🌸 1. Therapeutic & Calming Design System
- **Mindful Palette:** A soft, relaxation-therapeutic color scheme featuring soothing Sage Green, gentle Rose, calming Lavender, and warm Cream.
- **Midnight Calm Mode:** A dynamic, low-contrast dark mode tailored for cozy evening check-ins.
- **Frosted Glassmorphism:** Glassmorphic layout panels with smooth transitions and subtle drop-shadows that feel modern and premium.

### 👥 2. Configurable Partner Modes
Choose how you want to check in on the welcome screen:
- **Together Mode (Alternating):** Step-by-step guidance designed to pass a phone or share a screen screen-by-screen.
- **Together Mode (Side-by-Side):** Columns for both Carter and Jurrand side-by-side (optimized for laptops/desktops).
- **Carter's Turn:** Shows only Carter's fields, keeping the focus entirely on one partner's turn.
- **Jurrand's Turn:** Shows only Jurrand's fields, keeping the focus entirely on the other partner's turn.

### 📊 3. High-Fidelity Interactive Wizard
- **Emotional Connectedness Sliders:** 1-10 connectedness rating scales that dynamically respond with live emoji face and word feedback (from `💔 Distant` up to `💖 Deeply Connected!`).
- **Gratitude Particle Emitters:** Real-time floating heart animations rising gently behind appreciation fields as you type.
- **Goal Alignment Toggles:** Clean, binary visual checks for goal status.
- **Couple Overview Selector:** Easy click buttons to sum up weekly coupling status.

### 💾 4. Background Draft Autosave
Never lose a heartfelt entry! The application automatically autosaves drafts to `localStorage` in real-time as you type. If the browser tab is accidentally closed or reloaded, a **"Resume In-Progress Draft"** button instantly restores your session right where you left off.

### 📈 5. History Dashboard & Dynamic SVG Trend-Charts
- **Connectedness Trends:** Plots historical connectedness scores using a responsive, custom-drawn SVG double-line chart (Carter in Rose, Jurrand in Sage).
- **Range Filtering:** Easily toggle charts dynamically between **All Time**, **Last 3 Months**, and **Last 4 Weeks**.
- **Backup & Restore:** Easily download your history database as a JSON backup or import an existing file.

### 📄 6. Exact Template Export
Generates a beautifully structured Markdown summary matching your exact template structure with active answers inserted. Features a **One-Click Copy** button and **Download (.md)** file button.

### 📱 7. Installable PWA & Offline Support
- Fully installable on iOS (via Safari Share menu) and Android (via Chrome Install menu).
- Launches in full-screen standalone mode with no browser URL address bar.
- Fully operational offline, powered by a cache-first Service Worker (`sw.js`).

---

## 🛠️ Project Structure

The project has a lightweight, robust, native vanilla architecture with zero external compilation or framework overhead:
```
beautiful-chandrasekhar/
├── index.html        # Main semantic HTML structure & PWA registration
├── styles.css        # Calming design tokens, layout variables & keyframes
├── app.js            # Reactive state manager, particle physics & SVG graph engine
├── manifest.json     # Web App Manifest for mobile installation
├── sw.js             # Service Worker for offline asset caching
├── .gitignore        # Git exclusion configurations
└── icons/            # Branding vector and PWA launcher pngs
    ├── logo.svg      # Calming Heart & Leaf emblem
    ├── icon-192.png  # PWA app launcher icon (192px)
    └── icon-512.png  # PWA app launcher icon (512px)
```

---

## 🚀 How to Run Locally

1. Start your local server:
   ```bash
   python3 -m http.server 8085
   ```
2. Open your web browser or mobile browser and navigate to:
   ```
   http://localhost:8085
   ```

---

## 📲 How to Install as a Standalone App

- **On iOS (Safari):** Open `http://localhost:8085` in Safari, tap the **Share** button, and select **"Add to Home Screen"**.
- **On Android (Chrome):** Open `http://localhost:8085` in Chrome, tap the menu (three dots), and select **"Install App"** or **"Add to Home screen"**.
