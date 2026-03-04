# RIT WORLD

A multi-lingual blog platform and comprehensive Interview Management System built with Next.js, TypeScript, and Jotai. Originally starting as a public blog platform with Japanese translation features, it has now expanded to include an AI-powered Interview Pattern Analysis system (Private Only).

![Blog Platform](https://github.com/user-attachments/assets/92a10a6d-3d81-4a92-a48e-d3aaf9aa15e6)

## ✨ Features

### 📝 Blog Platform (Public)

- **Post Management**: Create and edit blog posts using a modern, beautiful Markdown editor.
- **Multi-lingual Support (i18n)**: Manage Japanese translations directly alongside original Korean posts.
- **Organization**: Classify content with categories and manage keywords via hashtags.
- **Media**: Upload and manage post thumbnails with **Supabase Storage**.

### 💼 Interview Management System (Private Only)

![Private Only](https://img.shields.io/badge/Status-Private_Only-red?style=flat)

- **Record Interviews**: Log interview experiences, dates, durations, and application details.
- **AI Pattern Analysis**: Automatically extract and analyze interview questions/answers from raw scripts using Google Gemini AI.
- **Insight Generation**: Gathers statistics on interview patterns and frequently asked questions for structured retrospectives.
- **Real-time Status Tracking**: Background AI analyses with UI polling, ensuring users know exactly when interview insights are ready.

![Interview Management System](https://github.com/user-attachments/assets/96d851c9-55c2-4e1b-9338-8a6fdef9414c)

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router), [React](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Jotai](https://jotai.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **UI / Styling**: [Tailwind CSS](https://tailwindcss.com/), `@uiw/react-md-editor` (Markdown)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **Backend & DB**: [Supabase](https://supabase.io/) (PostgreSQL, Auth, Storage, Edge Functions)
- **AI Integration**: [@google/generative-ai](https://ai.google.dev/) (Gemini Flash)

## 📂 Project Structure

This project follows the **Feature-Sliced Design (FSD)** architecture, where each directory has a distinct and clear responsibility.
