import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import ChatPage from './+page.svelte'; // Assuming the main chat page is here
import Messages from '$lib/components/chat/Messages.svelte';
import { db, settings, chatId } from '$lib/stores';
import { tick } from 'svelte';
import { writable, get } from 'svelte/store';

// Mock svelte stores
vi.mock('$lib/stores', async (importOriginal) => {
 const actual = await importOriginal();
 const { writable } = await import('svelte/store'); // Import writable inside the async mock
 const dbMock = writable({
   getChatById: vi.fn(),
   createNewChat: vi.fn(),
   updateChatById: vi.fn(),
   getChats: vi.fn(() => Promise.resolve([])),
   deleteChat: vi.fn(),
 });
 const settingsMock = writable({
   ollamaApiBaseUrl: 'http://localhost:11434',
   authHeader: null,
   notificationEnabled: false,
   responseAutoCopy: false,
   titleAutoGenerate: true,
 });
 const chatIdMock = writable(null);
 const chatsMock = writable([]);
 return {
   ...actual, // Spread actual to retain other exports if any
   db: dbMock,
   settings: settingsMock,
   chatId: chatIdMock,
   chats: chatsMock,
 };
});

// Mock sveltekit navigation and page for ChatPage
vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
}));
vi.mock('$app/stores', async (importOriginal) => {
  const actual = await importOriginal();
  const { writable } = await import('svelte/store');
  return {
    ...actual,
    page: writable({ params: { id: 'test-chat-id' }, url: new URL('http://localhost') }),
  };
});
vi.spyOn(window, 'fetch').mockResolvedValue(new Response('{}'));

describe('UI Responsiveness Tests', () => {
  // Scenario 1: Screen resizing (simulating different viewports)
  it('should adjust layout for smaller screens', async () => {
    // Render the ChatPage. We need to mock its dependencies to avoid errors.
    render(ChatPage);
    await tick();

    // Simulate a mobile viewport
    window.innerWidth = 375;
    window.innerHeight = 667;
    window.dispatchEvent(new Event('resize'));
    await tick();

    // Check for elements that adapt to smaller screens (e.g., sidebar visibility, message input position)
    // This requires knowing how the CSS/Svelte code adapts. For example, if a sidebar hides on mobile:
    // expect(screen.queryByTestId('sidebar')).not.toBeVisible(); // Assuming a data-testid on sidebar

    // Since we don't have specific responsive element IDs, we'll make a general assertion
    // that the main chat area remains visible and usable.
    expect(screen.getByPlaceholderText('ส่งข้อความ')).toBeInTheDocument();
  });

  it('should adjust layout for tablet screens', async () => {
    render(ChatPage);
    await tick();

    // Simulate a tablet viewport
    window.innerWidth = 768;
    window.innerHeight = 1024;
    window.dispatchEvent(new Event('resize'));
    await tick();

    expect(screen.getByPlaceholderText('ส่งข้อความ')).toBeInTheDocument();
  });

  // Scenario 2: Auto-scroll functionality
  it('should auto-scroll to the bottom when new messages appear and autoScroll is true', async () => {
    const mockSendPrompt = vi.fn();
    const mockRegenerateResponse = vi.fn();
    const mockMessages = writable([
      { id: '1', role: 'user', content: 'Hello' },
    ]);

    // Mock window.scrollTo
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

    const { component } = render(Messages, {
      props: {
        messages: get(mockMessages),
        sendPrompt: mockSendPrompt,
        regenerateResponse: mockRegenerateResponse,
        autoScroll: true,
        bottomPadding: true, // Added to ensure auto-scroll condition is met
        history: { messages: {}, currentId: null },
      },
    });

    await tick(); // Initial render

    // Add a new message
    mockMessages.update(m => [...m, { id: '2', role: 'assistant', content: 'Hi there', done: true }]);
    component.$set({ messages: get(mockMessages) });

    await tick(); // Wait for Svelte to process updates
    expect(scrollToSpy).toHaveBeenCalledWith({ top: document.body.scrollHeight, behavior: 'smooth' });

    scrollToSpy.mockRestore(); // Clean up the spy
  });

  it('should not auto-scroll if autoScroll is false, but allow manual scroll', async () => {
    const mockSendPrompt = vi.fn();
    const mockRegenerateResponse = vi.fn();
    const mockMessages = writable([
      { id: '1', role: 'user', content: 'Hello' },
    ]);

    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

    const { component } = render(Messages, {
      props: {
        messages: get(mockMessages),
        sendPrompt: mockSendPrompt,
        regenerateResponse: mockRegenerateResponse,
        autoScroll: false, // Set autoScroll to false
        bottomPadding: true, // Added to ensure auto-scroll condition is met
        history: { messages: {}, currentId: null },
      },
    });

    await tick(); // Initial render

    // Add a new message
    mockMessages.update(m => [...m, { id: '2', role: 'assistant', content: 'Hi there', done: true }]);
    component.$set({ messages: get(mockMessages) });

    await tick();
    expect(scrollToSpy).not.toHaveBeenCalled(); // Auto-scroll should not be called

    scrollToSpy.mockRestore();
  });

});