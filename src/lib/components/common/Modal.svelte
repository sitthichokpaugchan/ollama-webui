<script lang="ts">
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	export let show = false;
	let mounted = false;
	onMount(() => {
		mounted = true;
	});
	$: if (mounted) {
		if (show) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
	}
</script>

{#if show}
	<div
		class="fixed inset-0 bg-black/50 flex justify-center z-50 overflow-hidden"
		on:click={() => {
			show = false;
		}}
	>
		<div
			class="m-auto rounded-xl max-w-full w-[40rem] mx-2 bg-gray-50 shadow-2xl max-h-[80vh] overflow-y-auto"
			transition:fade={{ delay: 100, duration: 200 }}
			on:click={(e) => {
				e.stopPropagation();
			}}
		>
			<slot />
		</div>
	</div>
{/if}
