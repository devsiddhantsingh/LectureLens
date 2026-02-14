# LectureLens 🚀

> **Transform lecture chaos into organized study gold**

🔗 **[Live Demo](https://thelecturelens.web.app)**

![Status](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)
![Built with](https://img.shields.io/badge/Frontend-Vanilla%20JS-yellow?style=flat-square)
![Database](https://img.shields.io/badge/Database-Firebase-orange?style=flat-square)
![AI Engine](https://img.shields.io/badge/AI-Groq%20API-blue?style=flat-square)

---

## 📚 What is LectureLens?

**LectureLens** is an intelligent study companion designed for students who drown in lecture materials. Upload your PDFs, PowerPoint slides, audio recordings, or video lectures—and LectureLens instantly extracts the essence: key summaries, smart topic notes, and auto-generated quizzes.

Perfect for:
- 📖 Exam prep (condensed notes + quizzes)
- 🎓 Note-taking automation (instantly structured)
- ⏱️ Quick review (summaries in seconds)
- 📱 Offline studying (export PDFs anytime)

---

## ✨ Core Features

### 🎯 Multi-Format Input
Drag & drop **PDFs**, **PowerPoints**, **audio**,  **video** or **text**. LectureLens handles them all.

### 🧠 AI-Powered Summaries
Get executive summaries, key points, and exam-ready highlights instantly—thanks to Groq's Llama 3.3 & Whisper models.

### 📝 Smart Note Generation
Automatically extract:
- Definitions
- Real-world examples
- Topic breakdowns
- Key formulas & concepts

### 🎪 Interactive Quizzes
Test your knowledge with AI-generated multiple-choice questions tailored to the material.

### 📊 Deep Space UI
Premium dark-mode design with:
- Glassmorphism effects
- Smooth animations
- 3D immersive backgrounds (Vanta.js)
- Beautiful icons (Lucide)

### ☁️ Cloud Sync & Auth
- Firebase Authentication (Email, Google, etc.)
- Real-time Firestore sync
- Access your notes anywhere

### 📥 PDF Export
Download polished study guides for offline reading on any device.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla JavaScript (ES Modules), HTML5, CSS3 |
| **Backend** | Firebase (Firestore, Authentication) |
| **AI Engine** | Groq API (Llama 3.3 / Whisper / Llama Vision) |
| **PDF Handling** | PDF.js, jsPDF |
| **UI Enhancements** | Vanta.js (3D backgrounds), Lucide (icons) |
| **Hosting** | Firebase Hosting |

---

## 🏗️ Architecture Overview

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   Browser   │────────▶│   LectureLens │────────▶│  Groq API    │
│  (UI/Auth)  │◀────────│   (Processing)│◀────────│  (AI Models) │
└─────────────┘         └──────────────┘         └──────────────┘
       │                       │
       └───────────────────────┘
               │
           ┌───▼────┐
           │Firebase │
           │ (Store) │
           └────────┘
```

**Flow:**
1. User uploads lecture material (PDF, PPT, audio, video)
2. Client-side parsers extract text/audio content
3. Content sent to Groq API for AI analysis
4. Results (summaries, notes, quizzes) stored in Firestore
5. UI displays formatted study material
6. User can export as PDF or sync to account

---

## 📁 Project Structure

```
LectureLens/
│
├─ public/
│  ├─ index.html                        # Main app shell
│  ├─ style.css                         # Global styles & Deep Space theme
│  │
│  └─ js/
│     ├─ app.js                         # App router & initialization
│     ├─ auth.js                        # Firebase auth helpers
│     ├─ firebase.js                    # Firebase config & setup
│     │
│     ├─ ui/                            # UI Components (ES modules)
│     │  ├─ landing.js                  # Landing page view
│     │  ├─ auth-modal.js               # Login/signup modal
│     │  ├─ dashboard.js                # User dashboard & upload
│     │  ├─ input.js                    # File/content input handler
│     │  ├─ processing.js               # Loading & progress UI
│     │  ├─ output.js                   # Results display (summaries, quizzes)
│     │  ├─ confirm-modal.js            # Confirmation dialogs
│     │  └─ [more UI modules]
│     │
│     └─ utils/                         # Processing Utilities
│        ├─ audioTranscriber.js         # Convert audio → text
│        ├─ pdfParser.js                # Extract text from PDFs
│        ├─ pptParser.js                # Parse PowerPoint slides
│        ├─ imageProcessor.js           # Handle image recognition
│        ├─ summarizer.js               # Call Groq API for summaries
│        └─ pdf-exporter.js             # Generate downloadable PDFs
│
├─ scripts/
│  └─ generate-config.js                # Tool to generate local Firebase config
│
│─ firebase.json                         # Firebase hosting configuration
│─ README.md
```

---

## 🔄 Workflow Example

**User uploads a 50-slide PowerPoint on Biology:**

1. **Upload** → User selects file via dashboard
2. **Parse** → `pptParser.js` extracts all slide text
3. **Process** → `summarizer.js` calls Groq with extracted text
4. **Generate** → Groq returns:
   - 2-paragraph summary
   - Key definitions (photosynthesis, mitosis, etc.)
   - Practice quiz (10 multiple-choice questions)
5. **Store** → Results saved to Firestore under user account
6. **Display** → UI renders formatted notes + interactive quiz
7. **Export** → User downloads as polished PDF study guide

---

## 🎨 Design Highlights

### Glassmorphism & Deep Space
- Frosted-glass effect cards with subtle depth
- Dark theme optimized for late-night studying
- Smooth micro-interactions on buttons & forms
- 3D animated backgrounds for immersion

### Responsive & Mobile-Friendly
- Works on desktop, tablet, and phone
- Touch-optimized upload & quiz interfaces
- Adaptive grid layouts

### Accessibility
- High contrast text for readability
- Keyboard navigation support
- ARIA labels for screen readers

---

## 🚀 Getting Started

### Prerequisites
- Modern browser (Chrome, Firefox, Edge, Safari)
- Firebase account (for database & auth)
- Groq API key

### Local Development

```powershell
# Serve the app locally
npx http-server public -p 8080

# or use Python
python -m http.server 8080 --directory public
```

Open **http://localhost:8080** and start uploading lectures!

---

## 📊 Key Modules Explained

### `app.js`
Central router. Handles navigation between views (landing, dashboard, output) and manages app state.

### `auth.js`
Wraps Firebase Authentication. Methods: login(), signup(), logout(), currentUser().

### `summarizer.js`
Communicates with Groq API. Sends extracted text, receives structured summaries & quiz data.

### `pdfParser.js` & `pptParser.js`
Client-side parsers using PDF.js for PDFs and native parsing for PPTs. Extracts text without server overhead.

### `audioTranscriber.js`
Converts audio → text using browser Web Audio API or calls external transcription service.

### UI Components
Each module exports a render function. Example:
```javascript
// output.js
export function renderOutput(summaryData) {
  // Display summary, notes, and quiz
}
```

---

## 💡 Use Cases

### 📚 High School / College Students
Condense lecture notes into study guides automatically.

### 🏥 Medical Students
Extract key definitions and diagnostic criteria from dense textbooks.

### 💼 Online Learners
Turn long video lectures into scannable summaries + quizzes.

### 👨‍🎓 ESL Learners
Auto-generate vocabulary & key phrases from lecture audio.

---



## 🎯 Future Roadmap

- 🌐 Multi-language support (translate lectures)
- 📈 Study analytics (track quiz scores over time)
- 🤖 Adaptive quizzes (difficulty adjusts based on performance)
- 🎤 Live lecture transcription (real-time summarization)
- 💾 Offline mode (service workers for PWA)

---
