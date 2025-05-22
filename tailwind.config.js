/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}", // ✅ optional if using pages folder
  ],
  theme: {
    extend: {
      colors: {
        primary: "#10b981", // ✅ Tailwind green-500
        danger: "#ef4444",  // 🔴 Error/alert
        dark: "#111111",    // 🖤 Dark background
        info: "#3b82f6",    // 🔵 Info color
      },
      boxShadow: {
        glow: "0 0 10px rgba(16, 185, 129, 0.6)", // ✅ green glow
      },
      keyframes: {
        "slide-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(-20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "slide-in": "slide-in 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};
