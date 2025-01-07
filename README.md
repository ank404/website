# Anup Khanal's Portfolio

Anup Khanal's personal portfolio website showcasing his expertise as a **System Administrator** and an **Aspiring DevOps Engineer**. This project highlights Anup's experience in IT infrastructure, DevOps practices, and project development.

---

## 🚀 Live Demo
Visit the live version of the website: [https://anupkhanal.info.np](https://anupkhanal.info.np)

---

## ✨ Features

### 1. **Portfolio Showcase**
- Highlights professional experience and education.
- Displays projects with detailed descriptions, technologies used, and live/demo links.

### 2. **Interactive Design**
- Smooth scrolling with an interactive mouse aura effect.
- Animated navigation indicators for active sections.

### 3. **Dark/Light Mode**
- Theme toggling support using system preferences.

### 4. **Responsive Design**
- Fully responsive across devices, optimized for mobile, tablet, and desktop views.

### 5. **Performance Optimized**
- Lazy-loaded images for faster loading times.
- Clean and modular component structure for scalability.

---

## 📂 Project Structure

```plaintext
anup_website/
|-- app/
|   |-- globals.css       # Global styles
|   |-- layout.tsx        # Root layout configuration
|   |-- page.tsx          # Main homepage component
|
|-- components/
|   |-- About.tsx         # About section component
|   |-- Nav.tsx           # Navigation bar
|   |-- Projects.tsx      # Projects showcase
|   |-- ui/               # Reusable UI components (e.g., buttons, cards)
|
|-- hooks/
|   |-- useActiveSection.ts  # Custom hook for active section tracking
|
|-- lib/
|   |-- utils.ts          # Utility functions
|
|-- public/               # Static assets (images, PDFs)
|-- tailwind.config.ts    # Tailwind CSS configuration
|-- next.config.js        # Next.js configuration
|-- package.json          # Project dependencies and scripts
```

---

## 🛠️ Technologies Used

### Frontend:
- **Next.js**: Framework for React with server-side rendering (SSR) and static site generation (SSG).
- **TypeScript**: Type-safe development.
- **Tailwind CSS**: Utility-first CSS framework.
- **React Icons**: Icons for navigation and project links.

### DevOps & Hosting:
- **Vercel**: Hosting platform.
- **GitHub Actions**: Automated CI/CD pipelines.

---

## 🔧 Installation & Setup

### Prerequisites
Ensure you have the following installed:
- **Node.js** (>=14.x)
- **npm** or **yarn**

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ank404/anup-website.git
   cd anup-website
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Access the website at `http://localhost:3000`.

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Start Production Server**
   ```bash
   npm run start
   ```

---

## 🔑 Key Components

### Navigation
- **Dynamic Active State**: Highlights the current section in view.
- **Keyboard Accessible**: Includes `aria-label` attributes for accessibility.

### Projects
- Displays project cards with:
  - Title and description.
  - Skills/technologies used as badges.
  - Links to live demos or GitHub repositories.

### About
- Includes professional summary and achievements.
- Links to external organizations and work references.

---

## 🙌 Acknowledgements
- Inspired by Brittany Chiang's portfolio design.
- Icons by [React Icons](https://react-icons.github.io/react-icons).

For any inquiries or feedback, feel free to reach out via [LinkedIn](https://linkedin.com/in/anup-khanal-9587b3169) or [GitHub](https://github.com/ank404).
