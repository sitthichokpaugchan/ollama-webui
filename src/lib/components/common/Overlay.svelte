<script>
	/**
	 * A component that overlays a loading spinner and optional text
	 * on top of the slot content when the `show` property is true.
	 *
	 * @property {boolean} show - Whether to show the overlay or not
	 * @property {string} content - Optional text to display next to the spinner
	 * @property {number} opacity - The opacity of the overlay background (default: 1)
	 */
	import Spinner from "./Spinner.svelte";

	export let show = false;
	export let content = "";

	export let opacity = 1;
</script>

<div class="relative">
	{#if show}
		<div class="absolute w-full h-full flex">
			<!-- The background overlay -->
			<div
				class="absolute rounded"
				style="inset: -10px; opacity: {opacity}; backdrop-filter: blur(5px);"
			/>

			<!-- The spinner and optional text -->
			<div class="flex w-full flex-col justify-center">
				<div class="py-3">
					<Spinner className="ml-2" />
				</div>

				{#if content !== ""}
					<div class="text-center text-gray-100 text-xs font-medium z-50">
						{content}
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<!-- The slot content -->
	<slot />
</div>
