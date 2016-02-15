const { describe, it } = global;
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import should from 'should/as-function';

import { Obfuscator } from '..';

describe('Obfuscator', () => {
  it('obfuscates React Elements', () => {
    const actual = <div className='bar'>
      <Obfuscator
        seed={'fizzbuzz'}
      >
      <div className='foo'>{'foo'}</div>
      </Obfuscator>
    </div>;
    const expected = <div className='bar'>
      <span>
        <div>
          <div>
            <span>
              <span>
                <span>
                  <div>
                    <div>
                      <div>
                        <span>
                          <div className='foo'>
                            {'foo'}
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                </span>
              </span>
            </span>
          </div>
        </div>
      </span>
    </div>;
    should(ReactDOMServer.renderToStaticMarkup(actual)).be.exactly(ReactDOMServer.renderToStaticMarkup(expected));
  });
});
