function cleanText(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

  let cleaned = text;

  // Normalize line endings
  cleaned = cleaned.replace(/\r\n/g, "\n");
  cleaned = cleaned.replace(/\r/g, "\n");

  // Remove excessive spaces and tabs
  cleaned = cleaned.replace(/[ \t]+/g, " ");

  // Remove spaces at the beginning/end of lines
  cleaned = cleaned
    .split("\n")
    .map((line) => line.trim())
    .join("\n");

  // Replace more than two consecutive newlines
  // with a single paragraph break
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  // Fix spaces before punctuation
  cleaned = cleaned.replace(/\s+([,.!?;:])/g, "$1");

  // Remove leading/trailing whitespace
  cleaned = cleaned.trim();

  return cleaned;
}

module.exports = {
  cleanText,
};
