// นำเข้า writable และ Writable จาก svelte/store
import { writable, type Writable } from "svelte/store";

// กำหนด interface เพื่อความปลอดภัยของชนิดข้อมูลที่ดีขึ้น
export interface Chat {
    id: string;
    title: string;
    // เพิ่มคุณสมบัติอื่นๆ หากทราบ เช่น messages: Message[];
}

export interface ChatDatabase {
    getChats(): Promise<Chat[]>;
    updateChatById(id: string, updates: { title?: string }): Promise<void>;
    deleteChatById(id: string): Promise<void>;
    // เพิ่มเมธอดฐานข้อมูลอื่นๆ หากทราบ
}

// Frontend stores
export const db: Writable<ChatDatabase | undefined> = writable(undefined);
export const chatId: Writable<string> = writable("");
export const chats: Writable<Chat[]> = writable([]);
export const models = writable([]);
export const settings = writable({});
export const showSettings = writable(false);