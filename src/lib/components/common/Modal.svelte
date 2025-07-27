<script lang="ts">
	/**
	 * A modal component that renders its children in a fixed, full-screen
	 * overlay with a darkened background.
	 *
	 * When the modal is shown, it sets the body's overflow to `hidden` to
	 * prevent scrolling. When the modal is hidden, it resets the body's
	 * overflow to `unset`.
	 *
	 * The modal is closed when the user clicks outside of it.
	 *
	 * @property {boolean} show - Whether to show the modal or not
	 */
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

	export let show = false;
	let mounted = false;

	/**
	 * When the component is mounted, set the `mounted` flag to `true`.
	 */
	onMount(() => {
		mounted = true;
	});

	/**
	 * When the `show` property changes, update the body's overflow style.
	 */
	$: if (mounted) {
		if (show) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
	}
</script>

{#if show}
	<!-- The darkened background overlay -->
	<div
		class="fixed top-0 right-0 left-0 bottom-0 bg-stone-900/50 w-full min-h-screen h-screen flex justify-center z-50 overflow-hidden overscroll-contain"
		on:click={() => {
			// Close the modal when the user clicks outside of it
			show = false;
		}}
	>
		<!-- The modal content container -->
		<div
			class="m-auto rounded-xl max-w-full w-[40rem] mx-2 bg-gray-50 dark:bg-gray-900 shadow-3xl"
			transition:fade={{ delay: 100, duration: 200 }}
			on:click={(e) => {
				// Prevent the click event from propagating to the background
				e.stopPropagation();
			}}
		>
			<!-- The content of the modal -->
			<slot />
		</div>
	</div>
{/if}
