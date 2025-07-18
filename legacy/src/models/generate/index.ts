export interface GenerateUsage {
  outputTokens: number;
}

export interface GenerateOpenEndedTextResult {
  id: string;
  data: string;
  usage?: GenerateUsage;
}

export interface GenerateSummarizeChapterResult {
  chapterNumber: number;
  start: number;
  end: number;
  chapterTitle: string;
  chapterSummary: string;
}

export interface GenerateSummarizeHighlightResult {
  start: number;
  end: number;
  highlight: string;
  highlightSummary: string;
}

export interface GenerateSummarizeResult {
  id: string;
  summary?: string;
  chapters?: GenerateSummarizeChapterResult[];
  highlights?: GenerateSummarizeHighlightResult[];
  usage?: GenerateUsage;
}

export interface GenerateGistResult {
  id: string;
  title?: string;
  topics?: string[];
  hashtags?: string[];
  usage?: GenerateUsage;
}

export class GenerateTextStreamResult {
  id: string;
  texts: string[] = [];
  aggregatedText: string = '';
  private stream: ReadableStream;

  constructor(stream: ReadableStream) {
    this.stream = stream;
    this.id = '';
  }

  async *[Symbol.asyncIterator]() {
    const reader = this.stream.getReader();
    const decoder = new TextDecoder('utf-8');
    let chunk = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        // Decode the current chunk and concatenate it to the previous chunks
        chunk += decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        // Store the last incomplete line back into chunk
        chunk = lines.pop()!;

        for (const line of lines) {
          if (!line) continue;
          const event = JSON.parse(line);

          switch (event.event_type) {
            case 'stream_start':
              this.id = event.metadata?.generation_id || '';
              break;
            case 'stream_error':
              throw new Error(event.error.message);
            case 'text_generation':
              this.texts.push(event.text);
              this.aggregatedText += event.text;
              yield event.text;
              break;
            case 'stream_end':
            default:
              break;
          }
        }
      }
    }

    // Process any remaining chunk that wasn't completed in the loop
    if (chunk) {
      const event = JSON.parse(chunk);
      if (event.event_type === 'text_generation') {
        this.texts.push(event.text);
        this.aggregatedText += event.text;
        yield event.text;
      }
    }
  }
}
