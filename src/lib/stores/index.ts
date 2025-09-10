import { writable, type Writable } from "svelte/store";

export interface Chat {
    id: string;
    title: string;
}

export interface ChatDatabase {
    getChats(): Promise<Chat[]>;
    updateChatById(id: string, updates: { title?: string }): Promise<void>;
    deleteChatById(id: string): Promise<void>;
}

export const db: Writable<ChatDatabase | undefined> = writable(undefined);
export const chatId: Writable<string> = writable("");
export const chats: Writable<Chat[]> = writable([]);
export const models = writable([]);
export const settings = writable({});
export const showSettings = writable(false);