const config = require("../config/config");

async function generateAnswer(question, retrievedChunks) {
  if (!question) {
    throw new Error("Question is required");
  }

  if (!Array.isArray(retrievedChunks)) {
    throw new Error("Retrieved chunks must be an array");
  }

  // =====================================
  // Build context
  // =====================================

  const context = retrievedChunks
    .map((chunk, index) => {
      return `
[Context ${index + 1}]

Source: ${chunk.source}
Chunk: ${chunk.chunkIndex}
Similarity Score: ${chunk.score}

${chunk.text}
`;
    })
    .join("\n-------------------------\n");

  // =====================================
  // Build RAG prompt
  // =====================================

  const prompt = `
You are a document question-answering assistant.

Answer the user's question using ONLY
the provided context.

Rules:

1. Do not use outside knowledge.
2. Do not invent information.
3. If the answer cannot be found in
   the context, say:

"I could not find the answer in the
provided documents."

4. Give a clear and concise answer.
5. Mention the source document when
   appropriate.

================ CONTEXT ================

${context}

================ QUESTION ===============

${question}

==========================================
`;

  // =====================================
  // Call Ollama
  // =====================================

  try {
    const response = await fetch(`${config.ollama.baseUrl}/api/chat`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: config.ollama.chatModel,

        messages: [
          {
            role: "system",

            content:
              "Answer questions strictly using the provided document context.",
          },

          {
            role: "user",

            content: prompt,
          },
        ],

        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(`Ollama API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    return {
      answer: data.message?.content || "",

      model: data.model || config.ollama.chatModel,
    };
  } catch (error) {
    console.error("LLM generation failed:", error.message);

    throw new Error("Failed to generate answer");
  }
}

module.exports = {
  generateAnswer,
};
