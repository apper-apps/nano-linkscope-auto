/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a5f',
        secondary: '#2dd4bf',
        accent: '#f59e0b',
        surface: '#f8fafc',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #2dd4bf 0%, #10b981 100%)',
        'gradient-accent': 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
        'gradient-surface': 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      },
    },
  },
  plugins: [],
}