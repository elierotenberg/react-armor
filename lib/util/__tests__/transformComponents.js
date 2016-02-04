const { describe, it } = global;
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import transformComponents from '../transformComponents';
import transformNode from '../transformNode';

describe('transformComponents', () => {
  it('wraps in quote', () => {
    class TestList extends React.Component {
      static displayName = 'TestList';
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

    function quoteAllText(node) {
      return transformNode(node, (element) => {
        if(typeof element === 'string') {
          return <quote>{element}</quote>;
        }
        return element;
      });
    }

    function transformComponent(Component) {
      if(typeof Component.prototype.render) {
        return class extends Component {
          render() {
            const node = Reflect.apply(Component.prototype.render, this);
            return quoteAllText(node);
          }
        };
      }
      return (props) => {
        const node = Component(props); // eslint-disable-line new-cap
        return quoteAllText(node);
      };
    }

    const QuotedTest = transformComponents(transformComponent)(TestList);

    console.warn(ReactDOMServer.renderToStaticMarkup(<QuotedTest items={['foo', 'bar']} />));
  });
});
