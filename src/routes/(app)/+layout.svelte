<script lang="ts">
  // นำเข้าไลบรารีและคอมโพเนนต์ที่จำเป็น
  import { v4 as uuidv4 } from "uuid";
  import { openDB } from "idb";
  import { onMount, tick } from "svelte";
  import { goto } from "$app/navigation";
  import {
    showSettings,
    settings,
    models,
    db,
    chats,
    chatId,
  } from "$lib/stores";
  import SettingsModal from "$lib/components/chat/SettingsModal.svelte";
  import Sidebar from "$lib/components/layout/Sidebar.svelte";
  import toast from "svelte-french-toast";
  import { OLLAMA_API_BASE_URL } from "$lib/constants";

  // ฟังก์ชันสำหรับดึงรายการโมเดล
  const getModels = async () => {
    let models = [];
    const res = await fetch(`${OLLAMA_API_BASE_URL}/tags`, {
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
          toast.error("ไม่สามารถเชื่อมต่อ Ollama ได้\nโปรดตรวจสอบว่า Ollama กำลังทำงานอยู่บน http://localhost:11434");
        }
        return null;
      });
    console.log(res);
    models.push(...(res?.models ?? []));
    return models;
  };

  // ฟังก์ชันสำหรับเชื่อมต่อและจัดการ IndexedDB
  const getDB = async () => {
    const DB = await openDB("Chats", 1, {
      upgrade(db) {
        const store = db.createObjectStore("chats", {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("timestamp", "timestamp");
      },
    });
    return {
      db: DB,
      getChatById: async function (id) {
        return await this.db.get("chats", id);
      },
      getChats: async function () {
        let chats = await this.db.getAllFromIndex("chats", "timestamp");
        chats = chats.map((item, idx) => ({
          title: chats[chats.length - 1 - idx].title,
          id: chats[chats.length - 1 - idx].id,
        }));
        return chats;
      },
      exportChats: async function () {
        let chats = await this.db.getAllFromIndex("chats", "timestamp");
        chats = chats.map((item, idx) => chats[chats.length - 1 - idx]);
        return chats;
      },
      addChats: async function (_chats) {
        for (const chat of _chats) {
          console.log(chat);
          await this.addChat(chat);
        }
        await chats.set(await this.getChats());
      },
      addChat: async function (chat) {
        await this.db.put("chats", {
          ...chat,
        });
      },
      createNewChat: async function (chat) {
        await this.addChat({ ...chat, timestamp: Date.now() });
        await chats.set(await this.getChats());
      },
      updateChatById: async function (id, updated) {
        const chat = await this.getChatById(id);
        await this.db.put("chats", {
          ...chat,
          ...updated,
          timestamp: Date.now(),
        });
        await chats.set(await this.getChats());
      },
      deleteChatById: async function (id) {
        if ($chatId === id) {
          goto("/");
          await chatId.set(uuidv4());
        }
        await this.db.delete("chats", id);
        await chats.set(await this.getChats());
      },
    };
  };

  // เมื่อคอมโพเนนต์ถูก mount
  onMount(async () => {
    // โหลดการตั้งค่าจาก localStorage
    await settings.set(JSON.parse(localStorage.getItem("settings") ?? "{}"));
    // โหลดรายการโมเดล
    await models.set(await getModels());
    // เชื่อมต่อฐานข้อมูล
    let _db = await getDB();
    await db.set(_db);
    await tick();
    loaded = true;
  });
</script>

<div class="app relative">
  <div
    class="text-gray-700 bg-white min-h-screen overflow-auto flex flex-row pt-16 sm:pt-20"
  >
    <!-- แสดง Sidebar -->
    <Sidebar />
    <!-- แสดง Modal การตั้งค่า -->
    <SettingsModal bind:show={$showSettings} />
    <!-- แสดงเนื้อหาของหน้า -->
    <slot />
  </div>
</div>

<style>
  .loading {
    @apply inline-block animate-[loading_1s_steps_3_infinite];
    letter-spacing: -0.5px;
  }

  @keyframes loading {
    to {
      clip-path: inset(0 -1ch 0 0);
    }
  }

  pre[class*="language-"] {
    @apply relative overflow-auto my-2 p-4 rounded-lg;
  }
</style>
