<script lang="ts">
	import Modal from "../common/Modal.svelte";

	import { OLLAMA_API_BASE_URL } from "$lib/constants";
	import toast from "svelte-french-toast";
	import { models } from "$lib/stores";
	import { splitStream } from "$lib/utils";

	export let show = false;

	// Models
	let deleteModelTag = "";

	const deleteModelHandler = async () => {
		const res = await fetch(`${OLLAMA_API_BASE_URL}/delete`, {
			method: "DELETE",
			headers: {
				"Content-Type": "text/event-stream"
			},
			body: JSON.stringify({
				name: deleteModelTag
			})
		});

		const reader = res.body
			.pipeThrough(new TextDecoderStream())
			.pipeThrough(splitStream("\n"))
			.getReader();

		while (true) {
			const { value, done } = await reader.read();
			if (done) break;

			try {
				let lines = value.split("\n");

				for (const line of lines) {
					if (line !== "" && line !== "null") {
						console.log(line);
						let data = JSON.parse(line);
						console.log(data);

						if (data.error) {
							throw data.error;
						}
						if (data.detail) {
							throw data.detail;
						}

						if (data.status) {
						}
					} else {
						toast.success(`${deleteModelTag} ถูกลบแล้ว`);
					}
				}
			} catch (error) {
				console.log(error);
				toast.error(error);
			}
		}

		deleteModelTag = "";
		models.set(await getModels());
	};

	const getModels = async (url = "") => {
		let models = [];
		const res = await fetch(`${url ? url : OLLAMA_API_BASE_URL}/tags`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			}
		})
			.then(async (res) => {
				if (!res.ok) throw await res.json();
				return res.json();
			})
			.catch((error) => {
				console.log(error);
				if ("detail" in error) {
					toast.error(error.detail);
				} else {
					toast.error("การเชื่อมต่อเซิร์ฟเวอร์ล้มเหลว");
				}
				return null;
			});
		console.log(res);
		models.push(...(res?.models ?? []));
	};
</script>

<Modal bind:show>
	<div>
		<div class=" flex justify-between dark:text-gray-300 px-5 py-4">
			<div class=" text-lg font-medium self-center">การตั้งค่า</div>
			<button
				class="self-center"
				on:click={() => {
					show = false;
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="w-5 h-5"
				>
					<path
						d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
					/>
				</svg>
			</button>
		</div>
		<hr class=" dark:border-gray-800" />

		<div class="flex flex-col md:flex-row w-full p-4 md:space-x-4">
			<div class="flex-1 md:min-h-[340px]">
				<div class="flex flex-col space-y-3 text-sm mb-10">
					<div>
						<div class=" mb-2.5 text-sm font-medium">นำเข้าโมเดล</div>
						<div class="mt-2 text-xs text-gray-400 dark:text-gray-500">
							เพื่อเข้าถึงชื่อโมเดลที่มีให้ดาวน์โหลด <a
								class=" text-gray-500 dark:text-gray-300 font-medium"
								href="https://ollama.ai/library"
								target="_blank">คลิกที่นี่</a
							>
						</div>
					</div>
					<hr class=" dark:border-gray-700" />

					<div>
						<div class=" mb-2.5 text-sm font-medium">ลบโมเดล</div>
						<div class="flex w-full">
							<div class="flex-1 mr-2">
								<select
									class="w-full rounded py-2 px-4 text-sm dark:text-gray-300 dark:bg-gray-800 outline-none"
									bind:value={deleteModelTag}
									placeholder="เลือกโมเดล"
								>
									{#if !deleteModelTag}
										<option value="" disabled selected>เลือกโมเดล</option>
									{/if}
									{#each $models.filter((m) => m.size != null) as model}
										<option value={model.name} class="bg-gray-100 dark:bg-gray-700"
											>{model.name + " (" + (model.size / 1024 ** 3).toFixed(1) + " GB)"}</option
										>
									{/each}
								</select>
							</div>
							<button
								class="px-3 bg-red-700 hover:bg-red-800 text-gray-100 rounded transition"
								on:click={() => {
									deleteModelHandler();
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="w-4 h-4"
								>
									<path
										fill-rule="evenodd"
										d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
										clip-rule="evenodd"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</Modal>

<style>
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		/* display: none; <- Crashes Chrome on hover */
		-webkit-appearance: none;
		margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
	}

	.tabs::-webkit-scrollbar {
		display: none; /* for Chrome, Safari and Opera */
	}

	.tabs {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	input[type="number"] {
		-moz-appearance: textfield; /* Firefox */
	}
</style>
