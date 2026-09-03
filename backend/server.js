require("dotenv").config();

const express = require("express");

const config = require("./src/config/config");

const { ingestPdf } = require("./src/services/rag/ingestion/ingestionService");

const { retrieveRelevantChunks } = require("./src/services/rag/retrieval/retrievalService");

const { generateAnswer } = require("./src/services/rag/llm/ollamaService");

const { getCollectionInfo } = require("./src/services/rag/vector/qdrantService");

const app = express();

app.use(express.json());

// ========================================
// Health Check
// ========================================

app.get("/", (req, res) => {
  res.json({
    message: "RAG API is running",
  });
});

// ========================================
// Health / Infrastructure Check
// ========================================

app.get("/api/health", async (req, res) => {
  try {
    const collection = await getCollectionInfo();

    res.json({
      status: "ok",

      ollama: {
        baseUrl: config.ollama.baseUrl,
        chatModel: config.ollama.chatModel,
        embeddingModel: config.ollama.embeddingModel,
      },

      qdrant: {
        url: config.qdrant.url,
        collection: config.qdrant.collection,
        status: collection.status,
      },
    });
  } catch (error) {
    res.status(503).json({
      status: "error",

      message: "Qdrant collection is not available yet.",

      error: error.message,
    });
  }
});

// ========================================
// PDF Ingestion
// ========================================

app.post("/api/ingest", async (req, res) => {
  try {
    const { file } = req.body;

    if (!file) {
      return res.status(400).json({
        error: "File path is required",
      });
    }

    console.log(`\nIngesting: ${file}`);

    const result = await ingestPdf(file);

    res.json({
      success: true,

      message: "PDF ingested successfully",

      result,
    });
  } catch (error) {
    console.error("Ingestion error:", error);

    res.status(500).json({
      success: false,

      error: error.message,
    });
  }
});

// ========================================
// Ask Question
// ========================================

app.post("/api/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        error: "Question is required",
      });
    }

    console.log(`\nQuestion: ${question}`);

    // -------------------------------
    // Retrieval
    // -------------------------------

    const chunks = await retrieveRelevantChunks(question);

    if (chunks.length === 0) {
      return res.json({
        answer:
          "I could not find relevant information in the provided documents.",

        sources: [],
      });
    }

    // -------------------------------
    // Generation
    // -------------------------------

    const result = await generateAnswer(question, chunks);

    // -------------------------------
    // Response
    // -------------------------------

    res.json({
      success: true,

      question,

      answer: result.answer,

      model: result.model,

      sources: chunks.map((chunk) => ({
        source: chunk.source,

        chunkIndex: chunk.chunkIndex,

        score: chunk.score,
      })),
    });
  } catch (error) {
    console.error("Question answering error:", error);

    res.status(500).json({
      success: false,

      error: error.message,
    });
  }
});

// ========================================
// Start Server
// ========================================

app.listen(config.server.port, () => {
  console.log(`
========================================
       LOCAL RAG SERVER
========================================

Server:
http://localhost:${config.server.port}

Ollama:
${config.ollama.baseUrl}

Chat Model:
${config.ollama.chatModel}

Embedding Model:
${config.ollama.embeddingModel}

Qdrant:
${config.qdrant.url}

Collection:
${config.qdrant.collection}

========================================
`);
});
