# UPIQ - Unified Personal Income & Query

UPIQ is a premium personal finance management application designed to help users track, categorize, and visualize their UPI transactions. It features a modern, clean UI with dark mode support, a robust microservices backend, and automated transaction parsing from bank statement PDFs.

## 🚀 Project Overview

The project is divided into two main components:
- **[Frontend](./upiq-frontend)**: A modern React application built with Vite and Tailwind CSS.
- **[Backend](./upiq-backend)**: A microservices architecture powered by Spring Boot, PostgreSQL, and Docker.

### Key Features
- **Intelligent Dashboard**: Real-time KPI tracking (Balance, Income, Expenses, Savings Rate).
- **PDF Statement Parsing**: Automatically extract and categorize transactions from bank statements.
- **Category Management**: Customizable categories with unique icons and colors.
- **Budget Tracking**: Set and monitor monthly budgets with visual progress indicators.
- **Modern UI/UX**: Premium "cool" aesthetic with smooth animations and Dark/Light mode.
- **Microservices Architecture**: Scalable, decoupled services for Auth, Transactions, Categories, and PDF Parsing.

## 🏗 Architecture

The backend consists of several microservices coordinated via Eureka Service Discovery and an API Gateway:

- **API Gateway**: Central entry point (Port 8080).
- **Eureka Server**: Service discovery (Port 8761).
- **User Authentication**: Secure JWT-based auth and registration.
- **Transaction Service**: Core logic for managing ledger entries.
- **Category Service**: Manages user-defined categories and metadata.
- **PDF Parser Service**: Intelligent extraction of data from PDF statements.

## 🚦 Quick Start

### Prerequisites
- **Docker & Docker Compose**
- **Node.js (v18+) & Desktop Browser**
- **Java 21 & Maven** (for local development)

### Step 1: Start the Backend
Navigate to the backend directory and spin up the services using Docker:
```bash
cd upiq-backend
docker-compose -f docker-compose.local.yml up -d
```

### Step 2: Start the Frontend
In a new terminal, install dependencies and start the development server:
```bash
cd upiq-frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📂 Repository Structure
```text
UPIQ/
├── upiq-frontend/      # React + Vite + Tailwind CSS
└── upiq-backend/       # Spring Boot Microservices
    ├── APIGateway/
    ├── UserAuthService/
    ├── TransactionService/
    ├── CategoryService/
    ├── PDFParserService/
    └── EurekaServer/
```

## 📄 License
This project is licensed under the MIT License.

---
**Created by Harshdeep Singh | 2025**
