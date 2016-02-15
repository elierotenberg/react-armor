import React from 'react';
import traverse, { transformComponents, wrapRender } from 'react-traverse';

const NOT_FOUND = -1;

export function transformTagNamesInNode(transformTagName) {
  return (node) => traverse(node, {
    DOMElement(path) {
      const className = path.node.props.className;
      const type = transformTagName(path.node.type);
      if(type.indexOf('-') === NOT_FOUND) { // not a custom element
        return React.createElement(
          type,
          path.node.props,
          ...path.traverseChildren(),
        );
      }
      return React.createElement(
        transformTagName(path.node.type),
        // custom element special case, see https://github.com/facebook/react/issues/4933
        Object.assign({}, path.node.props, { className: void 0 }, { 'class': className }),
        ...path.traverseChildren()
      );
    },
  });
}

export default function transformTagNames(transformTagName) {
  return transformComponents(wrapRender(transformTagNamesInNode(transformTagName)));
}
