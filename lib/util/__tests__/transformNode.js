const { describe, it } = global;
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import _ from 'lodash';
import should from 'should/as-function';

import transformNode from '../transformNode';

const FORTY_TWO = 42;
const LEET = 1337;

describe('transformNode', () => {
  it('convert divs to spans', () => {
    function transformDivsToSpans(element) {
      return React.createElement(
        element.type === 'div' ? 'span' : element.type,
        element.props,
      );
    }
    const vdom = <div>
      <div key={0}>{'Hello'}</div>
      <div key={1}>{'World'}</div>
      <ul>
        <li key={'a'}><div>{FORTY_TWO}</div></li>
        <li key={'b'}><div>{LEET}</div></li>
      </ul>
    </div>;
    const tvdom = transformNode(vdom, transformDivsToSpans);
    should(ReactDOMServer.renderToStaticMarkup(tvdom)).be.exactly(
      '<span><span>Hello</span><span>World</span><ul><li><span>42</span></li><li><span>1337</span></li></ul></span>',
    );
  });
  it('reverses children', () => {
    function transformReverseChildren(element) {
      const { props } = element;
      const { children } = props;
      const revChildren = React.Children.toArray(children).reverse();
      return React.cloneElement(element,
        _.omit(element.props, 'children'),
        ...revChildren,
      );
    }
    const vdom = <div>
      <div key={0}>{'Hello'}</div>
      <div key={1}>{'World'}</div>
      <ul>
        <li key={'a'}>{FORTY_TWO}</li>
        <li key={'b'}>{LEET}</li>
      </ul>
    </div>;
    const tvdom = transformNode(vdom, transformReverseChildren);
    should(ReactDOMServer.renderToStaticMarkup(tvdom)).be.exactly(
      '<div><ul><li>1337</li><li>42</li></ul><div>World</div><div>Hello</div></div>',
    );
  });
});
