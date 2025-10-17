# RIT WORLD

A multi-lingual blog platform built with Next.js, TypeScript, and Jotai. This project provides full CRUD (Create, Read, Update, Delete) functionality for blog posts, complete with Japanese translation features.

![스크린샷 2024-07-25 171202](https://github.com/user-attachments/assets/5ba03753-bcf1-4977-ac7f-03483791d06f)

## ✨ Features

- **Post Management**: Create and edit blog posts using a Markdown editor.
- **Multi-lingual Support (i18n)**: Add and manage Japanese translations based on original Korean posts.
- **Categories & Hashtags**: Organize content by classifying posts into main/sub-categories and adding hashtags.
- **Image Upload**: Upload and manage post thumbnails using **Supabase Storage**.
- **User Authentication**: Secure user login and session management via **Supabase Auth**.
- **State Management**: Efficiently manage global state (e.g., category and hashtag lists) using Jotai.
- **Form Management**: Handle complex form states and validation with React Hook Form.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/), [React](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Jotai](https://jotai.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **UI / Styling**: [Tailwind CSS](https://tailwindcss.com/), [TOAST UI Editor](https://ui.toast.com/tui-editor)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **Backend as a Service**: [Supabase](https://supabase.io/) (Auth, Storage, Database)
- **Routing**: Next.js App Router with i18n routing

## 📂 Project Structure

This project follows the **Feature-Sliced Design (FSD)** architecture, where each directory has a distinct and clear responsibility.
