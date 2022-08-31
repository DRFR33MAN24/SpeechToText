/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [require("daisyui"), require("tailwindcss-flip")],
  daisyui: {
    base: false,
    styled: true,
    rtl: true,
    themes: [
      "light",
      // {
      //   mytheme: {
      //     primary: "#570DF8",

      //     secondary: "#F000B8",

      //     accent: "#37CDBE",

      //     neutral: "#3D4451",

      //     base: "#FFFFFF",

      //     info: "#3ABFF8",

      //     success: "#36D399",

      //     warning: "#FBBD23",

      //     error: "#F87272",
      //   },
      // },
    ],
  },
};
