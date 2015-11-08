import should from 'should/as-function';
const { describe, it } = global;

import index from '../';

describe('sanity', () =>
  it('shouldjs should not extend Object.prototype', () => should(Object.prototype).not.have.property('should'))
);

describe('index', () =>
  it('should export an object', () => should(index).be.an.Object())
);
