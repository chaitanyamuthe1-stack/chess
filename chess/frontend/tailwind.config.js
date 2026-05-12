/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Gaming dark theme with neon accents
                'gaming-dark': '#0a0e27',
                'gaming-darker': '#050812',
                'gaming-bg': '#0f1419',
                'neon-cyan': '#00d4ff',
                'neon-purple': '#b400ff',
                'neon-pink': '#ff006e',
                'neon-green': '#39ff14',
                'neon-blue': '#0080ff',
            },
            fontFamily: {
                'gaming': '"Orbitron", "Space Mono", monospace',
