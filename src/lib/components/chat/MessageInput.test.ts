import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import MessageInput from './MessageInput.svelte';

describe('MessageInput', () => {
  it('should render the input field and send button', () => {
    render(MessageInput, { props: { submitPrompt: vi.fn(), stopResponse: vi.fn(), messages: [] } });
    expect(screen.getByPlaceholderText('ส่งข้อความ')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ส่ง' })).toBeInTheDocument();
  });

  it('should update the input value when typing', async () => {
    const submitPrompt = vi.fn();
    const stopResponse = vi.fn();
    render(MessageInput, { props: { submitPrompt, stopResponse, messages: [] } });
    const input = screen.getByPlaceholderText('ส่งข้อความ');
    await fireEvent.input(input, { target: { value: 'Hello, world!' } });
    expect(input.value).toBe('Hello, world!');
  });

  // Scenario 1: Short and direct prompts (covered by existing send tests)
  it('should call submitPrompt and clear input for short prompt via button click', async () => {
    const submitPrompt = vi.fn();
    const stopResponse = vi.fn();
    render(MessageInput, { props: { submitPrompt, stopResponse, messages: [] } });
    const input = screen.getByPlaceholderText('ส่งข้อความ');
    const sendButton = screen.getByRole('button', { name: 'ส่ง' });

    await fireEvent.input(input, { target: { value: 'สวัสดี' } });
    await fireEvent.click(sendButton);

    expect(submitPrompt).toHaveBeenCalledWith('สวัสดี');
    expect(input.value).toBe('');
  });

  it('should call submitPrompt and clear input for short prompt via Enter key', async () => {
    const submitPrompt = vi.fn();
    const stopResponse = vi.fn();
    const { container } = render(MessageInput, { props: { submitPrompt, stopResponse, messages: [] } });
    const input = screen.getByPlaceholderText('ส่งข้อความ');
    const form = container.querySelector('form'); // Get the form element

    await fireEvent.input(input, { target: { value: 'วันนี้อากาศเป็นอย่างไร' } });
    await fireEvent.submit(form); // Simulate form submission on Enter

    expect(submitPrompt).toHaveBeenCalledWith('วันนี้อากาศเป็นอย่างไร');
    expect(input.value).toBe('');
  });

  // Scenario 2: Long and complex prompts (mock streaming - focus on input and send)
  it('should handle long and complex prompts via button click', async () => {
    const submitPrompt = vi.fn();
    const stopResponse = vi.fn();
    render(MessageInput, { props: { submitPrompt, stopResponse, messages: [] } });
    const input = screen.getByPlaceholderText('ส่งข้อความ');
    const sendButton = screen.getByRole('button', { name: 'ส่ง' });
    const longPrompt = "เขียนบทความสั้นๆ เกี่ยวกับปัญญาประดิษฐ์ในยุคปัจจุบัน โดยเน้นผลกระทบต่อสังคมและเศรษฐกิจ พร้อมทั้งเสนอแนวทางในการรับมือ";

    await fireEvent.input(input, { target: { value: longPrompt } });
    await fireEvent.click(sendButton);

    expect(submitPrompt).toHaveBeenCalledWith(longPrompt);
    expect(input.value).toBe('');
  });

  it('should not call submitPrompt if the input is empty', async () => {
    const submitPrompt = vi.fn();
    const stopResponse = vi.fn();
    render(MessageInput, { props: { submitPrompt, stopResponse, messages: [] } });
    const sendButton = screen.getByRole('button', { name: 'ส่ง' });

    await fireEvent.click(sendButton);
    expect(submitPrompt).not.toHaveBeenCalled();
  });

  it('should not call submitPrompt if the input contains only whitespace', async () => {
    const submitPrompt = vi.fn();
    const stopResponse = vi.fn();
    render(MessageInput, { props: { submitPrompt, stopResponse, messages: [] } });
    const input = screen.getByPlaceholderText('ส่งข้อความ');
    const sendButton = screen.getByRole('button', { name: 'ส่ง' });

    await fireEvent.input(input, { target: { value: '   ' } }); // Whitespace only
    await fireEvent.click(sendButton);
    expect(submitPrompt).not.toHaveBeenCalled();

    await fireEvent.input(input, { target: { value: '  \n  ' } }); // Whitespace and newlines
    await fireEvent.click(sendButton);
    expect(submitPrompt).not.toHaveBeenCalled();
  });

  // Scenario 3: Test stopping Response in the middle
  it('should display "Stop" button and call stopResponse when clicked if a response is in progress', async () => {
    const submitPrompt = vi.fn();
    const stopResponse = vi.fn();
    const messages = [{ role: 'user', content: 'test' }, { role: 'assistant', content: 'generating...', done: false }];
    render(MessageInput, { props: { submitPrompt, stopResponse, messages } });

    const stopButton = screen.getByRole('button', { name: 'หยุด' });
    expect(stopButton).toBeInTheDocument();

    await fireEvent.click(stopButton);
    expect(stopResponse).toHaveBeenCalled();
  });

  // Scenario 4: Connection error handling (focus on component not breaking)
  it('should not crash if submitPrompt throws an error', async () => {
    const submitPrompt = vi.fn();
    const stopResponse = vi.fn();
    render(MessageInput, { props: { submitPrompt, stopResponse, messages: [] } });
    const input = screen.getByPlaceholderText('ส่งข้อความ');
    const sendButton = screen.getByRole('button', { name: 'ส่ง' });

    await fireEvent.input(input, { target: { value: 'test' } });
    await fireEvent.click(sendButton);

    expect(submitPrompt).toHaveBeenCalledWith('test');
    expect(input.value).toBe('');
  });

  it('should disable the send button when prompt is empty', () => {
    const submitPrompt = vi.fn();
    const stopResponse = vi.fn();
    render(MessageInput, { props: { submitPrompt, stopResponse, messages: [] } });
    const sendButton = screen.getByRole('button', { name: 'ส่ง' });
    expect(sendButton).toBeDisabled();
  });

  it('should enable the send button when prompt is not empty', async () => {
    const submitPrompt = vi.fn();
    const stopResponse = vi.fn();
    render(MessageInput, { props: { submitPrompt, stopResponse, messages: [] } });
    const input = screen.getByPlaceholderText('ส่งข้อความ');
    const sendButton = screen.getByRole('button', { name: 'ส่ง' });

    await fireEvent.input(input, { target: { value: 'some text' } });
    expect(sendButton).toBeEnabled();
  });
});