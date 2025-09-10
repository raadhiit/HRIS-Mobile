/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  // content: ["./app/**/*.{js,jsx,ts,tsx}"],
    content: [
      "./app/**/*.{js,jsx,ts,tsx}",
      "./features/**/*.{js,jsx,ts,tsx}",
      "./shared/**/*.{js,jsx,ts,tsx}",
      "./components/**/*.{js,jsx,ts,tsx}",
      "./context/**/*.{js,jsx,ts,tsx}",
    ],
  safelist: [
    "bg-emerald-600",
    "bg-red-500",
    "bg-slate-800",
    "bg-transparent",
    "border",
    "border-slate-300",
    "text-white",
    "text-slate-800",
    // kalau pakai arbitrary color:
    "bg-[#2ecc71]",
    "inset-0", "bg-black/50",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        // Poppins
        poppins: ["Poppins_400Regular"],
        "poppins-medium": ["Poppins_500Medium"],
        "poppins-bold": ["Poppins_700Bold"],
        // Roboto
        roboto: ["Roboto_400Regular"],
        "roboto-medium": ["Roboto_500Medium"],
        "roboto-bold": ["Roboto_700Bold"],
      },
    },
  },
  plugins: [],
}