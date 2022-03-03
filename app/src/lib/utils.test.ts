import { millisecondsToDuration } from './utils';

describe('Utils Tests', () => {
  test('should convert milliseconds to duration', () => {
    const result = millisecondsToDuration(298999);
    const result2 = millisecondsToDuration(60999);

    expect(result).toBe('4:59');
    expect(result2).toBe('1:01');
  });
});
