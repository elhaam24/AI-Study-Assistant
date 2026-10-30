# 📚 AI Study Assistant

A minimalist, clean, and modern AI Study Assistant web application designed to help students comprehend complex concepts, summarize lecture notes, generate revision outlines, and create practice questions using Google's Gemini models.

---

## ✨ Features

- **Minimalist & Centered Design**: Distraction-free layout with a soft neutral gray palette and crisp Inter typography.
- **Powered by Gemini 3.8 Flash**: Fast, high-quality reasoning and study guide synthesis using the `@google/genai` TypeScript SDK.
- **Server-Side API Proxy**: Secure server-side endpoint (`/api/ask`) that protects your API credentials.
- **Real-Time Feedback**: Shows `Thinking...` status in the output box while processing requests.
- **Smart Fallback Mode**: Generates structured revision outlines even in offline/preview environments.
- **Quick-Start Topic Prompts**: One-click example topics (e.g., Industrial Revolution, Cellular Respiration, Newton's Laws, Planetary Mnemonics).
- **Study Utilities**:
  - Keyboard shortcut (`⌘ / Ctrl + Enter`) to submit queries instantly.
  - One-click **Copy notes** to clipboard.
  - Reset and clear input controls.
  - Formatted study hierarchy and bullet points.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend**: [Express 4](https://expressjs.com/), [tsx](https://github.com/privatenumber/tsx)
- **AI / LLM**: [@google/genai](https://www.npmjs.com/package/@google/genai) (`gemini-3.8-flash`)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Bundler & Tooling**: [Vite 8](https://vite.dev/)

---

## 📁 Project Structure

```text
├── src/
│   ├── App.tsx          # Main study assistant UI, state, and event handlers
│   ├── main.tsx         # React root mounting
│   └── index.css        # Tailwind CSS imports and base typography
├── server.ts            # Express server, Vite middleware & /api/ask Gemini route
├── index.html           # HTML entry point with metadata & Inter font
├── metadata.json        # AI Studio applet configuration and capabilities
├── vite.config.ts       # Vite configuration with Tailwind CSS plugin
├── tsconfig.json        # TypeScript compiler options
├── package.json         # Scripts and package dependencies
└── .env.example         # Environment variable template
```

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ or 20+ recommended)
- A Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### 2. Environment Setup

Create a `.env` file in the root directory (or use `.env.example` as a template):

```bash
cp .env.example .env
```

Set your Gemini API key in `.env`:

```env
GEMINI_API_KEY="your-gemini-api-key-here"
PORT=3000
```

> **Note**: In Google AI Studio, the `GEMINI_API_KEY` is automatically injected at runtime from the Secrets panel.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `dev` | `npm run dev` | Runs the full-stack server (`tsx server.ts`) with Vite dev middleware |
| `build` | `npm run build` | Builds the client application into the `dist/` directory |
| `start` | `npm run start` | Runs the production Express server serving the built assets |
| `lint` | `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |
| `clean` | `npm run clean` | Cleans previous build artifacts (`dist`, `server.js`) |

---

## 🔒 Security Best Practices

- All calls to `@google/genai` are handled exclusively in `server.ts`.
- The `GEMINI_API_KEY` is never exposed to the client-side bundle or browser environment.
- Input validation is enforced on all incoming prompt queries before routing to the Gemini API.

---

## 📄 License

Apache-2.0
