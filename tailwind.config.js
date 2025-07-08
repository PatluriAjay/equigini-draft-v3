/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ["Poppins", "sans-serif"],
        secondary: ["Inter var", "sans-serif"],
      },
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
        "3xl": "1600px ",
        "4xl": "1700px",
        "5xl": "1800px",
        "6xl": "1920px",
        "7xl": "2560px",
      },
      colors: {
        primarycolor: "#A330AE",
        primarycolor2: "#A330AE30",
        secondary: "#000000",
        secondary2: "#C12D85",
        secondary3: "#6a7282",
        // bg colors
        bodybg: "#ffffff",
        darkbg: "#38083c",
        bodybg2: "#2a0632",
        bodybg3: "#5c0c6d",
        bodybg4: "#f8f4f9",

        // border colors
        bordercolor: "#e9e6ea",
        bordercolor2: "#ffffff",
      },
      fontSize: {
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "26px" }],
        xl: ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["30px", { lineHeight: "36px" }],
        "4xl": ["36px", { lineHeight: "40px" }],
        "5xl": ["48px", { lineHeight: "1" }],
        "6xl": ["60px", { lineHeight: "1" }],
        "7xl": ["72px", { lineHeight: "1" }],
        "8xl": ["96px", { lineHeight: "1" }],
        "9xl": ["128px", { lineHeight: "1" }],
      },
      boxShadow: {
        primary: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        secondary: "0px 2px 4px rgba(0, 0, 0, 0.05)",
        card: "0px 10px 20px rgba(0, 0, 0, 0.1)",
       
      },
      keyframes: {},

      animation: {},
      maxWidth: {
        'xs': '24rem',
        // ... you can add more custom max-widths here if needed ...
      },
    },
  },
  plugins: [],
};
