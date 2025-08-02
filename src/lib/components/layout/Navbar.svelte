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
	class="fixed top-0 flex w-screen items-center justify-between p-4 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 z-30"
>
	<div class="container mx-auto flex items-center justify-between">
		<button
			class="px-4 py-2 bg-blue-500 text-white hover:bg-blue-700 rounded-lg transition"
			on:click={async () => {
				console.log("newChat");
				goto("/");
				await chatId.set(uuidv4());
			}}
		>
			แชทใหม่
		</button>
		<div class="text-lg font-semibold">
			{title != "" ? title : "Ollama Web UI"}
		</div>
	</div>
</nav>