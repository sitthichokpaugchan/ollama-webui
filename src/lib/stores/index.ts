import { writable, type Writable } from "svelte/store";

// Define interfaces for better type safety
export interface Chat {
    id: string;
    title: string;
    // Add other properties if known, e.g., messages: Message[];
}

export interface ChatDatabase {
    getChats(): Promise<Chat[]>;
    updateChatById(id: string, updates: { title?: string }): Promise<void>;
    deleteChatById(id: string): Promise<void>;
    // Add other database methods if known
}

// Frontend stores
export const db: Writable<ChatDatabase | undefined> = writable(undefined);
export const chatId: Writable<string> = writable("");
export const chats: Writable<Chat[]> = writable([]);
export const models = writable([]);
export const settings = writable({});
export const showSettings = writable(false);
