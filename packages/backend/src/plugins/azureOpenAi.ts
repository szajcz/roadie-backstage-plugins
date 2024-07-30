import { createApiRoutes as initializeRagAiBackend } from '@roadiehq/rag-ai-backend';
import { PluginEnvironment } from '../types';
import { initializeAzureOpenAiEmbeddings } from '@roadiehq/rag-ai-backend-embeddings-azure-openai';
import { createRoadiePgVectorStore } from '@roadiehq/rag-ai-storage-pgvector';
import { createDefaultRetrievalPipeline } from '@roadiehq/rag-ai-backend-retrieval-augmenter';
import { OpenAI } from '@langchain/openai';
import { CatalogClient } from '@backstage/catalog-client';

export default async function createPlugin(env: PluginEnvironment) {
  const catalogApi = new CatalogClient({
    discoveryApi: env.discovery,
  });

  const database = env.database;
  const config = env.config;
  const logger = env.logger;
  const discovery = env.discovery;
  const tokenManager = env.tokenManager;
  const vectorStore = await createRoadiePgVectorStore({
    logger,
    database,
    config,
  });

  const augmentationIndexer = await initializeAzureOpenAiEmbeddings({
    logger,
    catalogApi,
    vectorStore,
    discovery,
    config,
    tokenManager,
  });
  logger.info(`augmentationIndexer: ${JSON.stringify(augmentationIndexer)}`);

  const model = new OpenAI();
  const ragAi = await initializeRagAiBackend({
    logger,
    augmentationIndexer,
    retrievalPipeline: createDefaultRetrievalPipeline({
      discovery,
      logger,
      vectorStore: augmentationIndexer.vectorStore,
      tokenManager,
    }),
    model,
    config,
    tokenManager,
  });

  return ragAi.router;
}
