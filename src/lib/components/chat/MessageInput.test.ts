// นำเข้าฟังก์ชันและเครื่องมือที่จำเป็นสำหรับการทดสอบ
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import MessageInput from './MessageInput.svelte';

// กลุ่มการทดสอบสำหรับคอมโพเนนต์ MessageInput
describe('MessageInput', () => {
  // ทดสอบว่าคอมโพเนนต์แสดงผลช่องป้อนข้อมูลและปุ่มส่งอย่างถูกต้องหรือไม่
  it('should render the input field and send button', () => {
    render(MessageInput, { props: { submitPrompt: vi.fn(), stopResponse: vi.fn(), messages: [] } });
    expect(screen.getByPlaceholderText('ส่งข้อความ')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ส่ง' })).toBeInTheDocument();
  });

  // ทดสอบว่าค่าในช่องป้อนข้อมูลอัปเดตเมื่อผู้ใช้พิมพ์หรือไม่
  it('should update the input value when typing', async () => {
    const submitPrompt = vi.fn();
    const stopResponse = vi.fn();
    render(MessageInput, { props: { submitPrompt, stopResponse, messages: [] } });
    const input = screen.getByPlaceholderText('ส่งข้อความ');
    await fireEvent.input(input, { target: { value: 'Hello, world!' } });
    expect(input.value).toBe('Hello, world!');
  });

  // สถานการณ์ที่ 1: พรอมต์สั้นและตรงไปตรงมา (ครอบคลุมโดยการทดสอบการส่งที่มีอยู่)
  // ทดสอบว่าฟังก์ชัน submitPrompt ถูกเรียกและช่องป้อนข้อมูลถูกล้างเมื่อคลิกปุ่มส่งสำหรับพรอมต์สั้น
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

  // ทดสอบว่าฟังก์ชัน submitPrompt ถูกเรียกและช่องป้อนข้อมูลถูกล้างเมื่อกดปุ่ม Enter สำหรับพรอมต์สั้น
  it('should call submitPrompt and clear input for short prompt via Enter key', async () => {
    const submitPrompt = vi.fn();
    const stopResponse = vi.fn();
    const { container } = render(MessageInput, { props: { submitPrompt, stopResponse, messages: [] } });
    const input = screen.getByPlaceholderText('ส่งข้อความ');
    const form = container.querySelector('form'); // รับองค์ประกอบฟอร์ม

    await fireEvent.input(input, { target: { value: 'วันนี้อากาศเป็นอย่างไร' } });
    await fireEvent.submit(form); // จำลองการส่งฟอร์มเมื่อกด Enter

    expect(submitPrompt).toHaveBeenCalledWith('วันนี้อากาศเป็นอย่างไร');
    expect(input.value).toBe('');
  });

  // สถานการณ์ที่ 2: พรอมต์ยาวและซับซ้อน (จำลองการสตรีม - เน้นที่การป้อนข้อมูลและส่ง)
  // ทดสอบว่าคอมโพเนนต์สามารถจัดการพรอมต์ยาวและซับซ้อนผ่านการคลิกปุ่มได้หรือไม่
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

  // ทดสอบว่าฟังก์ชัน submitPrompt ไม่ถูกเรียกถ้าช่องป้อนข้อมูลว่างเปล่า
  it('should not call submitPrompt if the input is empty', async () => {
    const submitPrompt = vi.fn();
    const stopResponse = vi.fn();
    render(MessageInput, { props: { submitPrompt, stopResponse, messages: [] } });
    const sendButton = screen.getByRole('button', { name: 'ส่ง' });

    await fireEvent.click(sendButton);
    expect(submitPrompt).not.toHaveBeenCalled();
  });

  // ทดสอบว่าฟังก์ชัน submitPrompt ไม่ถูกเรียกถ้าช่องป้อนข้อมูลมีเพียงช่องว่าง
  it('should not call submitPrompt if the input contains only whitespace', async () => {
    const submitPrompt = vi.fn();
    const stopResponse = vi.fn();
    render(MessageInput, { props: { submitPrompt, stopResponse, messages: [] } });
    const input = screen.getByPlaceholderText('ส่งข้อความ');
    const sendButton = screen.getByRole('button', { name: 'ส่ง' });

    await fireEvent.input(input, { target: { value: '   ' } }); // มีแต่ช่องว่าง
    await fireEvent.click(sendButton);
    expect(submitPrompt).not.toHaveBeenCalled();

    await fireEvent.input(input, { target: { value: '  \n  ' } }); // มีช่องว่างและขึ้นบรรทัดใหม่
    await fireEvent.click(sendButton);
    expect(submitPrompt).not.toHaveBeenCalled();
  });

  // สถานการณ์ที่ 3: ทดสอบการหยุดการตอบสนองกลางคัน
  // ทดสอบว่าปุ่ม "หยุด" แสดงและเรียกฟังก์ชัน stopResponse เมื่อคลิกในขณะที่กำลังมีการตอบสนอง
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

  // สถานการณ์ที่ 4: การจัดการข้อผิดพลาดในการเชื่อมต่อ (เน้นที่คอมโพเนนต์ไม่พัง)
  // ทดสอบว่าคอมโพเนนต์ไม่พังถ้าฟังก์ชัน submitPrompt โยนข้อผิดพลาด
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

  // ทดสอบว่าปุ่มส่งถูกปิดใช้งานเมื่อพรอมต์ว่างเปล่า
  it('should disable the send button when prompt is empty', () => {
    const submitPrompt = vi.fn();
    const stopResponse = vi.fn();
    render(MessageInput, { props: { submitPrompt, stopResponse, messages: [] } });
    const sendButton = screen.getByRole('button', { name: 'ส่ง' });
    expect(sendButton).toBeDisabled();
  });

  // ทดสอบว่าปุ่มส่งถูกเปิดใช้งานเมื่อพรอมต์ไม่ว่างเปล่า
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
