# UPIQ Frontend

A modern, high-performance financial dashboard built with **React**, **Vite**, and **Tailwind CSS**. UPIQ provides a premium, "cool" aesthetic with intuitive controls for managing personal finances.

## ✨ Features

- **📊 dynamic Dashboard**: Visual insight into balances, income, and spending patterns.
- **🌓 Adaptive Theme**: Seamless Dark and Light mode support with a premium feel.
- **📄 PDF Extraction**: Automated transaction parsing from bank statement PDFs.
- **💳 Transaction Management**: Detailed ledger with search, filtering, and categorization.
- **🏷️ Smart Categories**: Customizable category system with unique iconography and color-coding.
- **📈 Budget Tracking**: Visual progress bars and proactive budget monitoring.
- **⚡ Fast HMR**: Instant developer feedback during construction via Vite.

## 🛠 Tech Stack

- **Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context API
- **Utilities**: `clsx`, `axios`, `lucide-react`

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment (Optional):
   The application defaults to connecting to the API Gateway at `http://localhost:8080`.

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 🏗 Directory Structure

- `src/components/`: Reusable UI components (Modals, Icons, UI wrappers).
- `src/context/`: Global state providers (Auth, Theme, Budget, Date filters).
- `src/pages/`: Main application pages (Dashboard, Transactions, Upload).
- `src/services/`: API communication layers (Axios instances).
- `src/utils/`: Helper functions and shared logic.

## 🎨 Styling Convention
We use a **Semantic Token System** defined in `index.css`. This allows components to automatically adapt to theme changes:

- `--bg-main`: Page background
- `--text-main`: Primary text color
- `--border-base`: Standard border color
- `--bg-card`: Card and surface background

Use Tailwind classes like `text-[var(--text-main)]` for consistent theming.

## 📄 License
MIT

---
**Created by Harshdeep Singh | 2025**
