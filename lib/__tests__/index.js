const { describe, it } = global;
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import should from 'should/as-function';

import { Obfuscator, obfuscateClassNames, obfuscateTagNames } from '..';
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

describe('putting it all together', () => {
  it('works fine when all tools are used', () => {
    const seed = 'foobar';

    function Bar() {
      return <div className='Bar'>
        <Obfuscator seed={seed}>
          <ul className='Bar-ul'>
            <li className='Bar-ul-li' key='a'>{'bar A'}</li>
            <li className='Bar-ul-li' key='b'>{'bar B'}</li>
          </ul>
        </Obfuscator>
      </div>;
    }

    class Foo extends React.Component {
      render() {
        return <div className='Foo'>
          <h1>{'Here be Bar'}</h1>
          <Bar />
        </div>;
      }
    }

    const actual = ReactDOMServer.renderToStaticMarkup(
      obfuscateTagNames({ seed })(
        obfuscateClassNames({ seed })(
          <Foo />
        ),
      ),
    );

    const expected = ReactDOMServer.renderToStaticMarkup(
      <ecb-ec1b6 class='11f5b410'>
        <h1>{'Here be Bar'}</h1>
        <ecb-ec1b6 class='34ac2cc1'>
          <aca-169a2>
            <ecb-ec1b6>
              <aca-169a2>
                <aca-169a2>
                  <aca-169a2>
                    <aca-169a2>
                      <ecb-ec1b6>
                        <ecb-ec1b6>
                          <aca-169a2>
                            <aca-169a2>
                              <ul className='cf5ef38d'>
                                <li className='caf82c92'>{'bar A'}</li>
                                <li className='caf82c92'>{'bar B'}</li>
                              </ul>
                            </aca-169a2>
                          </aca-169a2>
                        </ecb-ec1b6>
                      </ecb-ec1b6>
                    </aca-169a2>
                  </aca-169a2>
                </aca-169a2>
              </aca-169a2>
            </ecb-ec1b6>
          </aca-169a2>
        </ecb-ec1b6>
      </ecb-ec1b6>
    );

    should(actual).be.exactly(expected);
  });
});
