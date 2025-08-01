import { describe, it, expect } from 'vitest';
import { splitStream, convertMessagesToHistory } from './index';

describe('convertMessagesToHistory', () => {
  it('should convert a flat array to a tree structure', () => {
    const messages = [
      { content: 'A' },
      { content: 'B' },
      { content: 'C' }
    ];
    const history = convertMessagesToHistory(messages);
    expect(Object.keys(history.messages).length).toBe(3);
    expect(history.currentId).not.toBeNull();
  });
});

describe('splitStream', () => {
  it('should split input on delimiter', async () => {
    const stream = splitStream('\n');
    const writer = stream.writable.getWriter();
    const reader = stream.readable.getReader();
    await writer.write('a\nb\n');
    await writer.close();
    const results = [];
    let timeout = 0;
    while (timeout < 10) {
      const { value, done } = await reader.read();
      if (done) break;
      results.push(value);
      timeout++;
    }
    expect(results).toEqual(['a', 'b', '']);
  }, 1000);
});
