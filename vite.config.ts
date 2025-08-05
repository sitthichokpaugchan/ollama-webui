import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, mergeConfig } from "vite";

const config = {
	plugins: [sveltekit()]
};

export default defineConfig(mergeConfig(config, {
	test: {
		environment: 'jsdom',
		setupFiles: ['./setupTest.js'],
		globals: true
	}
}));
