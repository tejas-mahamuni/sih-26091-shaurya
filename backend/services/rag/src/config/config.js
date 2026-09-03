require("dotenv").config();

const config = {
  server: {
    port: Number(process.env.PORT) || 3000,
  },

  ollama: {
    baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",

    chatModel: process.env.OLLAMA_CHAT_MODEL || "llama3.2:3b",

    embeddingModel: process.env.OLLAMA_EMBEDDING_MODEL || "embeddinggemma",
  },

  qdrant: {
    url: process.env.QDRANT_URL || "http://localhost:6333",

    collection: process.env.QDRANT_COLLECTION || "rag_documents",
  },

  rag: {
    chunkSize: Number(process.env.CHUNK_SIZE) || 800,

    chunkOverlap: Number(process.env.CHUNK_OVERLAP) || 150,

    topK: Number(process.env.TOP_K) || 5,
  },

  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
  }
};

module.exports = config;
