/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      "2xl": { max: "1535px" },
      // => @media (max-width: 1535px) { ... }

      xl: { max: "1279px" },
      // => @media (max-width: 1279px) { ... }

      lg: { max: "1023px" },
      // => @media (max-width: 1023px) { ... }

      md: { max: "767px" },
      // => @media (max-width: 767px) { ... }

      sm: { max: "639px" },
      // => @media (max-width: 639px) { ... }

      min_2xl: { min: "1536px" },
      // => @media (max-width: 1535px) { ... }

      min_xl: { min: "1280px" },
      // => @media (max-width: 1279px) { ... }

      min_lg: { min: "1024px" },
      // => @media (max-width: 1023px) { ... }

      min_md: { min: "768px" },
      // => @media (max-width: 767px) { ... }

      min_sm: { min: "640px" },
      // => @media (max-width: 639px) { ... }
    },
    extend: {
      colors: {
        background: "#272a37",
        primary: "var(--primary)",
        secondary_gray: "#323644",
        primary_hover: "#fb2576",
        side_heading: "#9aa5b5",
      },
    },
  },
  plugins: [],
};
