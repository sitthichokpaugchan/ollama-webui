import { v4 as uuidv4 } from "uuid";

export interface Message {
    id: string;
    parentId: string | null;
    childrenIds: string[];
    content: string;
    role: 'user' | 'assistant';
    model?: string; // Add model property
    files?: { type: string; url: string }[]; // Add files property
    edit?: boolean; // Add edit property
    originalContent?: string; // Add originalContent property
    editedContent?: string; // Add editedContent property
    done?: boolean; // Add done property
    error?: boolean; // Add error property
}

export interface History {
    messages: { [key: string]: Message };
    currentId: string | null;
}

/**
 * Converts an array of messages into a tree-like structure where each message has children IDs.
 *
 * @param {Omit<Message, 'id' | 'parentId' | 'childrenIds'>[]} messages - The array of messages to convert.
 * @returns {History} The converted tree-like structure of messages.
 */
export const convertMessagesToHistory = (messages: Omit<Message, 'id' | 'parentId' | 'childrenIds'>[]): History => {
	// Initialize the history object with an empty messages object and a null current ID.
	let history: History = {
		messages: {},
		currentId: null
	};

	// Initialize variables to keep track of the parent and child IDs.
	let parentMessageId: string | null = null;
	let messageId: string | null = null;

	// Iterate over each message in the input array.
	for (const message of messages) {
		// Generate a new ID for the message.
		messageId = uuidv4();

		// If there is a parent message, add the current message's ID to the parent's children IDs list.
		if (parentMessageId !== null) {
			history.messages[parentMessageId].childrenIds = [
				...history.messages[parentMessageId].childrenIds,
				messageId
			];
		}

		// Create a new message object with the generated ID and add it to the messages object.
		history.messages[messageId] = {
			...message,
			id: messageId,
			parentId: parentMessageId,
			childrenIds: []
		};

		// Update the parent ID to be the current message's ID.
		parentMessageId = messageId;
	}

	// Set the current ID of the history object to the last generated ID.
	history.currentId = messageId;

	// Return the converted tree-like structure of messages.
	return history;
};