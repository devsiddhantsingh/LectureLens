# LectureLens 🚀

**AI-Powered Study Companion for Students**

LectureLens transforms your lecture materials (PDFs, PPTs, Audio, Video) into structured summaries, detailed notes, and interactive quizzes using advanced AI.


![Status](https://img.shields.io/badge/status-live-success.svg)
![Tech](https://img.shields.io/badge/tech-Vanilla%20JS%20%7C%20Firebase%20%7C%20Groq-purple.svg)

## 🌟 Features

-   **Multi-Format Analysis**: Upload PowerPoint slides, PDFs, audio recordings, or video lectures.
-   **AI Summarization**: Get executive summaries, key highlights, and exam tips in seconds.
-   **Smart Notes**: Automatically extracted definitions, examples, and topic breakdowns.
-   **Interactive Quizzes**: Test your knowledge with AI-generated multiple-choice questions.
-   **Deep Space UI**: A premium, focus-oriented dark mode design with glassmorphism effects.
-   **Cloud Sync**: Save your revisions and access them from any device (powered by Firebase).
-   **PDF Export**: Download professional study guides for offline reading.

## 🛠️ Tech Stack

-   **Frontend**: Vanilla JavaScript (ES Modules), HTML5, CSS3 (Variables & Animations)
-   **Backend / Database**: Firebase (Auth, Firestore)
-   **AI Engine**: Groq API (Llama 3 / Mixtral)
-   **Libraries**:
    -   `Vanta.js`: Immersive 3D backgrounds
    -   `Lucide`: Beautiful iconography
    -   `PDF.js`: Client-side PDF parsing
    -   `jsPDF`: Report generation

## 🚀 Getting Started

### Prerequisites

-   A generic HTTP server (e.g., Live Server for VS Code, Python `http.server`, or Node `http-server`).
-   A Firebase Project with Firestore and Google Auth enabled.
-   A Groq API Key.

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/LectureLens.git
    cd LectureLens
    ```

2.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    FIREBASE_API_KEY=your_api_key
    FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    FIREBASE_PROJECT_ID=your_project_id
    FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    FIREBASE_APP_ID=your_app_id
    GROQ_API_KEY=your_groq_api_key
    ```

3.  **Generate Config**
    Since browsers can't read `.env` files directly, run the helper script to create `js/config.js`:
    ```bash
    node scripts/generate-config.js
    ```

4.  **Run the Application**
    Open `index.html` with a live server.
    ```bash
    npx http-server . -p 8080
    ```
    Visit `http://localhost:8080`.

## 📁 Project Structure

```
LectureLens/
├── index.html          # Main application shell
├── style.css           # Deep Space Design System
├── js/
│   ├── app.js          # Core application logic & router
│   ├── auth.js         # Firebase Authentication handler
│   ├── firebase.js     # Firebase initialization
│   ├── ui/             # View components (Dashboard, Output, etc.)
│   └── utils/          # AI processing, PDF export, etc.
└── scripts/
    └── generate-config.js # Config generator tool
```
