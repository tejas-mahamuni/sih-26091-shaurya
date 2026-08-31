const path = require("path");
const crypto = require("crypto");

const { loadPdf } = require("./pdfLoader");
const { cleanText } = require("./cleaner");
const { chunkText } = require("./chunker");

const { generateEmbeddings } = require("../embeddings/embeddingService");

const { createCollection, upsertPoints } = require("../vector/qdrantService");

function createPointId(source, chunkIndex, chunk) {
  const hash = crypto
    .createHash("md5")
    .update(`${source}:${chunkIndex}:${chunk}`)
    .digest("hex");

  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    hash.substring(12, 16),
    hash.substring(16, 20),
    hash.substring(20, 32),
  ].join("-");
}

async function ingestPdf(filePath) {
  console.log("\n=================================");
  console.log("STARTING PDF INGESTION");
  console.log("=================================\n");

  // --------------------------------
  // 1. Load PDF
  // --------------------------------

  const rawText = await loadPdf(filePath);

  console.log(`PDF text extracted: ${rawText.length} characters`);

  // --------------------------------
  // 2. Clean text
  // --------------------------------

  const cleanedText = cleanText(rawText);

  console.log(`Cleaned text: ${cleanedText.length} characters`);

  // --------------------------------
  // 3. Chunk text
  // --------------------------------

  const chunks = chunkText(cleanedText);

  console.log(`Created ${chunks.length} chunks`);

  if (chunks.length === 0) {
    throw new Error("No chunks were created from the PDF");
  }

  // --------------------------------
  // 4. Generate embeddings
  // --------------------------------

  console.log("Generating embeddings...");

  const embeddings = await generateEmbeddings(chunks);

  console.log(`Generated ${embeddings.length} embeddings`);

  // --------------------------------
  // 5. Create Qdrant collection
  // --------------------------------

  const vectorSize = embeddings[0].length;

  await createCollection(vectorSize);

  // --------------------------------
  // 6. Prepare Qdrant points
  // --------------------------------

  const source = path.basename(filePath);

  const points = chunks.map((chunk, index) => {
    return {
      id: createPointId(source, index, chunk),

      vector: embeddings[index],

      payload: {
        text: chunk,
        source,
        chunkIndex: index,
      },
    };
  });

  // --------------------------------
  // 7. Store vectors
  // --------------------------------

  await upsertPoints(points);

  console.log("\n=================================");
  console.log("INGESTION COMPLETE");
  console.log("=================================\n");

  return {
    source,
    chunks: chunks.length,
    embeddings: embeddings.length,
    vectorSize,
  };
}

module.exports = {
  ingestPdf,
};
