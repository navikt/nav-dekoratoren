import { describe, it, expect } from 'bun:test';
import { partytownConfig } from './partytown';

describe('party town', () => {
  it('lib path should and end start with a slash', () => {
    expect(partytownConfig.lib).toStartWith('/');
    expect(partytownConfig.lib).toEndWith('/');
  });
});
