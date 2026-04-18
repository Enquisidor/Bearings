import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from '$lib/system-prompt';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
	const platformEnv = platform as { env?: Record<string, string> } | undefined;
	const apiKey = platformEnv?.env?.ANTHROPIC_API_KEY ?? env.ANTHROPIC_API_KEY;

	if (!apiKey) {
		throw error(500, 'API key not configured');
	}

	const { messages } = await request.json();

	if (!Array.isArray(messages)) {
		throw error(400, 'messages must be an array');
	}

	const client = new Anthropic({ apiKey });

	const stream = await client.messages.stream({
		model: 'claude-opus-4-7',
		max_tokens: 2048,
		system: SYSTEM_PROMPT,
		messages
	});

	const encoder = new TextEncoder();

	const readable = new ReadableStream({
		async start(controller) {
			try {
				for await (const chunk of stream) {
					if (
						chunk.type === 'content_block_delta' &&
						chunk.delta.type === 'text_delta'
					) {
						controller.enqueue(encoder.encode(chunk.delta.text));
					}
				}
			} catch (e) {
				const msg = e instanceof Error ? e.message : String(e);
				console.error('Stream error:', msg);
				controller.enqueue(encoder.encode(`\n\n[stream error: ${msg}]`));
			} finally {
				controller.close();
			}
		},
		cancel() {
			stream.abort();
		}
	});

	return new Response(readable, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'no-cache',
			'X-Content-Type-Options': 'nosniff'
		}
	});
};
