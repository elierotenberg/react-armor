const { describe, it } = global;
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import should from 'should/as-function';

import { transformTagNames } from '..';

describe('transformTagNames', () => {
  it('x-uppercases all class names', () => {
    function Bar() {
      return <span className='bar'>{'bar'}</span>;
    }

    @transformTagNames((tagName) => `x-${tagName.toUpperCase()}`)
    class Foo extends React.Component {
      render() {
        return <div className='foo'><Bar /></div>;
      }
    }

    const actual = ReactDOMServer.renderToStaticMarkup(<Foo />);
    const expected = ReactDOMServer.renderToStaticMarkup(
      <x-DIV class='foo'>
        <x-SPAN class='bar'>{'bar'}</x-SPAN>
      </x-DIV>
    );
    should(actual).be.exactly(expected);
  });
});
