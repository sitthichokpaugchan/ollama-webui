import { writable } from "svelte/store";

// Frontend
export const db = writable<any>(undefined);
export const chatId = writable("");
export const chats = writable([]);
export const models = writable([]);
export const settings = writable({});
export const showSettings = writable(false);
