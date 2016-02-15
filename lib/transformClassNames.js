import React from 'react';
import traverse, { transformComponents, wrapRender } from 'react-traverse';

export function transformClassNamesInNode(transformClassName) {
  return (node) => traverse(node, {
    DOMElement(path) {
      if(typeof path.node.props.className !== 'string') {
        return path.defaultTraverse();
      }
      return React.cloneElement(
        path.node,
        Object.assign({}, path.node.props, {
          className: path.node.props.className
            .split(' ')
            .map(transformClassName)
          .join(' '),
        }),
        ...path.traverseChildren(),
      );
    },
  });
}

export default function transformClassNames(transformClassName) {
  return transformComponents(wrapRender(transformClassNamesInNode(transformClassName)));
}
