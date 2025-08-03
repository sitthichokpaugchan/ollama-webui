<script lang="ts">
	// Import the v4 function from the uuid package for generating unique IDs
	import { v4 as uuidv4 } from "uuid";

	// Import necessary navigation and storage functions
	import { goto } from "$app/navigation";
	import { db, chats, chatId } from "$lib/stores";
	import { onMount } from "svelte";

	// Define the onMount function to be called when the component mounts
	let show = false;
	let navElement;

	let title: string = "Ollama Web UI";
	let search = "";

	let chatDeleteId = null;

	let chatTitleEditId = null;
	let chatTitle = "";

	// Define the onMount function to be called when the component mounts
	onMount(async () => {
		// Check if the window width is greater than 1280 and set the show variable accordingly
		if (window.innerWidth > 1280) {
			show = true;
		}

		// Set the chats array from the database using the $db.getChats method
		await chats.set(await $db.getChats());
	});

	/**
	 * Load a chat by its ID and navigate to the corresponding route
	 *
	 * @param {string} id - The ID of the chat to load
	 */
	const loadChat = async (id) => {
		goto(`/c/${id}`);
	};

	/**
	 * Edit the title of a chat and update the database accordingly
	 *
	 * @param {string} id - The ID of the chat to edit
	 * @param {string} _title - The new title for the chat
	 */
	const editChatTitle = async (id, _title) => {
		await $db.updateChatById(id, {
			title: _title,
		});
		title = _title;
	};

	/**
	 * Delete a chat from the database and navigate to the root route
	 *
	 * @param {string} id - The ID of the chat to delete
	 */
	const deleteChat = async (id) => {
		goto("/");
		$db.deleteChatById(id);
	};
</script>

<div
	bind:this={navElement}
	class="h-screen {show
		? ''
		: '-translate-x-[260px]'}  w-[260px] fixed top-0 left-0 z-40 transition bg-[#0a0a0a] text-gray-200 shadow-2xl text-sm
        "
>
	<div class="py-2.5 my-auto flex flex-col justify-between h-screen">
		<div class="px-2.5 flex justify-center space-x-2">
			<button
				class="flex-grow flex justify-between rounded-md px-3 py-1.5 mt-2 hover:bg-gray-900 transition"
				on:click={async () => {
					goto("/");
					await chatId.set(uuidv4());
				}}
			>
				<div class="flex self-center">
					<div class=" self-center font-medium text-sm">แชทใหม่</div>
				</div>
			</button>
		</div>

		<div class="px-2.5 mt-1 mb-2 flex justify-center space-x-2">
			<div class="flex w-full">
				<input
					class="w-full rounded-r py-1.5 pl-2.5 pr-4 text-sm text-gray-300 bg-gray-900 outline-none"
					placeholder="ค้นหา"
					bind:value={search}
				/>
			</div>
		</div>

		<div class="pl-2.5 my-2 flex-1 flex flex-col space-y-1 overflow-y-auto">
			{#each $chats.filter((chat) => {
				if (search === "") {
					return true;
				} else {
					let title = chat.title.toLowerCase();

					if (title.includes(search)) {
						return true;
					} else {
						return false;
					}
				}
			}) as chat, i}
				<div class=" w-full pr-2 relative">
					<button
						class=" w-full flex justify-between rounded-md px-3 py-2 hover:bg-gray-900 {chat.id ===
						$chatId
							? 'bg-gray-900'
							: ''} transition whitespace-nowrap text-ellipsis"
						on:click={() => {
							if (chat.id !== chatTitleEditId) {
								chatTitleEditId = null;
								chatTitle = "";
							}

							if (chat.id !== $chatId) {
								loadChat(chat.id);
							}
						}}
					>
						<div class=" flex self-center flex-1">
							<div
								class=" text-left self-center overflow-hidden {chat.id ===
								$chatId
									? 'w-[160px]'
									: 'w-[220px]'} "
							>
								{#if chatTitleEditId === chat.id}
									<input
										bind:value={chatTitle}
										class=" bg-transparent w-full"
									/>
								{:else}
									{chat.title}
								{/if}
							</div>
						</div>
					</button>

					{#if chat.id === $chatId}
						<div class=" absolute right-[22px] top-[10px]">
							{#if chatTitleEditId === chat.id}
								<div class="flex self-center space-x-1.5">
									<button
										class=" self-center hover:text-white transition"
										on:click={() => {
											editChatTitle(chat.id, chatTitle);
											chatTitleEditId = null;
											chatTitle = "";
										}}
									>
										✓
									</button><span />
									<button
										class=" self-center hover:text-white transition"
										on:click={() => {
											chatTitleEditId = null;
											chatTitle = "";
										}}
									>
										✕
									</button>
								</div>
							{:else if chatDeleteId === chat.id}
								<div class="flex self-center space-x-1.5">
									<button
										class=" self-center hover:text-white transition"
										on:click={() => {
											deleteChat(chat.id);
										}}
									>
										✓
									</button><span />
									<button
										class=" self-center hover:text-white transition"
										on:click={() => {
											chatDeleteId = null;
										}}
									>
										✕
									</button>
								</div>
							{:else}
								<div class="flex self-center space-x-1.5">
									<button
										class=" self-center hover:text-white transition"
										on:click={() => {
											chatTitle = chat.title;
											chatTitleEditId = chat.id;
										}}
									>
										แก้
									</button><span />
									<button
										class=" self-center hover:text-white transition"
										on:click={() => {
											chatDeleteId = chat.id;
										}}
									>
										ลบ
									</button>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<div
		class="fixed left-0 top-[50dvh] z-40 -translate-y-1/2 transition-transform translate-x-[255px] md:translate-x-[260px] rotate-0"
	>
		<button
			class=" group"
			on:click={() => {
				show = !show;
			}}
			><span class="" data-state="closed"
				><div
					class="flex h-[72px] w-8 items-center justify-center opacity-20 group-hover:opacity-100 transition"
				>
					<div class="flex h-6 w-6 flex-col items-center">
						<div
							class="h-3 w-1 rounded-full bg-[#0f0f0f] dark:bg-white rotate-0 translate-y-[0.15rem] {show
								? 'group-hover:rotate-[15deg]'
								: 'group-hover:rotate-[-15deg]'}"
						/>
						<div
							class="h-3 w-1 rounded-full bg-[#0f0f0f] dark:bg-white rotate-0 translate-y-[-0.15rem] {show
								? 'group-hover:rotate-[-15deg]'
								: 'group-hover:rotate-[15deg]'}"
						/>
					</div>
				</div>
			</span>
		</button>
	</div>
</div>