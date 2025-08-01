<script lang="ts">
	export let submitPrompt: Function;
	export let stopResponse: Function;
	export let autoScroll = true;
	export let prompt = "";
	export let messages = [];
</script>

<div class="fixed bottom-0 left-0 right-0">
	<div class="px-2.5 pt-2.5 mx-auto flex justify-center">
		{#if autoScroll === false && messages.length > 0}
			<div class="flex justify-center mb-4">
				<button
					class="bg-white border border-gray-100 dark:bg-white/20 dark:border-none p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm"
					on:click={() => {
						autoScroll = true;
						window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
					}}
				>
					\/
				</button>
			</div>
		{/if}
	</div>
	<div class="bg-white dark:bg-gray-800">
		<div class="max-w-3xl px-2.5 mx-auto">
			<div class="bg-gradient-to-t from-white dark:from-gray-800 pb-2">
				<form
					class="flex flex-col w-full rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-100"
					on:submit|preventDefault={() => {
						submitPrompt(prompt);
					}}
				>
					<div class="flex items-end">
						<textarea
							id="chat-textarea"
							class="w-full py-3 px-4 rounded-xl resize-none bg-transparent dark:bg-gray-800 dark:text-gray-100 outline-none"
							placeholder="ส่งข้อความ"
							bind:value={prompt}
							on:keypress={(e) => {
								if (e.keyCode == 13 && !e.shiftKey) {
									e.preventDefault();
								}
								if (prompt !== "" && e.keyCode == 13 && !e.shiftKey) {
									submitPrompt(prompt);
								}
							}}
							rows="1"
							on:input={(e) => {
								e.target.style.height = "";
								e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
							}}
						/>
						<div class="flex space-x-0.5 mb-2 mr-2">
							{#if messages.length == 0 || messages.at(-1).done == true}
								<button
									class="{prompt !== ''
										? 'bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100'
										: 'bg-gray-100 text-white dark:bg-gray-600 dark:text-gray-800'} transition rounded-lg p-1 w-7 h-7 flex items-center justify-center text-sm"
									type="submit"
									disabled={prompt === ""}
								>
									ส่ง
								</button>
							{:else}
								<button
									class="bg-white hover:bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-800 transition rounded-lg p-1.5 text-sm"
									on:click={stopResponse}
								>
									หยุด
								</button>
							{/if}
						</div>
					</div>
				</form>
				<div class="mt-1.5 text-xs text-gray-500 text-center">
					LLM สามารถทำผิดพลาดได้ ตรวจสอบข้อมูลที่สำคัญ
				</div>
			</div>
		</div>
	</div>
</div>