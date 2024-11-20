/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            backgroundImage: {
                'teacherPage-image': "url('/teacherPage.png')",
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: 0, transform: 'translateY(20px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
            },
            animation: {
                fadeInUp: 'fadeInUp 0.5s ease-in-out',
            },
            extend: {
                wordBreak: {
                    'break-word': 'break-word',
                },
                whiteSpace: {
                    normal: 'normal',
                },
                overflowWrap: {
                    'break-word': 'break-word',
                },
            },
        },
    },
    plugins: [],
};
