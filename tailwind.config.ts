import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          50: '#f2f3f9',
          100: '#e6e7f4',
          200: '#c8cbe6',
          300: '#a9afd9',
          400: '#8b93cb',
          500: '#6d77be',
          600: '#515bb0',
          700: '#434ba3',
          800: '#3b4290',
          900: '#363c7c',
          950: '#1e2145',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
export default config;
