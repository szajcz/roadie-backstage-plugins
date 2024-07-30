import {
  DefaultVectorAugmentationIndexer,
  RoadieEmbeddingsConfig,
} from '@roadiehq/rag-ai-backend-retrieval-augmenter';
import { AzureOpenAIEmbeddings, OpenAIEmbeddings } from '@langchain/openai';

export type AzureOpenAiConfig = {
  apiKey?: string;
  apiVersion?: string;
  deploymentName?: string;
  basePath?: string;
};

export class RoadieAzureOpenAiAugmenter extends DefaultVectorAugmentationIndexer {
  constructor(
    config: RoadieEmbeddingsConfig & {
      azureOpenAiConfig: AzureOpenAiConfig;
    },
  ) {
    // config.logger.info(
    //   `Azure OpenAI config: ${JSON.stringify(config.azureOpenAiConfig)}`,
    // );
    const embeddings = new AzureOpenAIEmbeddings({
      azureOpenAIApiEmbeddingsDeploymentName: 'gpt-4-1106-preview',
      azureOpenAIApiDeploymentName: 'gpt-4-1106-preview',
      azureOpenAIApiKey: config.azureOpenAiConfig.apiKey,
      azureOpenAIApiVersion: '2024-02-15-preview',
      azureOpenAIBasePath: 'https://models.assistant.legogroup.io/',
    });

    super({ ...config, embeddings });
  }
}

// const embeddings = new OpenAIEmbeddings({
//   azureOpenAIApiKey: config.azureOpenAiConfig.apiKey,
//   azureOpenAIApiVersion: '2024-02-15-preview',
//   azureOpenAIBasePath: 'https://models.assistant.legogroup.io/',
//   azureOpenAIApiDeploymentName: 'gpt-4-1106-preview',
// });

// const embeddings = new AzureOpenAIEmbeddings({
//   azureOpenAIApiKey: 'KEY',
//   azureOpenAIApiVersion: '2024-02-15-preview',
//   azureOpenAIApiDeploymentName: 'gpt-4-1106-preview',
//   azureOpenAIBasePath: 'https://models.assistant.legogroup.io/',
// });
