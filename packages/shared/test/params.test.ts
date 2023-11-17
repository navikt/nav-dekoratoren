import { describe, it } from 'bun:test';

describe('Defaut values should not be altered', () => {
  it('should not alter default values', () => {
    const params = paramsSchema.safeParse({});
    console.log(params);
  });
});
