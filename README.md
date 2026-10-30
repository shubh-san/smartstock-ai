# SmartStock AI 📦🤖

> **AI-Powered Expiry & Inventory Management System for Indian Local Businesses**  
> Designed for Kirana store owners, dairy retailers, bakeries, medical stores, and SME retailers.

![SmartStock AI Banner](https://img.shields.io/badge/Language-Hindi%20%7C%20English-emerald?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6.0-646cff?style=for-the-badge&logo=vite)

---

## 🌟 Key Features

### 1. 🗣️ Conversational Hindi AI Voice Assistant
- Communicate with your inventory using natural conversational Hindi (`hi-IN`) or Indian English.
- Real-time speech-to-text recognition with audio wave visualizer.
- Browser Speech Synthesis (Hindi TTS) speaker playback.
- Linked directly to inventory stock, expiry dates, and daily sales.
- **Safety guarantee**: Strict business rules that never recommend selling expired products.

### 2. 📷 Smart QR & Barcode Scanner
- Browser camera scanning powered by `html5-qrcode`.
- Distinguishes standard product barcodes (which identify products) from structured QR codes containing batch and expiry details.
- 1-click batch creation with quick shelf-life shortcuts (*+2 days*, *+7 days*, *+30 days*).
- Manual code entry fallback for desktop keyboards.

### 3. 🚨 Expiry Urgency Radar
- Visual traffic-light color system:
  - **GREEN (ठीक है)**: Safe stock (> 7 days).
  - **ORANGE (जल्दी एक्सपायर होगा)**: Warning threshold (4–7 days).
  - **RED (तुरंत ध्यान दें)**: Immediate attention required (<= 3 days).
- **Strict Expired Products Section**: Isolated with clear sale prohibition warning and return instructions.

### 4. 💡 AI Dynamic Discount Recommendations
- Recommends optimal clearance discounts based on days remaining and demand velocity.
- Three user actions: **सुझाव स्वीकार करें (Accept)**, **बदलाव करें (Modify)**, and **सुझाव अस्वीकार करें (Reject)**.
- Accepted discounts immediately update prices in the billing system to minimize store losses.

### 5. 🧾 Counter Billing & Point-of-Sale (POS)
- Large touch-friendly numeric `+` and `-` quantity controls.
- Flexible payment methods: **नकद (Cash)**, **UPI / Online**, **खाता (Khata / Credit)**.
- Automatic inventory batch deduction prioritizing earliest expiry (FIFO).
- Printable digital receipts and celebration confetti.

### 6. 🌐 Seamless Bilingual Support
- Instant header toggle between **हिन्दी** and **English**.
- Respectful, natural shopkeeper language (e.g. *सामान का स्टॉक*, *छूट का सुझाव*, *AI से पूछें*).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS (Indian fintech dark-green palette: `#166534`, `#DCFCE7`, `#F59E0B`, `#DC2626`)
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Charts & Insights**: Recharts
- **Barcode & QR Engine**: HTML5-QRCode
- **Voice Engine**: Web Speech API (SpeechRecognition & SpeechSynthesis)
- **State Management**: React Context API with LocalStorage persistence

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation

```bash
# Clone repository
git clone https://github.com/<your-username>/smartstock-ai.git

# Navigate into project directory
cd smartstock-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 Backend Integration

To connect with a backend server (e.g. FastAPI / Express), copy `.env.example` to `.env` and set the base URL:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Refer to [`API_CONTRACT.md`](./API_CONTRACT.md) for endpoint schemas matching:
- `GET /api/v1/products`
- `POST /api/v1/products`
- `POST /api/v1/products/{id}/batches`
- `POST /api/v1/sales`
- `GET /api/v1/discounts`
- `POST /api/v1/ai/assistant`

---

## 📁 Project Architecture

```
smartstock-ai/
├── src/
│   ├── assets/           # Icons and illustrations
│   ├── components/       # Reusable UI components
│   │   ├── inventory/    # Add Product & Add Batch modals
│   │   └── layout/       # Navbar, Sidebar, BottomNav
│   ├── context/          # AppContext and LanguageContext
│   ├── hooks/            # useSpeechRecognition, useSpeechSynthesis
│   ├── layouts/          # Responsive AppLayout wrapper
│   ├── pages/            # Dashboard, Inventory, Scan, Expiry, AI Assistant, Discounts, Sales, Reports, Settings
│   ├── services/         # API Service client, AI reasoning engine, mock datasets
│   ├── translations/     # Hindi & English dictionary
│   └── utils/            # Date utilities & currency formatters
├── API_CONTRACT.md       # API specification for backend developer
├── tailwind.config.js    # Design system tokens and theme colors
└── vite.config.js        # Vite build configuration
```

---

## 📄 License
MIT License
