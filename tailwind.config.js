/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			fontSize: {
				sm: ['0.875rem', { lineHeight: '1.25rem' }], // Small
				base: ['1rem', { lineHeight: '1.5rem' }],   // Base (default)
				lg: ['1.125rem', { lineHeight: '1.75rem' }], // Large
				xl: ['1.25rem', { lineHeight: '1.75rem' }],  // Extra Large
				'2xl': ['1.5rem', { lineHeight: '2rem' }],   // 2 Extra Large
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],// 3 Extra Large
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 4 Extra Large
			}
		}
	},
	plugins: []
};
