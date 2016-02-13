import should from 'should/as-function';
const { describe, it } = global;

import '..';
import ComplexClass from './fixtures/ComplexClass';

describe('sanity', () => {
  it('shouldjs should not extend Object.prototype', () => should(Object.prototype).not.have.property('should'));
  it('Complex class transforms should work', () => {
    const TEN = 10;
    const THIRTYFIVE = 35;
    const inst = new ComplexClass(TEN);
    should(inst).be.an.instanceOf(ComplexClass);
    should(inst.v).be.exactly(TEN);
    const multiplyByFortyFive = inst.multiplyByFortyFive;
    should(multiplyByFortyFive()).be.exactly(TEN * THIRTYFIVE);
    should(ComplexClass.multiplyByFortyFive(TEN)).be.exactly(TEN * THIRTYFIVE);
  });
  it('should transform async functions properly', () => {
    async function asyncFunc() {
      const result = await Promise.resolve('foobar');
      return result;
    }

    return asyncFunc().then((result) => should(result).be.exactly('foobar'));
  });
});
