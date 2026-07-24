import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  // Block colors are stored as data (in lib/workout/constants.ts) and
  // combined with suffixes like "/20" at runtime, so Tailwind's static
  // scanner can't always see the final literal class string. Safelisting
  // guarantees these are generated regardless of where/how they're built.
  safelist: [
    {
      pattern: /^bg-(violet|indigo|purple|fuchsia)-(300|400|500)(\/20)?$/,
    },
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
        },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(16, 24, 40, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
