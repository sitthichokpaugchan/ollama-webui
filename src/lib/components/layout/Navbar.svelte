<script lang="ts">
	import { v4 as uuidv4 } from "uuid";
	import { goto } from "$app/navigation";
	import { chatId } from "$lib/stores";

	// The title of the web application
	export let title: string = "Ollama Web UI";
</script>

<!-- Main navigation bar -->
<nav
	id="nav"
	class="fixed py-2.5 top-0 flex flex-row justify-center bg-white/95 dark:bg-gray-800/90 dark:text-gray-200 backdrop-blur-xl w-screen z-30"
>
	<div class="flex max-w-3xl w-full mx-auto px-3">
		<div class="flex w-full max-w-full">
			<div class="pr-2 self-center">
				<!-- Button to start a new chat -->
				<button
					class="cursor-pointer p-1 flex dark:hover:bg-gray-700 rounded-lg transition"
					on:click={async () => {
						console.log("newChat"); // Log the action for debugging
						goto("/"); // Navigate to the home page
						await chatId.set(uuidv4()); // Set a new chat ID
					}}
				>
					แชทใหม่
				</button>
			</div>
			<!-- Display the title of the application -->
			<div
				class="flex-1 self-center font-medium text-ellipsis whitespace-nowrap overflow-hidden"
			>
				{title != "" ? title : "Ollama Web UI"}
			</div>
		</div>
	</div>
</nav>
