const { generateEmbedding } = require("../embeddings/embeddingService");

const { searchVectors } = require("../vector/qdrantService");

const config = require("../config/config");

async function retrieveRelevantChunks(question) {
  if (!question || typeof question !== "string") {
    throw new Error("Question is required");
  }

  console.log("\nRetrieving relevant chunks...");

  // --------------------------------
  // 1. Convert question into vector
  // --------------------------------

  const queryVector = await generateEmbedding(question);

  // --------------------------------
  // 2. Search Qdrant
  // --------------------------------

  const results = await searchVectors(queryVector, config.rag.topK);

  // --------------------------------
  // 3. Convert Qdrant results
  //    into simpler objects
  // --------------------------------

  const chunks = results.map((result) => {
    return {
      score: result.score,

      text: result.payload?.text || "",

      source: result.payload?.source || "unknown",

      chunkIndex: result.payload?.chunkIndex ?? null,
    };
  });

  console.log(`Retrieved ${chunks.length} relevant chunks.`);

  return chunks;
}

module.exports = {
  retrieveRelevantChunks,
};
