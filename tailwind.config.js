export default {
  important: true,
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
      sans: ['Inter', 'sans-serif'],
      poppins: ['Poppins', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
      playfair: ['Playfair Display', 'serif'],
    },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
