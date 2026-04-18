<script lang="ts">
	import { tick } from 'svelte';
	import type { Message } from '$lib/types';

	let messages = $state<Message[]>([]);
	let inputValue = $state('');
	let isStreaming = $state(false);
	let messagesEl = $state<HTMLElement | undefined>(undefined);
	let inputEl = $state<HTMLTextAreaElement | undefined>(undefined);
	let abortController = $state<AbortController | undefined>(undefined);

	function stopStream() {
		abortController?.abort();
	}

	async function scrollToBottom() {
		await tick();
		if (messagesEl) {
			messagesEl.scrollTop = messagesEl.scrollHeight;
		}
	}

	function generateId() {
		return Math.random().toString(36).slice(2);
	}

	async function sendMessage() {
		const content = inputValue.trim();
		if (!content || isStreaming) return;

		inputValue = '';
		resizeInput();

		const userMessage: Message = {
			id: generateId(),
			role: 'user',
			content,
			timestamp: Date.now()
		};
		messages = [...messages, userMessage];
		await scrollToBottom();

		const assistantId = generateId();
		messages = [...messages, {
			id: assistantId,
			role: 'assistant',
			content: '',
			timestamp: Date.now()
		}];
		isStreaming = true;
		abortController = new AbortController();

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				signal: abortController.signal,
				body: JSON.stringify({
					messages: messages
						.slice(0, -1)
						.map(({ role, content }) => ({ role, content }))
				})
			});

			if (!response.ok) {
				const err = await response.text();
				throw new Error(`${response.status}: ${err}`);
			}

			const reader = response.body!.getReader();
			const decoder = new TextDecoder();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				const text = decoder.decode(value, { stream: true });
				messages = messages.map((m) =>
					m.id === assistantId ? { ...m, content: m.content + text } : m
				);
				await scrollToBottom();
			}
		} catch (e) {
			if (e instanceof Error && e.name === 'AbortError') {
				// user stopped — keep whatever text arrived, no error message
			} else {
				console.error('Chat error:', e);
				messages = messages.map((m) =>
					m.id === assistantId
						? { ...m, content: String(e) }
						: m
				);
			}
		} finally {
			isStreaming = false;
			abortController = undefined;
			await tick();
			inputEl?.focus();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}

	function resizeInput() {
		if (!inputEl) return;
		inputEl.style.height = 'auto';
		inputEl.style.height = Math.min(inputEl.scrollHeight, 160) + 'px';
	}

	const lastMessage = $derived(messages[messages.length - 1]);
</script>

<svelte:head>
	<title>Bearings</title>
</svelte:head>

<div class="flex flex-col h-screen bg-ink-900">
	<!-- Header -->
	<header class="flex-none px-6 py-5 border-b border-ink-800">
		<h1 class="text-ink-300 text-sm tracking-widest uppercase font-sans font-light">Bearings</h1>
	</header>

	<!-- Message list -->
	<main
		bind:this={messagesEl}
		class="flex-1 overflow-y-auto px-4 py-8"
	>
		<div class="max-w-2xl mx-auto space-y-8">
			{#if messages.length === 0}
				<div class="text-center mt-24">
					<p class="text-ink-400 text-lg italic leading-relaxed">
						What's something you've been reaching for lately that isn't quite working?
					</p>
				</div>
			{/if}

			{#each messages as message (message.id)}
				<div
					class="flex gap-4"
					class:justify-end={message.role === 'user'}
				>
					{#if message.role === 'assistant'}
						<div class="flex-1 min-w-0">
							<div class="text-ink-200 leading-relaxed text-base whitespace-pre-wrap">
								{#if message.content === '' && isStreaming}
									<span class="inline-block w-1.5 h-4 bg-ink-400 animate-pulse rounded-sm" />
								{:else}
									{message.content}{#if isStreaming && message === lastMessage}<span class="inline-block w-1.5 h-4 bg-ink-400 animate-pulse rounded-sm ml-0.5 align-middle" />{/if}
								{/if}
							</div>
						</div>
					{:else}
						<div class="max-w-lg">
							<div class="bg-ink-800 rounded-2xl rounded-tr-sm px-4 py-3 text-ink-200 leading-relaxed text-base whitespace-pre-wrap">
								{message.content}
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</main>

	<!-- Input -->
	<footer class="flex-none px-4 pb-6 pt-2">
		<div class="max-w-2xl mx-auto">
			<div class="flex items-end gap-3 bg-ink-800 rounded-2xl px-4 py-3 border border-ink-700 focus-within:border-ink-500 transition-colors">
				<textarea
					bind:this={inputEl}
					bind:value={inputValue}
					onkeydown={handleKeydown}
					oninput={resizeInput}
					placeholder="Say something…"
					rows="1"
					disabled={isStreaming}
					class="flex-1 bg-transparent text-ink-200 placeholder-ink-600 resize-none outline-none text-base leading-relaxed font-serif min-h-[1.5rem] max-h-40 disabled:opacity-50"
				></textarea>
				<button
					onclick={sendMessage}
					disabled={!inputValue.trim() || isStreaming}
					class="flex-none w-8 h-8 rounded-full flex items-center justify-center transition-all
						{inputValue.trim() && !isStreaming
							? 'bg-ink-400 text-ink-900 hover:bg-ink-300'
							: 'bg-ink-700 text-ink-600 cursor-not-allowed'}"
					aria-label="Send"
				>
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M7 12V2M7 2L3 6M7 2L11 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</div>
			<p class="text-center text-ink-700 text-xs mt-3 font-sans">
				Return to send · Shift+Return for new line
			</p>
		</div>
	</footer>
</div>
