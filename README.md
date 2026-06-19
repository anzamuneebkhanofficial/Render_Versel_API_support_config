# 🚀 Express API — Render & Vercel Deployment Config

> A **ready-to-use boilerplate** that shows you exactly how to deploy the same Express.js API on both **Render** and **Vercel** — with minimal, one-variable configuration changes.

---

## 📖 What Is This Project?

When you build a backend API with **Express.js**, you have multiple options for deployment:

| Platform | Type | Notes |
|---|---|---|
| [Render](https://render.com) | Traditional server (always-on) | Natively supports Express — zero extra config needed by default |
| [Vercel](https://vercel.com) | Serverless Functions | Requires a small `vercel.json` config + `export default app` |

This project is a **working demo** that shows:

1. ✅ How to write an Express API that runs locally in development
2. ✅ How to deploy it on **Render** (production — persistent server)
3. ✅ How to deploy the **same code** on **Vercel** (production — serverless)
4. ✅ How to switch between them **by changing just one environment variable**

No re-writing your app. No duplication. One codebase, two platforms. 🎯

---

## 📁 Project Structure

```
Render_Versel_API_support_config/
├── src/
│   ├── controllers/
│   │   └── messageController.js   # Route handler logic
│   └── routes/
│       └── apiRoutes.js           # Express router
├── server.js                      # Main entry point
├── vercel.json                    # Vercel deployment config
├── .env.example                   # Template — copy to .env and fill in
├── .gitignore                     # Protects secrets & ignores node_modules
├── package.json
├── pnpm-lock.yaml
└── README.md
```

---

## ⚙️ How the Platform Switch Works

The magic lives in **environment variables**. A single `.env` file tells the server which mode it's running in:

```env
PORT=8000
NODE_ENV=development   # "development" | "production"
RENDER=false           # "true" when deploying on Render
VERSEL=false           # "true" when deploying on Vercel
```

Here's what `server.js` does with these:

```js
// Local development → starts a normal HTTP server
if (NODE_ENV == 'development' && RENDER == 'false' && VERSEL == 'false') {
    app.listen(PORT, ...);
}

// Render deployment → starts a normal HTTP server on Render's dynamic PORT
else if (NODE_ENV == 'production' && RENDER == 'true' && VERSEL == 'false') {
    app.listen(PORT, ...);
}

// Vercel deployment → does NOT call app.listen() at all.
// Vercel imports this file as a module and grabs the exported app directly.
export default app;
```

> **🔑 Key Insight — Why Vercel ignores `app.listen()`:**
> Vercel runs your code as a **serverless function**, not a long-running process.
> When a request comes in, Vercel **imports** `server.js` as an ES module and looks
> for `export default app`. It then calls your Express `app` directly — completely
> bypassing `app.listen()`. This means your `if/else if` conditions around
> `app.listen()` are **never executed on Vercel**, regardless of what environment
> variables you set. The `export default app` line at the bottom is the real
> entry point for Vercel — not `app.listen()`.

And `vercel.json` tells Vercel to route all traffic through `server.js`:

```json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "/server.js" }]
}
```

---

## 🛠️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/anzamuneebkhanofficial/Render_Versel_API_support_config.git
cd Render_Versel_API_support_config
```

### 2. Set up your environment

```bash
# Copy the example env file
cp .env.example .env
```

Then open `.env` and fill in your values:

```env
PORT=8000
NODE_ENV=development
RENDER=false
VERSEL=false
```

### 3. Install dependencies

> ⚠️ This project uses **pnpm** as the package manager. See the [Package Manager Commands](#-package-manager-commands-npm-vs-pnpm) section below.

```bash
pnpm install
```

---

## 🏃 Running the App Locally

```bash
# With pnpm (recommended — this project uses pnpm)
pnpm run dev

# With npm (if you prefer)
npm run dev
```

Both commands run `node --watch server.js` — which auto-restarts the server on file changes (no nodemon needed).

Once running, test your endpoints:

```
GET http://localhost:8000/api/hello
GET http://localhost:8000/api/iswell
```

---

## 📦 Package Manager Commands — npm vs pnpm

This project uses **pnpm** (`packageManager` is locked in `package.json`). Here's a quick reference so you can use either:

| Task | npm command | pnpm command |
|---|---|---|
| Install all dependencies | `npm install` | `pnpm install` |
| Add a new package | `npm install <pkg>` | `pnpm add <pkg>` |
| Add a dev dependency | `npm install -D <pkg>` | `pnpm add -D <pkg>` |
| Remove a package | `npm uninstall <pkg>` | `pnpm remove <pkg>` |
| Run dev server locally | `npm run dev` | `pnpm run dev` |
| Start production server | `npm start` | `pnpm start` |
| Run any script | `npm run <script>` | `pnpm run <script>` |

> **Why pnpm?** pnpm is faster, uses less disk space, and has stricter dependency resolution. Render and Vercel both support it natively.

---

## ☁️ Deployment Guide

### 🟢 Deploying on Render

Render natively supports Express — no special wrappers needed.

**Steps:**

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Connect your GitHub repo
4. Set the following in the Render dashboard:

| Setting | Value |
|---|---|
| **Build Command** | `pnpm install` |
| **Start Command** | `pnpm start` |

5. Add these **Environment Variables** in the Render dashboard:

```env
NODE_ENV=production
RENDER=true
VERSEL=false
PORT=           ← Leave empty! Render sets this automatically
```

> ✅ **That's it.** Render handles `PORT` for you. Your app starts with `pnpm start` → `node server.js`.

---

### 🔺 Deploying on Vercel

Vercel runs your code as **serverless functions**, so `app.listen()` must NOT be called. The `vercel.json` config and `export default app` handle this.

#### 🧠 How Vercel Actually Works (Important)

This is the most commonly misunderstood part of deploying Express on Vercel:

1. Vercel reads `vercel.json` and sees `"use": "@vercel/node"` pointing at `server.js`.
2. It **imports** your `server.js` file as a serverless function module.
3. It grabs the **`export default app`** — your Express app object.
4. For **every incoming HTTP request**, Vercel calls your Express `app` directly — it **never** calls `app.listen()`.

So the `if/else if` block that guards `app.listen()` is **completely ignored on Vercel**. It doesn't matter what you set `NODE_ENV`, `RENDER`, or `VERSEL` to in the Vercel dashboard — none of those conditions affect whether Vercel serves your app. As long as `export default app` is present at the bottom of `server.js`, Vercel will pick it up and serve requests through it.

> 💡 Think of `export default app` as the **on/off switch for Vercel**. The environment variables control `app.listen()`, but Vercel never reaches that code.

**Steps:**

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Under **Framework Preset** → select **Other**
5. Add these **Environment Variables** in the Vercel dashboard:

```env
NODE_ENV=production
RENDER=false
VERSEL=true
```

> ⚠️ Do **not** set `PORT` on Vercel — serverless functions don't use a port.

6. Leave **Build Command** blank (or `pnpm install`)
7. Leave **Output Directory** blank
8. Click **Deploy** ✅

Vercel reads `vercel.json` and routes all requests through your `server.js`.

---

## 🔁 The One Variable That Changes Everything

| Environment | `NODE_ENV` | `RENDER` | `VERSEL` |
|---|---|---|---|
| Local development | `development` | `false` | `false` |
| Render production | `production` | `true` | `false` |
| Vercel production | `production` | `false` | `true` |

Change **only these three variables** in your dashboard. Everything else stays exactly the same.

---

## 🔒 Security — What's in `.gitignore`

Your `.env` file contains secrets (API keys, DB URLs, ports, etc.) and should **never** be committed to GitHub. This project's `.gitignore` protects you by excluding:

- `.env` and all its variants (`.env.local`, `.env.production`, etc.)
- `node_modules/`
- Editor configs (`.vscode/`, `.idea/`)
- OS junk files (`.DS_Store`, `Thumbs.db`)
- Vercel build artifacts (`.vercel/`)
- Logs and caches

**Always** use `.env.example` to share what variables are needed — never the actual values.

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/hello` | Returns a hello message |
| `GET` | `/api/iswell` | Returns a health-check message |

---

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| [Express.js v5](https://expressjs.com/) | Web framework |
| [dotenv](https://github.com/motdotla/dotenv) | Loads `.env` into `process.env` |
| [pnpm](https://pnpm.io/) | Fast, efficient package manager |
| [Render](https://render.com) | Cloud hosting (persistent server) |
| [Vercel](https://vercel.com) | Cloud hosting (serverless functions) |

---

## 📝 Scripts Reference

```json
{
  "start": "node server.js",         ← Used by Render in production
  "dev":   "node --watch server.js"  ← Used locally during development
}
```

| Script | npm | pnpm | When to use |
|---|---|---|---|
| `dev` | `npm run dev` | `pnpm run dev` | Local development |
| `start` | `npm start` | `pnpm start` | Render production / manual start |

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 👤 Author

**M Anza Muneeb Khan**
- GitHub: [@anzamuneebkhanofficial](https://github.com/anzamuneebkhanofficial)

---

## 📄 License

ISC © M Anza Muneeb Khan
