<script lang="ts">
  /**
   * Callback to submit the prompt string.
   * @param prompt - The prompt to submit
   */
  export let submitPrompt: (prompt: string) => void;

  /**
   * Callback to stop the current response.
   */
  export let stopResponse: () => void;

  /**
   * Whether to auto-scroll to the bottom on new messages.
   * Controlled by parent; do not mutate directly.
   */
  export let autoScroll: boolean = true;

  /**
   * The current prompt string.
   */
  export let prompt: string = "";

  /**
   * Array of chat messages.
   */
  export interface Message {
    content: string;
    done: boolean;
    // Add other fields as needed
  }
  export let messages: Message[] = [];

  import { createEventDispatcher, onMount } from "svelte";

  // UI strings for localization
  const UI_STRINGS = {
    placeholder: "ส่งข้อความ",
    send: "ส่ง",
    stop: "หยุด",
    scrollToBottom: "เลื่อนไปด้านล่าง",
    warning: "LLM สามารถทำผิดพลาดได้ ตรวจสอบข้อมูลที่สำคัญ",
  };

  const dispatch = createEventDispatcher();

  // Local state for autoScroll to avoid mutating prop
  let localAutoScroll = autoScroll;

  $: if (autoScroll !== localAutoScroll) {
    localAutoScroll = autoScroll;
  }

  // Svelte action for efficient textarea resizing
  function autoResize(node: HTMLTextAreaElement) {
    function resize() {
      node.style.height = "";
      node.style.height = Math.min(node.scrollHeight, 200) + "px";
    }
    node.addEventListener("input", resize);
    onMount(resize);
    return {
      destroy() {
        node.removeEventListener("input", resize);
      },
    };
  }
</script>

<div class="fixed bottom-0 left-0 right-0">
  <div class="px-2.5 pt-2.5 mx-auto flex justify-center">
    {#if !localAutoScroll && messages.length > 0}
      <div class="flex justify-center mb-4">
        <button
          class="bg-white border border-gray-100 dark:bg-white/20 dark:border-none p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm"
          aria-label={UI_STRINGS.scrollToBottom}
          on:click={() => {
            dispatch("updateAutoScroll", true);
            // Do not mutate prop directly
            // localAutoScroll = true; // local state will update via prop
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            });
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
              placeholder={UI_STRINGS.placeholder}
              bind:value={prompt}
              use:autoResize
              on:keypress={(e) => {
                if (e.keyCode == 13 && !e.shiftKey) {
                  e.preventDefault();
                }
                if (prompt !== "" && e.keyCode == 13 && !e.shiftKey) {
                  submitPrompt(prompt);
                }
              }}
              rows="1"
            />
            <div class="flex space-x-0.5 mb-2 mr-2">
              {#if messages.length === 0 || messages.at(-1)?.done === true}
                <button
                  class="bg-white border border-gray-100 dark:bg-white/20 dark:border-none p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm"
                  on:click|preventDefault={() => {
                    // Dispatch event to parent to update autoScroll
                    dispatch("updateAutoScroll", true);
                    window.scrollTo({
                      top: document.body.scrollHeight,
                      behavior: "smooth",
                    });
                  }}
                >
                  {UI_STRINGS.send}
                </button>
              {:else if messages.length > 0 && messages.at(-1)?.done === false}
                <button
                  class="bg-white hover:bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-800 transition rounded-lg p-1.5 text-sm"
                  on:click={stopResponse}
                >
                  {UI_STRINGS.stop}
                </button>
              {/if}
            </div>
          </div>
        </form>
        <div class="mt-1.5 text-xs text-gray-500 text-center">
          {UI_STRINGS.warning}
        </div>
      </div>
    </div>
  </div>
</div>
