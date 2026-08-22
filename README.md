# PricePulse - Multi-Store Shopping Comparison & Research

Comprehensive multi-store shopping research, price comparison, and price drop monitoring across top shopping platforms.

## 🚀 GitHub Pages Deployment with GitHub Actions

This repository includes an automated GitHub Actions workflow to build and deploy the web application to **GitHub Pages**.

### Workflow File
The deployment workflow is located in:
`.github/workflows/deploy.yml`

### How to Enable GitHub Pages in your GitHub Repository:
1. Push your code to your GitHub repository on branch `main` or `master`.
2. Go to your repository on GitHub: **Settings** > **Pages** (under Code and automation).
3. Under **Build and deployment** > **Source**, select:
   **`GitHub Actions`** (instead of "Deploy from a branch").
4. The workflow will automatically run on every push to `main` / `master`, or can be triggered manually from the **Actions** tab via **Run workflow**.
5. Once complete, your live site URL will be displayed in the GitHub Actions run summary and under your repository's Pages settings!

---

## 🛠️ Local Development & Build

### Prerequisites
- Node.js 18+ or 20+
- npm

### Install Dependencies
```bash
npm install
```

### Run Dev Server
```bash
npm run dev
```

### Build for Production / GitHub Pages
```bash
npm run build
```
The static site output will be generated inside the `./dist` folder.
