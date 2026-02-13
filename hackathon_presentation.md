# LectureLens: Your AI Study Companion

---

## Slide 1: Title Slide
**Title:** LectureLens
**Tagline:** Turn Lectures into Knowledge, Instantly.
**Presenter:** [Your Name/Team Name]
**Event:** [Hackathon Name]

---

## Slide 2: The Problem
**"Information Overload in Education"**

*   **Diverse Formats:** Lectures come in Audio, Video, PPTs, PDFs, and Handwriting.
*   **Time-Consuming:** Transcribing and summarizing takes hours.
*   **Disorganized Notes:** Students struggle to link concepts across different materials.
*   **Passive Learning:** Listening isn't enough; active recall (quizzes) is missing.

---

## Slide 3: The Solution
**"LectureLens: One Lens for All Learning"**

*   **Unified Ingestion:** drag-and-drop ANY format (PDF, PPT, Audio, Video, Images).
*   **AI-Powered Processing:** 
    *   **Whisper (Groq)** for ultra-fast audio transcription.
    *   **Llama 3 (Groq)** for intelligent summarization and structuring.
    *   **Llama Vision** for extracting text/diagrams from images.
*   **Active Output:** Auto-generated Quizzes, Flashcards, and Mind Maps.

---

## Slide 4: Key Features
**"More Than Just Notes"**

1.  **Multi-Modal Input:** Upload a lecture recording AND the slide deck. LectureLens syncs them.
2.  **Smart Summaries:** Get bullet points, key concepts, and action items.
3.  **Interactive Quizzes:** Test your knowledge immediately after processing.
4.  **Cloud Sync:** Notes saved to Firebase, accessible anywhere.
5.  **Visual Learning:** Mind maps generated from text (Future/WIP).

---

## Slide 5: How It Works (Demo Flow)
1.  **Upload:** User drags a lecture video file.
2.  **Transcribe:** Groq API (Whisper) converts speech to text in seconds.
3.  **Analyze:** Llama 3 extracts key topics and structure.
4.  **Visualize:** User sees a dashboard with the video, synchronized transcript, and clear notes.
5.  **Test:** User takes a generated 5-question quiz.

---

## Slide 6: Technical Architecture
**"Built for Speed & Simplicity (No-Build)"**

*   **Frontend:** Vanilla JS (ES Modules) - No bundlers, instant load.
*   **AI Engine:** Groq API (Llama 3, Whisper, Llama Vision) for sub-second inference.
*   **Backend:** Firebase (Auth, Firestore) for serverless scalability.
*   **Processing:** PDF.js for document parsing, client-side logic.
*   **Styling:** Custom CSS + Vanta.js for immersive UI.

---

## Slide 7: Why LectureLens?
**"Speed + Accuracy + Accessibility"**

*   **Fast:** Groq's LPU inference means near real-time processing.
*   **Cost-Effective:** Serverless architecture minimizes hosting costs.
*   **Accessible:** Works on any browser, mobile-friendly responsive design.
*   **Open:** Pure web standards, easy to extend and maintain.

---

## Slide 8: Future Roadmap
**"What's Next?"**

*   **Real-time Live Transcription:** For in-class usage.
*   **Graph Knowledge Base:** Linking concepts across different lectures.
*   **Collaborative Notes:** Study groups sharing and editing together.
*   **Native Mobile App:** React Native wrapper for the existing logic.

---

## Slide 9: Thank You!
**"Start Learning Smarter, Not Harder."**

*   **Try it out:** [Live Demo Link]
*   **Repo:** [GitHub Link]
*   **Questions?**
