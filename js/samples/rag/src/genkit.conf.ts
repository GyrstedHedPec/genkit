import { getProjectId } from '@google-genkit/common';
import { configureGenkit } from '@google-genkit/common/config';
import { googleGenAI } from '@google-genkit/plugin-google-genai';
import { firebase } from '@google-genkit/plugin-firebase';
import { pinecone } from '@google-genkit/plugin-pinecone';
import { geminiPro, vertexAI } from '@google-genkit/plugin-vertex-ai';
import { chroma } from '@google-genkit/plugin-chroma';
import { RagasMetric, ragas } from '@google-genkit/plugin-ragas';
import {
  googleVertexAI,
  textEmbeddingGecko001,
} from '@google-genkit/providers/google-vertexai';
import { gpt4, openAI } from '@google-genkit/plugin-openai';
import { devLocalVectorstore } from '@google-genkit/plugin-dev-local-vectorstore';

export default configureGenkit({
  plugins: [
    firebase({ projectId: getProjectId() }),
    googleGenAI(),
    googleVertexAI(),
    openAI(),
    ragas({ judge: gpt4, metrics: [RagasMetric.FAITHFULNESS] }),
    vertexAI({ projectId: getProjectId(), location: 'us-central1' }),
    pinecone([
      {
        indexId: 'tom-and-jerry',
        embedder: textEmbeddingGecko001,
        embedderOptions: { temperature: 0 },
      },
      {
        indexId: 'pdf-chat',
        embedder: textEmbeddingGecko001,
        embedderOptions: { temperature: 0 },
      },
    ]),
    chroma({
      collectionName: 'spongebob_collection',
      embedder: textEmbeddingGecko001,
      embedderOptions: { temperature: 0 },
    }),
    devLocalVectorstore([
      {
        indexName: 'spongebob-facts',
        embedder: textEmbeddingGecko001,
        embedderOptions: { temperature: 0 },
      },
      {
        indexName: 'pdfQA',
        embedder: textEmbeddingGecko001,
        embedderOptions: { temperature: 0 },
      },
    ]),
  ],
  flowStateStore: 'firebase',
  traceStore: 'firebase',
  enableTracingAndMetrics: true,
  logLevel: 'debug',
});