/**
 * Copies text to the clipboard using either the navigator.clipboard API or a fallback method.
 *
 * @param {string} text - The text to copy to the clipboard.
 */
export const copyToClipboard = (text: string) => {
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