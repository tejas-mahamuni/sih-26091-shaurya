const { generateEmbedding } = require("./src/embeddings/embeddingService");

async function main() {
  try {
    const text = "What is supervised learning?";

    const vector = await generateEmbedding(text);

    console.log("Embedding generated successfully.");

    console.log("Vector dimensions:", vector.length);

    console.log("First 10 values:");

    console.log(vector.slice(0, 10));
  } catch (error) {
    console.error(error);
  }
}

main();
