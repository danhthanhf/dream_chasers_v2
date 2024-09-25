/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
    ],
    theme: {
        extend: {
            height: {
                "screen-60": "calc(100vh - 60px)",
            },
        },
    },
    plugins: [],
};
