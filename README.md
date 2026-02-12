# LectureLens 🎓
**AI-Powered Lecture Summarizer & Study Companion**

LectureLens is a modern, privacy-focused educational application that transforms lecture materials (PDFs, PPTs, Audio, Video, Images) into comprehensive study guides, summaries, and smart notes using advanced AI models.

## ✨ Key Features
- **Multi-Format Support**: Process PDF slides, PowerPoint (.pptx), Audio files, Video recordings, and Images.
- **Smart Summaries**: Get concise overviews, key concepts, formulas, and exam tips.
- **Structured Notes**: Auto-generated bullet points, definitions, and analogies for better retention.
- **Vision AI Support 👁️**: Automatically detects and reads text from scanned or image-based PDFs using `Llama Vision`.
- **Interactive UI**: Dark mode, glassmorphism design, and smooth animations powered by `Vanta.js`.
- **Privacy First**: Your API key is stored locally in `.env` and never logged.

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v16+)
- A [Groq API Key](https://console.groq.com/keys) (Free tier available)

### Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/LectureLens.git
   cd LectureLens
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   - Create a file named `.env` in the root directory.
   - Add your Groq API key:
     ```env
     VITE_GROQ_API_KEY=gsk_your_api_key_here
     ```

4. **Run the Application**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

## 🛠️ Tech Stack
- **Frontend**: React + Vite
- **AI Models**: 
  - Text: `Llama 3` (Groq)
  - Audio: `Whisper Large v3` (Groq)
  - Vision: `Llama 3.2 Vision` (Groq)
- **Styling**: Vanilla CSS + Vanta.js (Three.js)
- **Document Processing**: `pdfjs-dist`, `jszip`, `fs`
- **PDF Export**: `jspdf`, `html2canvas`

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.
