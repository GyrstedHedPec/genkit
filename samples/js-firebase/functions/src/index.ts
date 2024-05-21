import { generateStream } from '@genkit-ai/ai';
import { configureGenkit } from '@genkit-ai/core';
import { firebase } from '@genkit-ai/firebase';
import { noAuth, onFlow } from '@genkit-ai/firebase/functions';
import { geminiPro, vertexAI } from '@genkit-ai/vertexai';
import { Allow, parse } from 'partial-json';
import * as z from 'zod';

configureGenkit({
  plugins: [firebase(), vertexAI({ location: 'us-central1' })],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

const GameCharactersSchema = z.object({
  characters: z
    .array(
      z
        .object({
          name: z.string().describe('Name of a character'),
          abilities: z
            .array(z.string())
            .describe('Various abilities (strength, magic, archery, etc.)'),
        })
        .describe('Game character')
    )
    .describe('Characters'),
});

export const streamCharacters = onFlow(
  {
    name: 'streamCharacters',
    inputSchema: z.number(),
    outputSchema: z.string(),
    streamSchema: GameCharactersSchema,
    authPolicy: noAuth(),
    httpsOptions: {
      cors: '*'
    }
  },
  async (count, streamingCallback) => {
    if (!streamingCallback) {
      throw new Error('this flow only works in streaming mode');
    }

    const { response, stream } = await generateStream({
      model: geminiPro,
      output: {
        schema: GameCharactersSchema,
      },
      config: {
        temperature: 1,
      },
      prompt: `Respond as JSON only. Generate ${count} different RPG game characters.`,
    });

    let buffer = '';
    for await (const chunk of stream()) {
      buffer += chunk.content[0].text!;
      if (buffer.length > 10) {
        streamingCallback(parse(maybeStripMarkdown(buffer), Allow.ALL));
      }
    }

    return (await response()).text();
  }
);

const markdownRegex = /^\s*(```json)?((.|\n)*?)(```)?\s*$/i;
function maybeStripMarkdown(withMarkdown: string) {
  const mdMatch = markdownRegex.exec(withMarkdown);
  if (!mdMatch) {
    return withMarkdown;
  }
  return mdMatch[2];
}