// นำเข้าฟังก์ชันที่จำเป็นสำหรับการทดสอบ
import { describe, it, expect } from 'vitest';
import { splitStream } from './index';

// กลุ่มการทดสอบสำหรับฟังก์ชัน splitStream
describe('splitStream', () => {
  // ทดสอบว่าสตรีมถูกแบ่งตามตัวคั่นที่กำหนดอย่างถูกต้องหรือไม่
  it('should split a stream by a given delimiter', async () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue('hello\nworld\n');
        controller.close();
      },
    });

    const transformedStream = stream.pipeThrough(splitStream('\n'));
    const reader = transformedStream.getReader();

    const result1 = await reader.read();
    expect(result1.value).toBe('hello');
    expect(result1.done).toBe(false);

    const result2 = await reader.read();
    expect(result2.value).toBe('world');
    expect(result2.done).toBe(false);

    const result3 = await reader.read();
    expect(result3.value).toBe(undefined);
    expect(result3.done).toBe(true);
  });

  // ทดสอบการจัดการกับส่วนของข้อมูล (chunks) ที่ไม่ได้ลงท้ายด้วยตัวคั่น
  it('should handle chunks that do not end with a delimiter', async () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue('part1');
        controller.enqueue('part2\n');
        controller.enqueue('part3');
        controller.close();
      },
    });

    const transformedStream = stream.pipeThrough(splitStream('\n'));
    const reader = transformedStream.getReader();

    const result1 = await reader.read();
    expect(result1.value).toBe('part1part2');
    expect(result1.done).toBe(false);

    const result2 = await reader.read();
    expect(result2.value).toBe('part3');
    expect(result2.done).toBe(false);

    const result3 = await reader.read();
    expect(result3.value).toBe(undefined);
    expect(result3.done).toBe(true);
  });

  // ทดสอบการจัดการกับสตรีมที่ว่างเปล่า
  it('should handle empty stream', async () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.close();
      },
    });

    const transformedStream = stream.pipeThrough(splitStream('\n'));
    const reader = transformedStream.getReader();

    const result = await reader.read();
    expect(result.value).toBe(undefined);
    expect(result.done).toBe(true);
  });

  // ทดสอบการจัดการกับสตรีมที่มีเพียงตัวคั่น
  it('should handle stream with only delimiter', async () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue('\n');
        controller.close();
      },
    });

    const transformedStream = stream.pipeThrough(splitStream('\n'));
    const reader = transformedStream.getReader();

    const result1 = await reader.read();
    expect(result1.value).toBe('');
    expect(result1.done).toBe(false);

    const result2 = await reader.read();
    expect(result2.value).toBe(undefined);
    expect(result2.done).toBe(true);
  });
});
