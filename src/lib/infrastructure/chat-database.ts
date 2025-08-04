export interface Chat {
    id: string;
    title: string;
    timestamp?: number;
    // Add other properties if known, e.g., messages: Message[];
}

export interface ChatDatabase {
    getChats(): Promise<Chat[]>;
    updateChatById(id: string, updates: { title?: string }): Promise<void>;
    deleteChatById(id: string): Promise<void>;
    // Add other database methods if known
}