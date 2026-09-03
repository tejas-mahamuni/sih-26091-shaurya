const config = require("../../../config/config");

function chunkText(text) {
  if (!text || typeof text !== "string") {
    return [];
  }

  const chunkSize = config.rag.chunkSize;
  const chunkOverlap = config.rag.chunkOverlap;

  if (chunkOverlap >= chunkSize) {
    throw new Error("CHUNK_OVERLAP must be smaller than CHUNK_SIZE");
  }

  const chunks = [];

  let start = 0;

  while (start < text.length) {
    let end = start + chunkSize;

    // If we haven't reached the end,
    // try to break at a paragraph boundary.
    if (end < text.length) {
      const paragraphBreak = text.lastIndexOf("\n\n", end);

      if (paragraphBreak > start + chunkSize * 0.5) {
        end = paragraphBreak;
      } else {
        // Otherwise try to break at a sentence boundary.
        const sentenceBreak = text.lastIndexOf(". ", end);

        if (sentenceBreak > start + chunkSize * 0.5) {
          end = sentenceBreak + 1;
        }
      }
    }

    const chunk = text.slice(start, end).trim();

    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    // Stop if we've reached the end
    if (end >= text.length) {
      break;
    }

    // Move forward while keeping overlap
    start = end - chunkOverlap;
  }

  return chunks;
}

module.exports = {
  chunkText,
};
