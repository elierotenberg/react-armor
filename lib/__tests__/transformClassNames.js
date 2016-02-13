const { describe, it } = global;
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import should from 'should/as-function';

import { transformClassNames } from '..';

describe('transformClassNames', () => {
  it('uppercases all class names', () => {
    function Bar() {
      return <div className='bar'>{'bar'}</div>;
    }

    @transformClassNames((className) => className.toUpperCase())
    class Foo extends React.Component {
      render() {
        return <div className='foo'><Bar /></div>;
      }
    }

    const actual = ReactDOMServer.renderToStaticMarkup(<Foo />);
    const expected = ReactDOMServer.renderToStaticMarkup(
      <div className='FOO'>
        <div className='BAR'>{'bar'}</div>
      </div>
    );
    should(actual).be.exactly(expected);
  });
});
