<script lang="ts">
	/**
	 * A simple spinner component.
	 *
	 * @param className - The CSS class to apply to the outer div.
	 * @param theme - The theme of the spinner. Can be "white", or "black".
	 */
	export let className: string = "text-white";
	export let theme: "white" | "black" = "white";
</script>

<div class="flex justify-center text-center {className}">
	<!-- Spinner from https://tailwindui.com/components/application-ui/loading-animations#component-7e7f7d03 -->
	<svg
		class="animate-spin -ml-1 mr-3 h-5 w-5 {theme === 'white'
			? 'text-white'
			: 'text-gray-600'} "
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
	>
		<!-- The outer circle -->
		<circle
			class="opacity-25"
			cx="12"
			cy="12"
			r="10"
			stroke="currentColor"
			stroke-width="4"
		/>
		<!-- The inner circle -->
		<path
			class="opacity-75"
			fill="currentColor"
			d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
		/>
	</svg>
</div>
