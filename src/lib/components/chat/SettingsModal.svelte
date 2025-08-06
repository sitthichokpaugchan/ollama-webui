<script lang="ts">
  import Modal from "../common/Modal.svelte";
  import { OLLAMA_API_BASE_URL } from "$lib/constants";
  import toast from "svelte-french-toast";
  import { models, contextLength } from "$lib/stores";
  import { splitStream } from "$lib/utils";
  import { writable } from "svelte/store";
  export let show = false;
  let deleteModelTag = "";
  let contextLengths = ["4k", "8k", "16k", "32k", "64k", "128k"];
  let selectedContextLengthIndex = contextLengths.findIndex(
    (len) => parseInt(len) * 1000 === $contextLength
  );
  if (selectedContextLengthIndex === -1) {
    selectedContextLengthIndex = 0; // Fallback to 4k if current contextLength not found
  }

  $: contextLength.set(
    parseInt(contextLengths[selectedContextLengthIndex]) * 1000
  );

  // Temperature: Controls the randomness/creativity of the model's responses.
  // Higher values (e.g., 1.0-2.0) make responses more random and creative.
  // Lower values (e.g., 0.0-0.5) make responses more predictable and factual.
  export const temperature = writable(
    parseFloat(localStorage.getItem("temperature") || "0.8")
  );
  // Top-K: Limits the model's token selection to the 'K' most probable tokens.
  // Lower values make responses more specific; higher values increase diversity.
  export const topK = writable(parseInt(localStorage.getItem("topK") || "40"));
  // Top-P: Selects tokens from a cumulative probability distribution up to 'P'.
  // Lower values reduce diversity; higher values increase it.
  export const topP = writable(
    parseFloat(localStorage.getItem("topP") || "0.9")
  );
  // Repeat Penalty: Reduces the likelihood of the model repeating previous tokens.
  // Higher values (e.g., > 1.0) encourage more diverse output.
  export const repeatPenalty = writable(
    parseFloat(localStorage.getItem("repeatPenalty") || "1.1")
  );
  // Num Predict: Sets the number of tokens to predict.
  // Less tokens means faster responses, but might be cut off.
  // More tokens means slower responses, but might be more complete.
  export const numPredict = writable(
    parseInt(localStorage.getItem("numPredict") || "128")
  );
  // Stop: Sets the stop sequences to use.
  // When this sequence is encountered, the model will stop generating.
  export const stop = writable(
    localStorage.getItem("stop") || ""
  );
  $: {
    localStorage.setItem("temperature", String($temperature));
    console.log("Saving temperature:", $temperature);
  }
  $: {
    localStorage.setItem("topK", String($topK));
    console.log("Saving topK:", $topK);
  }
  $: {
    localStorage.setItem("topP", String($topP));
    console.log("Saving topP:", $topP);
  }
  $: {
    localStorage.setItem("repeatPenalty", String($repeatPenalty));
    console.log("Saving repeatPenalty:", $repeatPenalty);
  }
  $: {
    localStorage.setItem("numPredict", String($numPredict));
    console.log("Saving numPredict:", $numPredict);
  }
  $: {
    localStorage.setItem("stop", $stop);
    console.log("Saving stop:", $stop);
  }

  const resetParameters = () => {
    temperature.set(0.8);
    topK.set(40);
    topP.set(0.9);
    repeatPenalty.set(1.1);
    numPredict.set(128);
    stop.set("");
  };

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
  <div class="flex flex-col h-full">
    <div class="flex justify-between px-5 py-4 text-gray-700">
      <div class="text-lg font-medium self-center">การตั้งค่า</div>
      <button
        class="self-center text-sm p-1 rounded hover:bg-gray-100 transition"
        on:click={() => {
          show = false;
        }}
      >
        ปิด
      </button>
    </div>
    <hr class="border-gray-200" />
    <div class="flex-1 overflow-y-auto">
      <div class="flex flex-col md:flex-row w-full p-4 md:space-x-4">
        <div class="flex-1 md:min-h-[340px]">
          <div class="flex flex-col space-y-3 text-sm mb-10">
            <div>
              <div class="mb-2.5 text-sm font-medium">นำเข้าโมเดล</div>
              <div class="mt-2 text-xs text-gray-400">
                เพื่อเข้าถึงชื่อโมเดลที่มีให้ดาวน์โหลด
                <a
                  class="text-gray-500 font-medium"
                  href="https://ollama.ai/library"
                  target="_blank"
                >
                  คลิกที่นี่
                </a>
              </div>
            </div>
            <hr class="border-gray-200" />
            <div>
              <div class="mb-2.5 text-sm font-medium">ลบโมเดล</div>
              <div class="flex w-full">
                <div class="flex-1 mr-2">
                  <select
                    class="w-full rounded py-2 px-4 text-sm text-gray-700 bg-gray-50 outline-none"
                    bind:value={deleteModelTag}
                    placeholder="เลือกโมเดล"
                  >
                    {#if !deleteModelTag}
                      <option value="" disabled selected>เลือกโมเดล</option>
                    {/if}
                    {#each $models.filter((m) => m.size != null) as model}
                      <option value={model.name} class="bg-gray-100">
                        {model.name +
                          " (" +
                          (model.size / 1024 ** 3).toFixed(1) +
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
              <div class="mb-2.5 text-sm font-medium">Context Length</div>
              <div class="mt-2 text-xs text-gray-400">
                กำหนดความยาวบริบทการสนทนา LLM
                บนเครื่องของคุณที่สามารถจดจำและสร้างคำตอบได้
              </div>
              <div class="flex justify-between text-xs mt-2">
                {#each contextLengths as length, i}
                  <span
                    class={selectedContextLengthIndex === i ? "font-bold" : ""}
                    >{length}</span
                  >
                {/each}
              </div>
              <input
                type="range"
                min="0"
                max={contextLengths.length - 1}
                bind:value={selectedContextLengthIndex}
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div class="mb-4">
              <label
                for="temperature"
                class="block text-sm font-medium text-gray-700"
              >
                Temperature: {$temperature.toFixed(1)}
              </label>
              <input
                type="range"
                id="temperature"
                min="0"
                max="2"
                step="0.1"
                bind:value={$temperature}
                class="mt-1 block w-full"
              />
              <p class="mt-2 text-xs text-gray-400">
                ค่าที่สูงขึ้นทำให้โมเดลสร้างข้อความที่หลากหลายและคาดเดาได้ยากขึ้น
                (ความคิดสร้างสรรค์สูง)
                ในขณะที่ค่าที่ต่ำลงจะทำให้โมเดลสร้างข้อความที่ตรงไปตรงมาและคาดเดาได้ง่ายขึ้น
                (แม่นยำสูง)
              </p>
            </div>

            <div class="mb-4">
              <label for="topK" class="block text-sm font-medium text-gray-700">
                Top-K: {$topK}
              </label>
              <input
                type="range"
                id="topK"
                min="0"
                max="100"
                step="1"
                bind:value={$topK}
                class="mt-1 block w-full"
              />
              <p class="mt-2 text-xs text-gray-400">
                จำกัดการเลือกคำถัดไปของโมเดลให้อยู่ในจำนวนคำ (K)
                ที่มีความน่าจะเป็นสูงสุด
                ค่าที่ต่ำลงทำให้การตอบสนองเฉพาะเจาะจงขึ้น
                ในขณะที่ค่าที่สูงขึ้นจะเพิ่มความหลากหลาย
              </p>
            </div>

            <div class="mb-4">
              <label for="topP" class="block text-sm font-medium text-gray-700">
                Top-P: {$topP.toFixed(1)}
              </label>
              <input
                type="range"
                id="topP"
                min="0"
                max="1"
                step="0.1"
                bind:value={$topP}
                class="mt-1 block w-full"
              />
              <p class="mt-2 text-xs text-gray-400">
                เลือกคำจากชุดคำที่มีความน่าจะเป็นสะสมรวมกันถึงค่า (P) ที่กำหนด
                ค่าที่ต่ำลงลดความหลากหลาย
                ในขณะที่ค่าที่สูงขึ้นจะเพิ่มความหลากหลาย
              </p>
            </div>

            <div class="mb-4">
              <label
                for="repeatPenalty"
                class="block text-sm font-medium text-gray-700"
              >
                Repeat Penalty: {$repeatPenalty.toFixed(1)}
              </label>
              <input
                type="range"
                id="repeatPenalty"
                min="1"
                max="2"
                step="0.1"
                bind:value={$repeatPenalty}
                class="mt-1 block w-full"
              />
              <p class="mt-2 text-xs text-gray-400">
                ลดความน่าจะเป็นของคำที่โมเดลเคยสร้างขึ้นมาแล้ว
                เพื่อป้องกันไม่ให้โมเดลวนซ้ำคำหรือวลีเดิมๆ
                ค่าที่สูงขึ้นจะช่วยให้ข้อความหลากหลายขึ้น
              </p>
            </div>

            <div class="mb-4">
              <label
                for="numPredict"
                class="block text-sm font-medium text-gray-700"
              >
                Num Predict: {$numPredict}
              </label>
              <input
                type="range"
                id="numPredict"
                min="1"
                max="1024"
                step="1"
                bind:value={$numPredict}
                class="mt-1 block w-full"
              />
              <p class="mt-2 text-xs text-gray-400">
                ตั้งค่าจำนวนโทเค็นที่จะทำนาย
                จำนวนโทเค็นที่น้อยลงหมายถึงการตอบสนองที่เร็วขึ้น
                แต่อาจถูกตัดออก
                จำนวนโทเค็นที่มากขึ้นหมายถึงการตอบสนองที่ช้าลง
                แต่อาจสมบูรณ์มากขึ้น
              </p>
            </div>

            <div class="mb-4">
              <label for="stop" class="block text-sm font-medium text-gray-700">
                Stop: {$stop || "ไม่มี"}
              </label>
              <input
                type="text"
                id="stop"
                bind:value={$stop}
                placeholder="ป้อนลำดับการหยุด (เช่น <|im_end|>)"
                class="mt-1 block w-full rounded py-2 px-4 text-sm text-gray-700 bg-gray-50 outline-none"
              />
              <p class="mt-2 text-xs text-gray-400">
                กำหนดลำดับการหยุด
                เมื่อพบลำดับนี้ โมเดลจะหยุดสร้างข้อความ
              </p>
            </div>

            <div class="mt-6">
              <button
                class="w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg transition"
                on:click={resetParameters}
              >
                รีเซ็ตค่าเริ่มต้น
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</Modal>
