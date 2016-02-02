import React from 'react';

function transformAllComponents(node, transformNodeDown, transformNodeUp) {
  if(typeof node === 'string' || typeof node === 'number') {
    return node;
  }
  const { type, props } = node;
  if(typeof type === 'string') {
    // "Native" (eg. DOM) types: pass through children
    const { children } = props; // eslint-disable-line react/prop-types
    const nextChildren = React.Children.map(children, (childNode) => transformAllComponents(childNode));
    const nextNode = React.createElement(type, { ...props, children: nextChildren });
    return nextNode;
  }
  // "Components" (ie. user-defined): don't pass through children; they will be transformed later
  return React.createElement(
    transformComponent(transformNodeDown, transformNodeUp)(type), // eslint-disable-line no-use-before-define
    props,
  );
}

// Memoize calls to avoid creating many equivalent types without referential identity
const memo = new WeakMap();
function transformComponent(transformNodeDown = (node) => node, transformNodeUp = (node) => node) {
  if(!memo.has(transformNodeDown)) {
    memo.set(transformNodeDown, new WeakMap());
  }
  if(!memo.get(transformNodeDown).has(transformNodeUp)) {
    memo.get(transformNodeDown).set(transformNodeUp, new WeakMap());
  }
  const localMemo = memo.get(transformNodeDown).get(transformNodeUp);
  return (Component) => {
    if(!localMemo.has(Component)) {
      if(typeof Component.prototype.render === 'function') {
        localMemo.set(Component, class extends Component {
          render() {
            const node = Reflect.apply(Component.prototype.render, this);
            const preNode = transformNodeDown(node);
            const postNode = transformAllComponents(preNode, transformNodeDown, transformNodeUp);
            return transformNodeUp(postNode);
          }
        });
      }
      else {
        localMemo.set(Component, Object.assign((props) => {
          const render = Component;
          const node = render(props);
          const preNode = transformNodeDown(node);
          const postNode = transformAllComponents(preNode, transformNodeDown, transformNodeUp);
          return transformNodeUp(postNode);
        }, {
          propTypes: Component.propTypes,
        }));
      }
    }
    return localMemo.get(Component);
  };
}

export default transformComponent;
