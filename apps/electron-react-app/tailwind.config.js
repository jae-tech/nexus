import nexusConfig from '@nexus/tailwind-config'

/** @type {import('tailwindcss').Config} */
export default {
  ...nexusConfig,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
}