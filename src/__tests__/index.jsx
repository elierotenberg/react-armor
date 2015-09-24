import should from 'should/as-function';
const { describe, it } = global;

import index from '../';

describe('index', () => {
  it('should export an object', () => should(index).be.an.Object());
});
