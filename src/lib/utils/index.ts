// Import the v4 function from the uuid library to generate unique IDs.
import { v4 as uuidv4 } from "uuid";

//////////////////////////
// Helper functions
//////////////////////////


/**
 * Creates a new TransformStream that splits its input stream on a specified delimiter.
 *
 * @param {string} splitOn - The delimiter to split the input stream on.
 */
export const splitStream = (splitOn) => {
	// Initialize an empty buffer to store chunks of data.
	let buffer = "";

	// Return a new TransformStream that splits its input stream.
	return new TransformStream({
		/**
		 * The transform function is called for each chunk of data in the input stream.
		 *
		 * @param {Buffer} chunk - The current chunk of data.
		 * @param {AbortController} controller - The AbortController used to cancel the stream.
		 */
		transform(chunk, controller) {
			// Append the current chunk to the buffer.
			buffer += chunk;

			// Split the buffer into parts based on the delimiter.
			const parts = buffer.split(splitOn);

			// Enqueue each part in the output stream, except for the last one.
			parts.slice(0, -1).forEach((part) => controller.enqueue(part));

			// Update the buffer to be the last part.
			buffer = parts[parts.length - 1];
		},

		/**
		 * The flush function is called when there are no more chunks of data in the input stream.
		 *
		 * @param {AbortController} controller - The AbortController used to cancel the stream.
		 */
		flush(controller) {
			// Enqueue any remaining buffer data.
			if (buffer) controller.enqueue(buffer);
		}
	});
};

/**
 * Converts an array of messages into a tree-like structure where each message has children IDs.
 *
 * @param {object[]} messages - The array of messages to convert.
 * @returns {object} The converted tree-like structure of messages.
 */
export const convertMessagesToHistory = (messages) => {
	// Initialize the history object with an empty messages object and a null current ID.
	let history = {
		messages: {},
		currentId: null
	};

	// Initialize variables to keep track of the parent and child IDs.
	let parentMessageId = null;
	let messageId = null;

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

/**
 * Copies text to the clipboard using either the navigator.clipboard API or a fallback method.
 *
 * @param {string} text - The text to copy to the clipboard.
 */
const copyToClipboard = (text) => {
	if (!navigator.clipboard) {
		// Create a temporary textarea element to hold the text to be copied.
		var textArea = document.createElement("textarea");
		textArea.value = text;

		// Avoid scrolling to bottom and position the textarea fixed at the top left of the page.
		textArea.style.top = "0";
		textArea.style.left = "0";
		textArea.style.position = "fixed";

		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			// Try to copy the text using the navigator.clipboard API.
			var successful = document.execCommand("copy");
			var msg = successful ? "successful" : "unsuccessful";
			console.log("Copying text command was " + msg);
		} catch (err) {
			// If the navigator.clipboard API fails, try a fallback method to copy the text.
			console.error("Unable to copy", err);
		}

		document.body.removeChild(textArea);
		return;
	}
	navigator.clipboard.writeText(text).then(
		function () {
			console.log("Copying to clipboard was successful");
		},
		function (err) {
			console.error("Could not copy text: ", err);
		}
	);
};
