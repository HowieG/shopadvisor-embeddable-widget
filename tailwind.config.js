/** @type {import('tailwindcss').Config} */
export default {
	purge: ['./src/**/*.{js,jsx,ts,tsx}'],
	content: [
		'./src/**/*.{ts,tsx}',
		'./src/*.{ts,tsx}',
	],
	theme: {
		extend: {},
	},
	plugins: [],
}

