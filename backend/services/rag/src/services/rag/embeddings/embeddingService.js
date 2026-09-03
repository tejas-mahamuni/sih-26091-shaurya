const config = require("../../../config/config");

async function generateEmbedding(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Text is required to generate an embedding");
  }

  try {
    const response = await fetch(`${config.ollama.baseUrl}/api/embed`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: config.ollama.embeddingModel,
        input: text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(`Ollama API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (!data.embeddings || !data.embeddings[0]) {
      throw new Error("Ollama returned no embedding");
    }

    return data.embeddings[0];
  } catch (error) {
    console.error("Embedding generation failed:", error.message);

    throw new Error("Failed to generate embedding");
  }
}

async function generateEmbeddings(texts) {
  if (!Array.isArray(texts) || texts.length === 0) {
    return [];
  }

  try {
    const response = await fetch(`${config.ollama.baseUrl}/api/embed`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: config.ollama.embeddingModel,
        input: texts,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(`Ollama API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (!data.embeddings) {
      throw new Error("Ollama returned no embeddings");
    }

    return data.embeddings;
  } catch (error) {
    console.error("Batch embedding generation failed:", error.message);

    throw new Error("Failed to generate embeddings");
  }
}

module.exports = {
  generateEmbedding,
  generateEmbeddings,
};
