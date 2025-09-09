# 🚀 Pictionary Game

This repository provides a single script (`run.sh`) to start the **server**, **web**, and **mobile** projects all at once.  
The script automatically installs dependencies (`npm install`) and runs each project in parallel.

---

## 📂 Project Structure

```text
root/
├── server/   # Backend (Node.js)
├── web/      # Frontend web app (React)
├── mobile/   # Mobile app (React Native/Expo)
└── run.sh    # Script to start everything
```

---

## ⚙️ Requirements

Before running the script, make sure you have:

- **Bash shell**

  - ✅ Linux / macOS → already installed
  - ✅ Windows → install [Git Bash](https://git-scm.com/downloads) or use [WSL](https://learn.microsoft.com/en-us/windows/wsl/install)

- **Node.js & npm**
  - Check your versions:
    ```bash
    node -v
    npm -v
    ```

---

## ▶️ Usage

From the **project root**, open your bash terminal and run:

```bash
bash run.sh
```

This will start all three projects in parallel:

- **Server** → runs the backend on its configured port
- **Web** → runs the frontend web app
- **Mobile** → runs Expo for the mobile app

---

## 🌐 Accessing the Apps

### 1. Web App

Open your browser and go to:

```
http://localhost:5173
```

### 2. Mobile App (Expo)

The mobile app is powered by **Expo**.

1. **Install Expo Go on your phone**

   - [📱 iOS – App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [📱 Android – Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Scan the QR code**

   - When you run the script, Expo will display a **QR code** in your terminal.
   - Open the **Expo Go** app on your phone and scan the QR code.
   - If it's an iOS device, you can scan the QR code with the camera app and click open.
   - The app will open on your device instantly.

3. **Optional: Run in your browser**
   - You can also test the mobile app in your browser by visiting:
     ```
     http://localhost:8081
     ```
     Note: This will not have the same functionality as the mobile app.

---

## 🛑 Stopping the Script

To stop all running processes, press:

```
CTRL + C
```

in the same terminal window.

---

## 🔧 Notes

- Always run the script from the **project root** (where `run.sh` is located).
- If one project fails to start, the others will continue running. Fix the issue and re-run the script.
- The script runs all three projects in the **same terminal session**. If you close that terminal, all projects will stop.
