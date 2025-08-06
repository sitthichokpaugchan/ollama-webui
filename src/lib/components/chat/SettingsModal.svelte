<script lang="ts">
	import Modal from "../common/Modal.svelte";
	import { OLLAMA_API_BASE_URL } from "$lib/constants";
	import toast from "svelte-french-toast";
	import { models, contextLength } from "$lib/stores";
	import { splitStream } from "$lib/utils";
	export let show = false;
	let deleteModelTag = "";
	  let contextLengths = ["4k", "8k", "16k", "32k", "64k", "128k"];
	  let selectedContextLengthIndex = contextLengths.findIndex(
	      (len) => parseInt(len) * 1000 === $contextLength
	  );
	  if (selectedContextLengthIndex === -1) {
	      selectedContextLengthIndex = 0; // Fallback to 4k if current contextLength not found
	  }

	  $: contextLength.set(parseInt(contextLengths[selectedContextLengthIndex]) * 1000);
	const deleteModelHandler = async () => {
		const res = await fetch(`${OLLAMA_API_BASE_URL}/delete`, {
			method: "DELETE",
			headers: {
				"Content-Type": "text/event-stream",
			},
			body: JSON.stringify({
				name: deleteModelTag,
			}),
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
				"Content-Type": "application/json",
			},
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
		return models;
	};
</script>

<Modal bind:show>
	<div>
		<div class="flex justify-between px-5 py-4 dark:text-gray-300">
			<div class="text-lg font-medium self-center">การตั้งค่า</div>
			<button
				class="self-center text-sm p-1 rounded dark:hover:bg-gray-800 transition"
				on:click={() => {
					show = false;
				}}
			>
				ปิด
			</button>
		</div>
		<hr class="border-gray-800 dark:border-gray-800" />
		<div class="flex flex-col md:flex-row w-full p-4 md:space-x-4">
			<div class="flex-1 md:min-h-[340px]">
				<div class="flex flex-col space-y-3 text-sm mb-10">
					<div>
						<div class="mb-2.5 text-sm font-medium">
							นำเข้าโมเดล
						</div>
						<div
							class="mt-2 text-xs text-gray-400 dark:text-gray-500"
						>
							เพื่อเข้าถึงชื่อโมเดลที่มีให้ดาวน์โหลด
							<a
								class="text-gray-500 dark:text-gray-300 font-medium"
								href="https://ollama.ai/library"
								target="_blank"
							>
								คลิกที่นี่
							</a>
						</div>
					</div>
					<hr class="border-gray-700 dark:border-gray-700" />
					<div>
						<div class="mb-2.5 text-sm font-medium">ลบโมเดล</div>
						<div class="flex w-full">
							<div class="flex-1 mr-2">
								<select
									class="w-full rounded py-2 px-4 text-sm dark:text-gray-300 dark:bg-gray-800 outline-none"
									bind:value={deleteModelTag}
									placeholder="เลือกโมเดล"
								>
									{#if !deleteModelTag}
										<option value="" disabled selected
											>เลือกโมเดล</option
										>
									{/if}
									{#each $models.filter((m) => m.size != null) as model}
										<option
											value={model.name}
											class="bg-gray-100 dark:bg-gray-700"
										>
											{model.name +
												" (" +
												(
													model.size /
													1024 ** 3
												).toFixed(1) +
												" GB)"}
										</option>
									{/each}
								</select>
							</div>
							<button
								class="px-3 bg-red-500 hover:bg-red-700 text-white rounded-lg transition flex items-center text-sm"
								on:click={() => {
									deleteModelHandler();
								}}
							>
								ลบ
							</button>
						</div>
					</div>
				</div>
			</div>
			<div class="flex-1 md:min-h-[340px]">
				<div class="flex flex-col space-y-3 text-sm mb-10">
					<div>
						<div class="mb-2.5 text-sm font-medium">
							ความยาวบริบท
						</div>
						<div
							class="mt-2 text-xs text-gray-400 dark:text-gray-500"
						>
							กำหนดความยาวบริบทการสนทนา LLM บนเครื่องของคุณที่สามารถจดจำและสร้างคำตอบได้
						</div>
						<div class="flex justify-between text-xs mt-2">
							{#each contextLengths as length, i}
								<span class="{selectedContextLengthIndex === i ? 'font-bold' : ''}">{length}</span>
							{/each}
						</div>
						<input
							type="range"
							min="0"
							max="{contextLengths.length - 1}"
							bind:value="{selectedContextLengthIndex}"
							class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</Modal>
