/**
 * Creates a new TransformStream that splits its input stream on a specified delimiter.
 *
 * @param {string} splitOn - The delimiter to split the input stream on.
 */
export const splitStream = (splitOn: string) => {
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
