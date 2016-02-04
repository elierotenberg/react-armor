import React from 'react';

function transformComponentsInNode(node, transformComponent) {
  if(typeof node === 'string' || typeof node === 'number') {
    return node;
  }
  const { type, props } = node;
  if(typeof type === 'string') {
    // "Native" (eg. DOM) types: pass through children
    const { children } = props; // eslint-disable-line react/prop-types
    console.warn({ node });
    console.warn({ children });
    const nextChildren = React.Children.toArray(children).map((childNode) => {
      console.warn({ childNode });
      const nextChildNode = transformComponentsInNode(childNode, transformComponent);
      console.warn({ nextChildNode });
      return nextChildNode;
    });
    const nextNode = React.createElement(type, { ...props, children: nextChildren });
    return nextNode;
  }
  // "Components" (ie. user-defined): don't pass through children; they will be transformed later
  return React.createElement(
    transformComponents(transformComponent)(type), // eslint-disable-line no-use-before-define
    props,
  );
}

// Memoize calls to avoid creating many equivalent types without referential identity
const memo = new WeakMap();
function transformComponents(transformComponent = (Component) => Component) {
  if(!memo.has(transformComponent)) {
    memo.set(transformComponent, new WeakMap());
  }
  const localMemo = memo.get(transformComponent);
  return (Component) => {
    if(!localMemo.has(Component)) {
      const transComponent = transformComponent(Component);
      if(typeof transComponent.prototype.render === 'function') {
        localMemo.set(Component, class extends transComponent {
          render() {
            return transformComponentsInNode(Reflect.apply(transComponent.prototype.render, this), transformComponent);
          }
        });
      }
      else {
        localMemo.set(Component, Object.assign(
          (props) => transformComponentsInNode(transComponent(props), transformComponent)),
          { propTypes: transComponent.propTypes },
        );
      }
    }
    return localMemo.get(Component);
  };
}

export default transformComponents;
