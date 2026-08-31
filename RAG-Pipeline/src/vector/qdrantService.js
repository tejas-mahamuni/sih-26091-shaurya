const { QdrantClient } = require("@qdrant/js-client-rest");
const config = require("../config/config");

const qdrantUrl = new URL(config.qdrant.url);

const client = new QdrantClient({
  host: qdrantUrl.hostname,
  port: Number(qdrantUrl.port) || 6333,
  https: qdrantUrl.protocol === "https:",
});

async function collectionExists() {
  try {
    await client.getCollection(config.qdrant.collection);
    return true;
  } catch (error) {
    return false;
  }
}

async function createCollection(vectorSize) {
  const exists = await collectionExists();

  if (exists) {
    console.log(
      `Qdrant collection "${config.qdrant.collection}" already exists.`,
    );

    return;
  }

  await client.createCollection(config.qdrant.collection, {
    vectors: {
      size: vectorSize,
      distance: "Cosine",
    },
  });

  console.log(`Created Qdrant collection "${config.qdrant.collection}".`);

  console.log(`Vector size: ${vectorSize}`);
}

async function upsertPoints(points) {
  if (!Array.isArray(points) || points.length === 0) {
    return;
  }

  await client.upsert(config.qdrant.collection, {
    wait: true,
    points,
  });

  console.log(`Stored ${points.length} points in Qdrant.`);
}

async function searchVectors(vector, limit = config.rag.topK) {
  if (!Array.isArray(vector) || vector.length === 0) {
    throw new Error("Query vector is required");
  }

  const result = await client.query(config.qdrant.collection, {
    query: vector,
    limit,
    with_payload: true,
  });

  return result.points || [];
}

async function getCollectionInfo() {
  return client.getCollection(config.qdrant.collection);
}

module.exports = {
  client,
  collectionExists,
  createCollection,
  upsertPoints,
  searchVectors,
  getCollectionInfo,
};
