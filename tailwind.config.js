/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  purge: {
    enabled: true,
    content: ["./src/**/*.{html,js,svelte,ts}"],
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
