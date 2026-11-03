/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F3ECDC",
        paperDeep: "#EAE0CB",
        ink: "#2B2620",
        inkSoft: "#6B6357",
        forest: "#2B5D4C",
        forestDeep: "#1E4438",
        forestTint: "#DCE7DE",
        gold: "#C68A2E",
        goldTint: "#F1DFB8",
        rust: "#B5583A",
        card: "#FBF7EE",
        line: "#DED2B4",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Inter", "Helvetica Neue", "sans-serif"],
        mono: ["IBM Plex Mono", "Courier New", "monospace"],
      },
      borderRadius: {
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
