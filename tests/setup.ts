import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

expect.use(chaiAsPromised);

export {};

// Make test functions global
declare global {
  function describe(description: string, callback: () => void): void;
  function it(description: string, callback: () => void): void;
  function before(callback: () => void): void;
  function beforeEach(callback: () => void): void;
  function after(callback: () => void): void;
  function afterEach(callback: () => void): void;
}