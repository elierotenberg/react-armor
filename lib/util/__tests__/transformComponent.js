const { describe, it } = global;
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import transformComponent from '../transformComponent';

describe('transformComponent', () => {
  it('wraps in quote', () => {
    class TestList extends React.Component {
      static propTypes = {
        items: React.PropTypes.array,
      };
      render() {
        const { items } = this.props;
        return <ul>{
          items.map((item, key) => <li key={key}><TestItem item={item} /></li>)
        }</ul>;
      }
    }

    function TestItem({ item }) {
      return <span>{item}</span>;
    }
    TestItem.propTypes = {
      item: React.PropTypes.string,
    };

    function transformDown(node) {
      return <quote>{node}</quote>;
    }

    const QuotedTest = transformComponent(transformDown)(TestList);

    console.warn(ReactDOMServer.renderToStaticMarkup(<QuotedTest items={['foo', 'bar']} />));
  });
});
