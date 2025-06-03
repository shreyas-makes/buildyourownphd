# 📘 Product Specification: buildyourownphd.com

## 🧠 Overview

**buildyourownphd.com** is a platform that empowers learners to curate and manage their self-directed PhD journey. Users can compile various learning resources through a drag-and-drop interface, which are then converted into mobile-friendly Markdown documents and audiobooks for seamless consumption.

---

## 🧩 Core Features

### 1. **Resource Compilation**

* **Functionality**: Users can upload or link resources (e.g., PDFs, articles, videos, audio files) via a drag-and-drop interface.
* **Processing**:

  * Extract text from PDFs and articles.
  * Transcribe audio and video content using AI services.
  * Convert all content into standardized Markdown format.

### 2. **Content Organization**

* **Structure**: Allow users to organize resources into chapters or modules.
* **Customization**: Enable tagging, reordering, and annotation of resources.

### 3. **Mobile-Optimized Reading**

* **Implementation**: Utilize `react-native-markdown-display` to render Markdown content in the React Native (Expo) app.
* **Features**:

  * Responsive design for various screen sizes.
  * Dark mode support.
  * Offline access to downloaded content.

### 4. **Audiobook Generation**

* **Process**:

  * Convert Markdown content into audio using AI-powered text-to-speech (TTS) services.
  * Store or stream the generated audio files.
* **Playback**:

  * Integrate audio players within the app to allow users to listen to their content.
  * Provide controls for play, pause, skip, and adjust playback speed.

### 5. **User Experience Enhancements**

* **Features**:

  * Allow users to switch between reading and listening modes seamlessly.
  * Implement bookmarking, highlighting, and note-taking functionalities.
  * Provide offline access to downloaded content.

---

## 🛠️ Technical Stack

### **Frontend**

* **Web**: Next.js, TailwindCSS, Shadcn UI, React Query, Zustand.
* **Mobile**: React Native (Expo), NativeWind, `react-native-markdown-display`.

### **Backend**

* **Framework**: NestJS.
* **Database**: Supabase (PostgreSQL).
* **Authentication**: Supabase Auth.

### **AI Services**

* **Text Extraction & Summarization**: OpenAI API.
* **Transcription & TTS**: Deepinfra, Anthropic API.

### **Infrastructure**

* **Hosting**: Railway (for both backend and frontend).

### **Development Tools**

* **IDE**: Cursor AI.
* **Version Control**: Git.

---

## 📂 File Structure

```
buildyourownphd/
├── apps/
│   ├── web/                   # Next.js application
│   └── mobile/                # React Native (Expo) application
├── packages/
│   ├── ui/                    # Shared UI components
│   └── utils/                 # Shared utility functions
├── backend/                   # NestJS backend
├── supabase/                  # Supabase configuration and migrations
├── tests/                     # Playwright test suites
├── docs/                      # Documentation and PRDs
└── .env                       # Environment variables
```

---

## ⚙️ Data Handling

### **Resource Processing**

* **PDFs & Articles**: Extract text content using OpenAI API.
* **Videos & Audio**: Transcribe content using Deepinfra or Anthropic API.
* **Conversion**: Standardize all content into Markdown format for consistency.

### **Storage**

* **Supabase**: Store user data, resource metadata, and processed content.
* **File Storage**: Utilize Supabase's storage for uploaded files and generated audio.

---

## 🛡️ Error Handling Strategies

* **Frontend**:

  * Implement global error boundaries to catch and display user-friendly error messages.
  * Validate user inputs to prevent invalid data submissions.

* **Backend**:

  * Use structured error responses with appropriate HTTP status codes.
  * Log errors with sufficient context for debugging.

* **AI Services**:

  * Implement retries with exponential backoff for transient errors.
  * Provide fallback mechanisms if AI services are unavailable.

---

## 🧪 Testing Plan

### **Testing Strategy**

* **Unit Testing**: Test individual components and functions.
* **Integration Testing**: Ensure different modules work together as expected.
* **End-to-End (E2E) Testing**: Utilize Playwright for simulating user interactions and validating workflows.

### **Playwright Integration**

* **Setup**:

  * Configure Playwright with the project, specifying browsers and devices to test against.
  * Organize tests within the `tests/` directory.

* **Microsoft Playwright Testing Service**:

  * Leverage the cloud-based service to run tests at scale across multiple browsers and operating systems.
  * Benefits include higher parallelization, faster test runs, and comprehensive reporting.

* **Model Context Protocol (MCP)**:

  * Integrate MCP to enable AI-assisted test generation and execution.
  * MCP acts as a bridge between Large Language Models (LLMs) and Playwright, allowing for structured command execution and real-time interaction based on the browser's accessibility tree.

### **Tools**

* **Frontend**: Jest, React Testing Library.
* **Backend**: Jest, Supertest.
* **E2E**: Playwright with Microsoft Playwright Testing and MCP integration.

### **Test Coverage**

* Aim for at least 80% test coverage across the codebase.
* Prioritize testing critical functionalities like resource uploading, content conversion, and playback features.

---

## 🚀 Deployment

* **CI/CD Pipeline**: Set up automated pipelines for testing and deployment using GitHub Actions.
* **Environments**:

  * **Development**: For ongoing development and testing.
  * **Production**: Live environment for end-users.

---
