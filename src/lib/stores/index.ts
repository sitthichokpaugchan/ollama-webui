import { writable, type Writable } from "svelte/store";

import { Chat, ChatDatabase } from "$lib/infrastructure/chat-database";

// Frontend stores
export const db: Writable<ChatDatabase | undefined> = writable(undefined);
export const chatId: Writable<string> = writable("");
export const chats: Writable<Chat[]> = writable([]);
export const models: Writable<any[]> = writable([]);
export const settings = writable({});
export const showSettings = writable(false);
